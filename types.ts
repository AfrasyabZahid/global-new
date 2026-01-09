export interface IntelligenceSignal {
  id: string;
  source: string;
  sourceUrl: string;
  country: string;
  region: string;
  topic: string;
  originalText: string;
  translatedText: string;
  language: string;
  convergenceScore: number; // Used for Foreign Policy Relevance 0-1
  velocityScore: number; // 0-1: Narrative escalation speed
  timestamp: string;
  isBreaking: boolean;
  impactScore: number; // AI-calculated impact score 0-1
  impactCategory: 'breaking' | 'alert' | 'general';
  confidence: number;
}

export interface IngestStatus {
  phase: 'idle' | 'decrypting' | 'analyzing' | 'structuring' | 'complete' | 'error';
  message: string;
}
