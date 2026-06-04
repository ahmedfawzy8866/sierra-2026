import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GOOGLE_AI_API_KEY is not defined in your environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

// Default model to use
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export default genAI;
