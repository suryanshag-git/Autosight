/**
 * Central configuration for frontend environment variables and endpoints.
 * Supports Vercel production deployment and local development environments.
 */
const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const BACKEND_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
