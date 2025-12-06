/**
 * Service to interact with the local Ollama instance.
 * Assumes Ollama is running on http://localhost:11434
 * IMPORTANT: Ollama must be started with OLLAMA_ORIGINS="*" to allow CORS.
 */

const OLLAMA_API_URL = 'http://localhost:11434/api/chat';
const MODEL_NAME = 'llama3.1';

export const chatWithOllama = async (userMessage) => {
    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    {
                        role: 'system',
                        content: "You are a helpful, encouraging, and witty AI Study Tutor. Your goal is to help the user learn, stay motivated, and answer questions about programming and other study topics. Keep your answers concise enough to be spoken out loud (mostly 1-3 sentences unless asked for a detailed explanation). Be friendly and occasionaly make a study-related joke."
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                stream: false
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.message.content;

    } catch (error) {
        console.error("Failed to connect to Ollama:", error);
        throw error; // Re-throw to be handled by the component
    }
};
