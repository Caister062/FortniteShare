
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Strictly performs safety moderation. 
 * Checks for profanity and toxic language.
 */
export const checkSafety = async (text: string): Promise<boolean> => {
  const model = "gemini-3-flash-preview";
  try {
    // If text is very short and harmless looking, skip heavy AI check for speed
    if (text.length < 5 && !text.includes('?')) return true;

    const response = await ai.models.generateContent({
      model,
      contents: `You are a strict content moderator for a Fortnite community. 
      Analyze the message: "${text}". 
      Determine if it contains explicit profanity, hate speech, or severe toxicity.
      Ignore mild gaming slang (e.g., 'noob', 'bot', 'rekt').
      Reply with exactly one word: SAFE or UNSAFE.`,
    });
    
    const result = response.text?.trim().toUpperCase();
    return result !== "UNSAFE"; // Be permissive unless explicitly flagged
  } catch (error) {
    console.error("Moderation error:", error);
    // On API error, we allow the post to keep the app working, but log it
    return true; 
  }
};
