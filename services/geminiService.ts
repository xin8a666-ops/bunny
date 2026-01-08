import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, ChatMessage } from "../types";

// Initialize Gemini Client
// CRITICAL: Using named parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Recipe Schema Definition (Reused)
const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    prepTime: { type: Type.STRING },
    cookTime: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ["简单", "中等", "困难"] },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING },
        },
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING },
        },
      },
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["title", "ingredients", "steps", "prepTime", "cookTime", "difficulty"],
};

/**
 * Generates a structured recipe based on user text input.
 */
export const generateRecipe = async (
  prompt: string,
  dietaryRestrictions: string
): Promise<Recipe> => {
  const model = "gemini-3-flash-preview";
  
  const fullPrompt = `请根据以下要求创建一个详细的烘焙食谱： "${prompt}"。
  饮食限制/偏好： "${dietaryRestrictions}"。
  请确保这是一个烘焙食谱（面包、蛋糕、饼干、糕点等）。
  请使用简体中文（Simplified Chinese）回复。`;

  const response = await ai.models.generateContent({
    model,
    contents: fullPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No recipe generated");

  const data = JSON.parse(text);
  
  return {
    ...data,
    id: Date.now().toString(),
  };
};

/**
 * Generates a recipe by analyzing an image.
 */
export const generateRecipeFromImage = async (
  base64Image: string,
  mimeType: string
): Promise<Recipe> => {
  const model = "gemini-3-flash-preview"; // Multimodal model

  // Clean base64 string if it contains the header
  const base64Data = base64Image.split(',')[1] || base64Image;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "请分析这张美食图片。识别这是什么烘焙食品（如果不是烘焙食品，请提供最接近的烘焙做法或拒绝）。\n" +
          "反推其主要食材和大概的制作步骤，生成一份详细的食谱。\n" +
          "请使用简体中文回复，并严格遵守JSON格式。"
  };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No recipe generated from image");

  const recipeData = JSON.parse(text);
  
  return {
    ...recipeData,
    id: Date.now().toString(),
    imageUrl: base64Image, // Use the uploaded image as the recipe image
  };
};

/**
 * Generates an image for a specific recipe title.
 * GUARANTEES to return a string URL (will use fallback if Gemini fails).
 */
export const generateRecipeImage = async (recipeTitle: string): Promise<string> => {
  // Define a robust fallback URL first (Pollinations)
  const seed = Math.floor(Math.random() * 10000);
  const safePrompt = encodeURIComponent(`${recipeTitle} bakery food delicious photography`);
  const fallbackUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;

  try {
    // Attempt 1: Gemini 2.5 Flash Image (Fast & Reliable)
    const model = "gemini-2.5-flash-image"; 
    const prompt = `Professional food photography of ${recipeTitle}, delicious, bakery style, soft lighting, 4k, high detail, centered composition.`;

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "4:3", 
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    // If Gemini returns no image data, fall back
    console.warn("Gemini returned no image data, using fallback.");
    return fallbackUrl;
    
  } catch (error) {
    console.warn("Gemini Image generation failed, falling back to Pollinations:", error);
    return fallbackUrl;
  }
};

/**
 * Chat with the AI Baking Assistant.
 */
export const chatWithChef = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    const model = "gemini-3-flash-preview";
    
    const chatHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }));

    const chatSession = ai.chats.create({
        model,
        history: chatHistory,
        config: {
             systemInstruction: "你是一位可爱的小兔烘焙师，名字叫'Bunny'（小兔）。你戴着蓝色贝雷帽，非常热情、活泼。你说话时喜欢用可爱的语气和颜文字（如 (🐰✧), (≧◡≦) ）。你非常专业，解释烘焙知识时通俗易懂。请使用简体中文。",
        }
    });

    const result = await chatSession.sendMessage({ message: newMessage });
    return result.text || "(｡•́︿•̀｡) 哎呀，面粉迷住眼睛了，能再说一遍吗？";
};