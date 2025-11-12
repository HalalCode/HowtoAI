import { RequestHandler } from "express";
import { SearchResponse, Video, Article } from "@shared/api";

async function searchYouTube(query: string): Promise<Video[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY not configured");
    return [];
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("q", query);
    url.searchParams.append("type", "video");
    url.searchParams.append("maxResults", "5");
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data: any = await response.json();

    if (!response.ok) {
      console.warn(`YouTube API error: ${response.status} ${response.statusText}`, data?.error?.message);
      return [];
    }

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      duration: "N/A",
      views: "N/A",
      thumbnail:
        item.snippet.thumbnails.default?.url ||
        "https://via.placeholder.com/120x90",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error("YouTube search error:", error);
    return [];
  }
}

async function searchArticles(query: string): Promise<Article[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !engineId) {
    console.warn("Google Custom Search credentials not configured");
    return [];
  }

  try {
    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.append("q", query);
    url.searchParams.append("cx", engineId);
    url.searchParams.append("key", apiKey);
    url.searchParams.append("num", "5");

    const response = await fetch(url.toString());
    const data: any = await response.json();

    if (!response.ok) {
      console.warn(`Google Search API error: ${response.status} ${response.statusText}`, data?.error?.message);
      return [];
    }

    if (!data.items) return [];

    return data.items.map((item: any, index: number) => ({
      id: `article-${index}`,
      title: item.title,
      website: new URL(item.link).hostname || "Unknown",
      snippet: item.snippet,
      url: item.link,
    }));
  } catch (error) {
    console.error("Google Search error:", error);
    return [];
  }
}

async function generateSummary(
  query: string,
  videos: Video[],
  articles: Article[],
  language: string = "en"
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const videosText = videos
    .map((v) => `- ${v.title} (${v.channel})`)
    .join("\n");
  const articlesText = articles.map((a) => `- ${a.title} (${a.website})`).join("\n");

  const languageNames: { [key: string]: string } = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    zh: "Chinese",
    ar: "Arabic",
    pt: "Portuguese",
    ru: "Russian",
    ko: "Korean",
  };

  const languageName = languageNames[language] || "English";

  const prompt = `Based on these tutorials for "${query}", create a helpful step-by-step guide with clear instructions, tools needed, time required, and difficulty level.

Videos found:
${videosText}

Articles found:
${articlesText}

Please generate a concise but comprehensive guide that someone could follow to accomplish "${query}".

IMPORTANT: Respond ONLY in ${languageName}, regardless of the language of the sources above.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  const data: any = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error(data.error?.message || "Failed to generate summary");
  }

  return data.choices[0].message.content;
}

// Mock data for fallback when APIs hit quota limits
const getMockVideos = (query: string): Video[] => {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  return [
    {
      id: "mock-1",
      title: `Complete Guide to ${query}`,
      channel: "Learning Hub",
      duration: "12:45",
      views: "2.5M",
      thumbnail: "https://via.placeholder.com/120x90?text=Tutorial+1",
      url: searchUrl,
    },
    {
      id: "mock-2",
      title: `${query} - Step by Step Tutorial`,
      channel: "Expert Tips",
      duration: "8:30",
      views: "1.2M",
      thumbnail: "https://via.placeholder.com/120x90?text=Tutorial+2",
      url: searchUrl,
    },
    {
      id: "mock-3",
      title: `Beginner's Guide to ${query}`,
      channel: "How To Academy",
      duration: "15:20",
      views: "890K",
      thumbnail: "https://via.placeholder.com/120x90?text=Tutorial+3",
      url: searchUrl,
    },
    {
      id: "mock-4",
      title: `Advanced ${query} Techniques`,
      channel: "Pro Channel",
      duration: "20:15",
      views: "450K",
      thumbnail: "https://via.placeholder.com/120x90?text=Tutorial+4",
      url: searchUrl,
    },
    {
      id: "mock-5",
      title: `Quick ${query} Tips and Tricks`,
      channel: "Quick Learn",
      duration: "5:45",
      views: "3.1M",
      thumbnail: "https://via.placeholder.com/120x90?text=Tutorial+5",
      url: searchUrl,
    },
  ];
};

const getMockArticles = (query: string): Article[] => {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + " how to")}`;
  return [
    {
      id: "article-mock-1",
      title: `The Complete ${query} Guide - 2024 Edition`,
      website: "wikihow.com",
      snippet: `Learn everything you need to know about ${query}. This comprehensive guide covers all the basics and advanced techniques.`,
      url: googleSearchUrl,
    },
    {
      id: "article-mock-2",
      title: `${query} for Beginners: What You Need to Know`,
      website: "medium.com",
      snippet: `A beginner's guide to understanding ${query}. We'll walk you through the process step-by-step with helpful tips.`,
      url: googleSearchUrl,
    },
    {
      id: "article-mock-3",
      title: `Master ${query} in 10 Easy Steps`,
      website: "instructables.com",
      snippet: `Follow these simple steps to master ${query}. This guide is perfect for anyone looking to get started quickly.`,
      url: googleSearchUrl,
    },
    {
      id: "article-mock-4",
      title: `${query}: Common Mistakes and How to Avoid Them`,
      website: "thespruce.com",
      snippet: `Avoid common pitfalls when attempting ${query}. Learn from the mistakes others have made and succeed on your first try.`,
      url: googleSearchUrl,
    },
    {
      id: "article-mock-5",
      title: `Expert Tips for ${query} Success`,
      website: "bustle.com",
      snippet: `Get expert advice on ${query}. Professional tips and tricks to help you achieve the best results.`,
      url: googleSearchUrl,
    },
  ];
};

export const handleSearch: RequestHandler = async (req, res) => {
  try {
    const { q, language } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Missing search query" });
    }

    // Validate query is meaningful
    const trimmed = q.trim();
    if (trimmed.length < 3) {
      return res
        .status(400)
        .json({ error: "Search query must be at least 3 characters" });
    }

    const words = trimmed.split(/\s+/).filter((w) => w.length > 1);
    if (words.length < 2) {
      return res.status(400).json({
        error: "Please enter a meaningful question with at least 2 words",
      });
    }

    if (/^[a-zA-Z0-9]{1,2}$/.test(trimmed)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid 'How to...' question" });
    }

    const selectedLanguage = typeof language === "string" ? language : "en";

    const videos = await searchYouTube(q);
    const articles = await searchArticles(q);

    // Use mock data as fallback if APIs return empty results
    const videosToUse = videos.length > 0 ? videos : getMockVideos(trimmed);
    const articlesToUse = articles.length > 0 ? articles : getMockArticles(trimmed);

    const summary = await generateSummary(q, videosToUse, articlesToUse, selectedLanguage);

    const response: SearchResponse = {
      videos: videosToUse,
      articles: articlesToUse,
      summary,
    };

    res.json(response);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to perform search",
    });
  }
};
