import { GoogleGenAI, Type } from "@google/genai";

// We do NOT initialize the client at the top level anymore.
// This prevents the entire app from crashing (White Screen) if the API KEY is missing or invalid on startup.

export const generateTagsForImage = async (base64Image: string): Promise<string[]> => {
  try {
    // Initialize inside the function call
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("Gemini API Key is missing. Skipping AI tagging.");
      return [];
    }

    const ai = new GoogleGenAI({ apiKey });

    // Strip header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this clothing item. Generate 3 to 6 short, relevant tags describing its color, type (e.g. t-shirt, skirt), sleeve length, material (if obvious), and season. Return ONLY the JSON array.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating tags:", error);
    return [];
  }
};
