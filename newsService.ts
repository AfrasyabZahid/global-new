
import { IntelligenceSignal } from "./types";
import { processIntelligence } from "./geminiService";

/**
 * Local News Ingestion Service
 * In production, this fetches from your Node.js backend.
 */
const LOCAL_RSS_ENDPOINT = "http://localhost:5000/api/news/latest";
const LOCAL_BATCH_ENDPOINT = "http://localhost:5000/api/news";

export const getInitialSignals = async (): Promise<IntelligenceSignal[]> => {
  try {
    const response = await fetch(LOCAL_BATCH_ENDPOINT);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Could not fetch initial signals.");
  }
  return [];
};

// Mock raw pool for the "Simulated Local" mode
const MOCK_LOCAL_INVENTORY = [
  { source: 'Reuters', text: 'G7 leaders reach consensus on local semiconductor manufacturing incentives to strengthen supply chain resilience.', country: 'Global' },
  { source: 'Al Jazeera', text: 'Regional diplomatic summit concludes with new framework for local resource sharing.', country: 'Qatar' },
  { source: 'Haaretz', text: 'Local security analysis suggests a shift in diplomatic posture regarding northern border management.', country: 'Israel' }
];

export const pollBackendIngestion = async (): Promise<IntelligenceSignal | null> => {
  try {
    // Try to get real-time news from local backend RSS worker
    const response = await fetch(LOCAL_RSS_ENDPOINT);
    if (response.ok) {
      const liveData = await response.json();
      // If liveData is an array, take the first one (latest)
      if (Array.isArray(liveData)) {
        return liveData[0] || null;
      }
      return liveData;
    }
  } catch (err) {
    console.warn("Local backend connection failed. Using mock recovery...");
    const item = MOCK_LOCAL_INVENTORY[Math.floor(Math.random() * MOCK_LOCAL_INVENTORY.length)];
    const intel = await processIntelligence(item.text, item.source, item.country);
    return {
      ...intel,
      source: item.source as any,
      sourceUrl: "local://verified-node"
    } as IntelligenceSignal;
  }
  return null;
};
