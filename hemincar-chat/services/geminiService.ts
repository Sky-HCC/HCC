import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;
  private modelName = 'gemini-2.5-flash';

  constructor() {
    // Note: In a real production app, ensure strict CSP and backend proxying if possible.
    // For this implementation, we use the env var directly as requested.
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.error("Gemini API Key is missing!");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Initializes or resets the chat session.
   */
  public startChat(): void {
    try {
      this.chatSession = this.ai.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          // Enable Google Search Grounding to find real-time info on hemincar.com
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (error) {
      console.error("Failed to start chat session:", error);
    }
  }

  /**
   * Sends a message to the model and yields chunks of text for streaming.
   * @param message User message string
   * @param contextLanguage Optional instruction to enforce language
   */
  public async *sendMessageStream(message: string, contextLanguage: string): AsyncGenerator<string> {
    if (!this.chatSession) {
      this.startChat();
    }

    if (!this.chatSession) {
      throw new Error("Chat session could not be initialized.");
    }

    try {
      // We prepend a small hidden context instruction to ensure language consistency
      // without cluttering the user's view of the history too much.
      const prompt = `[Respond in ${contextLanguage}] ${message}`;

      const result = await this.chatSession.sendMessageStream({ message: prompt });

      for await (const chunk of result) {
        // Safe casting based on SDK usage
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      yield "I apologize, but I'm having trouble connecting right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();