/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Video result from YouTube API
 */
export interface Video {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  url: string;
}

/**
 * Article result from Google Custom Search API
 */
export interface Article {
  id: string;
  title: string;
  website: string;
  snippet: string;
  url: string;
}

/**
 * Response from /api/search endpoint
 */
export interface SearchResponse {
  videos: Video[];
  articles: Article[];
  summary: string;
}

/**
 * Follow-up answer response
 */
export interface FollowUpResponse {
  answer: string;
}
