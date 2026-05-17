import { GoogleGenAI } from "@google/genai";

export interface CheckResult {
  isCorrect: boolean;
  feedback: string;
  correctAnswer: string;
}

// Initialize Gemini API
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const checkTranslation = async (
  uzbekSentence: string,
  userTranslation: string,
  tense: string
): Promise<CheckResult> => {
  try {
    const prompt = `
      You are an English teacher. 
      Task: Check if the English translation of the following Uzbek sentence is correct, specifically focusing on the ${tense} tense.
      
      Uzbek sentence: "${uzbekSentence}"
      User's English translation: "${userTranslation}"
      
      Instructions:
      1. If it's correct (minor punctuation/capitalization errors are okay), set isCorrect to true.
      2. Provide a detailed explanation of any errors in Uzbek. 
         - If there's a mistake, explain exactly what is wrong (e.g., wrong auxiliary verb, incorrect verb form, spelling, or word order).
         - Explain why it's a mistake in the context of the ${tense} tense.
         - If it's correct, provide a short encouraging feedback in Uzbek.
      3. Provide the most natural correct English translation.
      
      Return the result in JSON format with the following keys:
      {
        "isCorrect": boolean,
        "feedback": "string",
        "correctAnswer": "string"
      }
      
      IMPORTANT: Return ONLY the JSON object, no other text.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const result = JSON.parse(text);
    return {
      isCorrect: !!result.isCorrect,
      feedback: result.feedback || "Xatolik yuz berdi.",
      correctAnswer: result.correctAnswer || "",
    };
  } catch (error) {
    console.error("AI API error:", error);
    return {
      isCorrect: false,
      feedback: "Kechirasiz, tekshirishda xatolik yuz berdi. Iltimos qaytadan urunib ko'ring.",
      correctAnswer: "",
    };
  }
};

export const sendMessage = async (messages: { role: string; content: string }[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are a helpful English teacher assistant. Answer questions about English grammar, tenses, and vocabulary in Uzbek. Keep your answers concise and encouraging.",
      },
      history: messages.slice(0, -1).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }))
    });

    const lastMessage = messages[messages.length - 1].content;
    const response = await chat.sendMessage({ message: lastMessage });
    
    return response.text || "Xatolik yuz berdi.";
  } catch (error) {
    console.error("Chat API error:", error);
    return "Kechirasiz, xatolik yuz berdi. Iltimos qaytadan urunib ko'ring.";
  }
};
