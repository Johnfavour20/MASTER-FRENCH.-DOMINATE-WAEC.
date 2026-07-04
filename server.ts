import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini Client initialized successfully");
  } else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Running in mock-AI fallback mode.");
  }
} catch (err) {
  console.error("Error initializing Gemini client:", err);
}

// 1. Health API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiInitialized: ai !== null });
});

// 2. AI Validation API (Essay / Sentence checker)
app.post("/api/gemini/validate", async (req, res) => {
  const { text, promptContext } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text is required for validation" });
  }

  // Fallback response if AI is not initialized
  if (!ai) {
    return res.json({
      score: 75,
      corrections: [
        {
          original: text,
          corrected: text,
          explanation: "Note: Gemini API Key is missing. This is a local mock correction. Please set your GEMINI_API_KEY secret to enable live AI feedback!"
        }
      ],
      overallFeedback: "Bravo ! Vous avez écrit une phrase. Ajoutez votre clé API Gemini pour obtenir une évaluation grammaticale et sémantique détaillée en temps réel.",
      suggestedRewrite: text + " (Configuration requise)"
    });
  }

  try {
    const prompt = `You are an expert French Language Teacher and Examiner preparing West African students for the WAEC and JAMB examinations.
Analyze the following French text written by a student.
Provide constructive correction of any grammatical errors, spelling errors, or improper phrasing.
Evaluate the student's text and provide:
1. A score (out of 100) based on WAEC French essay assessment standards (Lexis, Structure, Content, Mechanical Accuracy).
2. A list of specific corrections showing the original fragment, corrected fragment, and an explanation in clear English.
3. Overall general feedback in encouraging French and English.
4. A suggested high-quality rewrite that sounds natural.

Student Text: "${text}"
${promptContext ? `Context/Topic of the task: "${promptContext}"` : ""}

Return the results in JSON format according to the specified schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "The evaluation score from 0 to 100."
            },
            corrections: {
              type: Type.ARRAY,
              description: "Specific grammatical, spelling, or styling corrections.",
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "The original incorrect phrase or word from the student." },
                  corrected: { type: Type.STRING, description: "The corrected phrase or word." },
                  explanation: { type: Type.STRING, description: "Explanation of why the correction was made, referencing WAEC/JAMB exam relevance where applicable." }
                },
                required: ["original", "corrected", "explanation"]
              }
            },
            overallFeedback: {
              type: Type.STRING,
              description: "General comments, feedback, and study tips."
            },
            suggestedRewrite: {
              type: Type.STRING,
              description: "A fully rewritten version of the text using correct and elegant French."
            }
          },
          required: ["score", "corrections", "overallFeedback", "suggestedRewrite"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text returned from Gemini");
    }

    const result = JSON.parse(responseText.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Validation Error:", error);
    res.status(500).json({
      error: "Failed to validate text using AI",
      details: error.message,
      // Provide a clean fallback so the app does not crash
      score: 70,
      corrections: [
        {
          original: text,
          corrected: text,
          explanation: "There was an error communicating with the AI validation backend. Please try again."
        }
      ],
      overallFeedback: "Erreur de connexion avec l'IA. Veuillez réessayer plus tard.",
      suggestedRewrite: text
    });
  }
});

// 3. AI Tutor Chat API
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  // Fallback response if AI is not initialized
  if (!ai) {
    return res.json({
      reply: "Bonjour ! Je suis votre tuteur d'IA La Plume. Malheureusement, l'API Gemini n'est pas encore configurée. Pour discuter en direct, veuillez configurer la variable GEMINI_API_KEY dans les secrets.",
      translation: "Hello! I am your La Plume AI tutor. Unfortunately, the Gemini API is not yet configured. To chat live, please configure the GEMINI_API_KEY variable in secrets.",
      vocab: [
        { word: "Bonjour", translation: "Hello / Good morning" },
        { word: "Tuteur d'IA", translation: "AI Tutor" },
        { word: "S'il vous plaît", translation: "Please" }
      ]
    });
  }

  try {
    // Format conversation history for Gemini
    // We want the tutor to reply in French, keep responses simple (A2-B2 level), and provide translation and key vocab.
    const systemInstruction = `You are "La Plume AI Tutor", a helpful, encouraging native French tutor specialized in helping African students prepare for WAEC and JAMB exams.
- Chat with the student primarily in clear, standard French appropriate for high school students.
- Keep your replies relativamente concise (1-3 sentences).
- Help them practice or suggest WAEC topics (e.g., family, school, future plans, hobbies, travel).
- Always return a JSON response containing:
  1. "reply": Your reply in French.
  2. "translation": The English translation of your reply.
  3. "vocab": A list of 2-3 key vocabulary words or idioms from your reply, each with its English translation.`;

    const chatMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    // Add instructions to the last user message or use systemInstructions
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatMessages,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "Your friendly response in French." },
            translation: { type: Type.STRING, description: "The English translation of your response." },
            vocab: {
              type: Type.ARRAY,
              description: "A selection of 2-3 vocabulary items from the reply.",
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING, description: "The French word or expression." },
                  translation: { type: Type.STRING, description: "The English translation." }
                },
                required: ["word", "translation"]
              }
            }
          },
          required: ["reply", "translation", "vocab"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text returned from Gemini Chat");
    }

    const result = JSON.parse(responseText.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      error: "Failed to generate chat response",
      details: error.message,
      reply: "Désolé, j'ai rencontré un problème technique. Pouvons-nous reprendre notre discussion ?",
      translation: "Sorry, I encountered a technical problem. Can we resume our conversation?",
      vocab: [
        { word: "Désolé", translation: "Sorry" },
        { word: "Problème", translation: "Problem" }
      ]
    });
  }
});

// Serve static assets in production, and set up Vite middleware in development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

setupVite().catch((err) => {
  console.error("Vite startup failed:", err);
});
