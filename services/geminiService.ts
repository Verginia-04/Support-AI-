import { GoogleGenAI } from "@google/genai";
import { AppData, Message } from '../types';
import { GEMINI_MODEL } from '../constants';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-now' });
};

export const sendMessageToGemini = async (
  currentMessage: string,
  history: Message[],
  contextData: AppData
): Promise<string> => {
  try {
    const ai = getAiClient();

    // Construct the context string from the uploaded/default data
    let systemContext = `
      You are a highly intelligent Server Support & Inventory Chatbot. 
      You have access to the following database:
    `;

    if (contextData.inventory && contextData.inventory.length > 0) {
      systemContext += `
      === INVENTORY DATA (JSON) ===
      ${JSON.stringify(contextData.inventory, null, 2)}
      =============================
      `;
    }

    if (contextData.knowledgeBase && contextData.knowledgeBase.length > 0) {
      systemContext += `
      === KNOWLEDGE BASE (JSON) ===
      ${JSON.stringify(contextData.knowledgeBase, null, 2)}
      =============================
      `;
    }

    if (contextData.rawText) {
      systemContext += `
      === UPLOADED DOCUMENT CONTENT (RAW TEXT) ===
      ${contextData.rawText}
      ============================================
      `;
    }

    systemContext += `
      YOUR INSTRUCTIONS:
      1. **Inventory Lookup**: If the user asks about a machine (e.g., specs, location, login), search the 'Inventory Data'. 
         - **Format**: Present the details in a **structured Markdown table** or a clean **bulleted list**.
         - **Fields**: Include App Name, Environment, CPU, Memory, Version, and Login Details.
      
      2. **Troubleshooting**: If the user describes an error or issue, search the 'Knowledge Base' OR the 'UPLOADED DOCUMENT CONTENT'.
         - **Match Found**: Provide the 'Solution' in clear, step-by-step instructions (use numbered lists). Use **bold** for key actions or interface elements.
         - **No Match Found**: You MUST say exactly: "I couldn't find a solution. Please contact [Manager Name], [Position] for this application." 
           (Use a relevant manager from the KB if possible, otherwise use a generic placeholder like "the IT Manager").

      3. **General Response Guidelines**: 
         - **Structure**: Use Markdown Headers (###) to separate distinct parts of your answer (e.g., ### Machine Details, ### Recommended Solution).
         - **Conciseness**: Be professional and helpful. Avoid wall-of-text paragraphs.
         - **Accuracy**: Do not hallucinate inventory details. Use the provided data only. If the answer is in the raw text document, extract and summarize it clearly.
    `;

    // Filter history to simple user/model turns for the prompt context
    // We only take the last 10 messages to keep context efficient, though Gemini 1.5/3 has a huge window.
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Generate content
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: systemContext,
        temperature: 0.2, // Low temperature for factual accuracy
      },
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: currentMessage }] }
      ]
    });

    return response.text || "I processed the request but received no text response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to the AI service. Please check your network or API key configuration.";
  }
};

export const generateChatTitle = async (userMessage: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        temperature: 0.5,
        maxOutputTokens: 20,
      },
      contents: [
        { 
          role: 'user', 
          parts: [{ text: `Generate a very concise (3-6 words) title for a chat session that starts with this query: "${userMessage}". Do not use quotes. Return only the title text.` }] 
        }
      ]
    });

    let title = response.text?.trim();
    // Fallback if empty or too long
    if (!title) {
      title = userMessage.slice(0, 30);
    }
    // Remove quotes if present
    title = title.replace(/^"|"$/g, '');
    
    return title;
  } catch (error) {
    console.error("Failed to generate title:", error);
    return userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '');
  }
};