import { RequestHandler } from "express";
import { FollowUpResponse } from "@shared/api";

export const handleFollowUp: RequestHandler = async (req, res) => {
  try {
    const { originalQuery, followUpQuery } = req.body;

    if (!followUpQuery || typeof followUpQuery !== "string") {
      return res.status(400).json({ error: "Missing follow-up query" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const prompt = `The user asked: "How to ${originalQuery}"

Now they have a follow-up question: "${followUpQuery}"

Please provide a clear, concise answer to their follow-up question in the context of the original how-to guide.`;

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
        max_tokens: 800,
      }),
    });

    const data: any = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error(data.error?.message || "Failed to generate answer");
    }

    const answer = data.choices[0].message.content;

    const result: FollowUpResponse = {
      answer,
    };

    res.json(result);
  } catch (error) {
    console.error("Follow-up error:", error);
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate follow-up answer",
    });
  }
};
