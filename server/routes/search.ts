import { RequestHandler } from "express";
import { SearchResponse, Video, Article } from "@shared/api";

async function searchYouTube(query: string): Promise<Video[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.append("part", "snippet");
  url.searchParams.append("q", query);
  url.searchParams.append("type", "video");
  url.searchParams.append("maxResults", "5");
  url.searchParams.append("key", apiKey);

  const response = await fetch(url.toString());
  const data: any = await response.json();

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
}

async function searchArticles(query: string): Promise<Article[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !engineId)
    throw new Error("Google Custom Search credentials not configured");

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.append("q", query);
  url.searchParams.append("cx", engineId);
  url.searchParams.append("key", apiKey);
  url.searchParams.append("num", "5");

  const response = await fetch(url.toString());
  const data: any = await response.json();

  if (!data.items) return [];

  return data.items.map((item: any, index: number) => ({
    id: `article-${index}`,
    title: item.title,
    website: new URL(item.link).hostname || "Unknown",
    snippet: item.snippet,
    url: item.link,
  }));
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
    const summary = await generateSummary(q, videos, articles, selectedLanguage);

    const response: SearchResponse = {
      videos,
      articles,
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
