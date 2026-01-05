import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is missing from environment variables");
    }
    return new GoogleGenAI({ apiKey });
};

export const streamChatResponse = async (
    history: { role: string; text: string }[],
    context: string,
    onChunk: (text: string) => void
) => {
    try {
        const ai = getClient();
        const modelId = "gemini-3-flash-preview"; 
        
        const systemInstruction = `You are a helpful, enthusiastic AI assistant for a website. 
        Your knowledge base is strictly limited to the provided WEBSITE CONTENT context below.
        
        WEBSITE CONTENT:
        ${context.substring(0, 100000)} // Safety cap for context length
        
        Rules:
        1. Answer questions based ONLY on the provided content.
        2. If the user asks about something not in the content, politely say you can only help with information found on the page.
        3. Be concise and friendly.
        4. Do not mention you are reading a spreadsheet. Refer to it as "our website" or "us".`;

        const chat = ai.chats.create({
            model: modelId,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
            history: history.slice(0, -1).map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            })),
        });

        const lastMessage = history[history.length - 1].text;
        const result = await chat.sendMessageStream({ message: lastMessage });

        for await (const chunk of result) {
            const text = chunk.text; 
            if (text) {
                onChunk(text);
            }
        }

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        onChunk("Maaf, saya mengalami masalah saat terhubung. Silakan coba lagi nanti.");
    }
};

export const generateDatasetInsight = async (
    datasetsContext: string,
    onChunk: (text: string) => void
) => {
    try {
        if (!datasetsContext || datasetsContext.trim().length === 0) {
            onChunk("Tidak ada data yang cukup untuk dianalisis.");
            return;
        }

        const ai = getClient();
        const modelId = "gemini-3-flash-preview"; 
        const safeContext = datasetsContext.substring(0, 500000); 

        const prompt = `
        Analisis katalog dataset berikut dari "PORTAL SATU DATA SULA".
        Berikan ringkasan eksekutif komprehensif dalam Bahasa Indonesia yang mencakup:
        1. **Gambaran Umum Data**: Total jumlah, sektor utama yang dicakup, dan produsen data utama.
        2. **Tren Utama**: Pola dalam pengumpulan data (misalnya, tahun yang dicakup, frekuensi).
        3. **Sorotan**: Sebutkan 3-4 dataset menarik atau penting yang tersedia.
        4. **Rekomendasi**: Sarankan bagaimana data ini dapat berguna bagi pembuat kebijakan atau masyarakat.
        
        Format output dalam Markdown yang rapi menggunakan judul, poin-poin, dan teks tebal untuk keterbacaan. Gunakan Bahasa Indonesia yang formal dan profesional.

        DATASETS (Sampel):
        ${safeContext}
        `;

        const response = await ai.models.generateContentStream({
            model: modelId,
            contents: prompt,
            config: {
                temperature: 0.4, 
            }
        });

        for await (const chunk of response) {
            const text = chunk.text; 
            if (text) {
                onChunk(text);
            }
        }
    } catch (error: any) {
        console.error("Gemini Insight Error:", error);
        if (error.message && (error.message.includes('status code: 0') || error.message.includes('Failed to fetch'))) {
             onChunk("Gagal terhubung ke layanan AI (Masalah Koneksi). Pastikan Anda online dan API Key valid.");
        } else {
             onChunk("Tidak dapat menghasilkan wawasan saat ini. Silakan coba lagi nanti.");
        }
    }
};

export const generateImage = async (prompt: string, aspectRatio: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio as any,
                imageSize: "1K"
            },
        },
    });

    for (const part of response.candidates?.[0].content.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image was generated");
};
