import { GoogleGenAI, Type } from "@google/genai";
import { Definitions } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const definitionSchema = {
  type: Type.OBJECT,
  properties: {
    definitions: {
      type: Type.ARRAY,
      description: "An array of word-definition pairs.",
      items: {
        type: Type.OBJECT,
        properties: {
          word: {
            type: Type.STRING,
            description: "The original word.",
          },
          definition: {
            type: Type.STRING,
            description: "A simple, one-sentence definition suitable for a young learner (under 20 words). The definition must not contain the word it is defining.",
          },
        },
        required: ["word", "definition"],
      },
    },
  },
  required: ["definitions"],
};

export const fetchDefinitions = async (words: string[]): Promise<Definitions> => {
  if (!API_KEY) {
    throw new Error("API key not configured.");
  }
  
  if (words.length === 0) {
    return {};
  }

  const prompt = `For each word in the following list, provide a simple, one-sentence definition suitable for a young learner (under 20 words). Crucially, the definition for a word must not contain the word itself. If a word cannot be defined, provide "Definition not found.". Words: ${words.join(', ')}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: definitionSchema,
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    const definitionsResult: Definitions = {};
    if (parsed.definitions && Array.isArray(parsed.definitions)) {
      parsed.definitions.forEach((item: { word: string; definition: string }) => {
        definitionsResult[item.word] = item.definition;
      });
    }

    // Ensure all words have a definition, even if not found by the API
    words.forEach(word => {
        if (!definitionsResult[word]) {
            definitionsResult[word] = "Definition not found.";
        }
    });

    return definitionsResult;
  } catch (error) {
    console.error("Error fetching definitions from Gemini API:", error);
    throw new Error("Could not fetch definitions.");
  }
};

export const validateWord = async (word: string): Promise<boolean> => {
  if (!API_KEY) throw new Error("API key not configured.");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Is "${word}" a valid, common English word? Answer only with "yes" or "no".`,
    });
    return response.text.trim().toLowerCase() === 'yes';
  } catch (error) {
    console.error("Error validating word:", error);
    return false;
  }
};

export const generateParagraphWithWords = async (words: string[]): Promise<string> => {
    if (!API_KEY) throw new Error("API key not configured.");
    try {
        const prompt = `Write a short, simple paragraph for a young learner that naturally includes the following words: ${words.join(', ')}. Do not highlight, bold, or format the special words in any way.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating paragraph:", error);
        return "Could not generate the story. Please try again.";
    }
};