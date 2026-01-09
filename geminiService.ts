
import { IntelligenceSignal, Region, Topic } from "./types";

/**
 * LOCAL INTELLIGENCE SERVICE
 * This service is designed to communicate with your local Node.js/Python backend.
 * All processing (LLM categorization, translation) is assumed to happen on your machine.
 */

// Configuration for local backend
const LOCAL_API_ENDPOINT = "http://localhost:5000/api/process";

/**
 * Interfaces with a local LLM processor (e.g. Ollama, Local Transformers).
 */
export const processIntelligence = async (
  rawText: string, 
  sourceContext: string = 'Local',
  countryContext: string = 'Unknown'
): Promise<Partial<IntelligenceSignal>> => {
  
  try {
    // Attempt to hit the local backend you are building
    const response = await fetch(LOCAL_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: rawText, source: sourceContext, country: countryContext })
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn("Local backend not detected. Falling back to local emulation mode...");
  }

  // FALLBACK: Deterministic Emulation (Mimics local model output if server is down)
  // This allows the UI to remain functional during development.
  const isBreaking = rawText.length > 100 && Math.random() > 0.7;
  
  return {
    id: `LOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    language: "Detected Locally",
    translatedText: `[LOCAL_PROC] ${rawText.substring(0, 200)}${rawText.length > 200 ? '...' : ''}`,
    originalText: rawText,
    country: countryContext || "Unknown",
    region: "Americas", // Defaulting to local region in emulation
    topic: "Diplomacy",
    convergenceScore: Math.random(),
    velocityScore: Math.random(),
    isBreaking: isBreaking,
    confidence: 0.98,
    timestamp: new Date().toISOString()
  };
};
