/**
 * Central configuration for frontend environment variables and endpoints.
 * Supports Vercel production deployment and local development environments.
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
