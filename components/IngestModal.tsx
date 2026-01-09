
import React, { useState } from 'react';
import { processIntelligence } from '../geminiService';
import { IntelligenceSignal, IngestStatus } from '../types';
import { Icons } from '../constants';

interface Props {
  onIngest: (signal: IntelligenceSignal) => void;
  onClose: () => void;
}

export const IngestModal: React.FC<Props> = ({ onIngest, onClose }) => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('Manual');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState<IngestStatus>({ phase: 'idle', message: '' });

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setStatus({ phase: 'decrypting', message: 'Decrypting Metadata...' });
    
    try {
      setTimeout(() => setStatus({ phase: 'analyzing', message: 'Analyzing Signal...' }), 1000);
      setTimeout(() => setStatus({ phase: 'structuring', message: 'Structuring Intelligence...' }), 2500);

      const result = await processIntelligence(text, source, country);
      
      setTimeout(() => {
        onIngest({ ...result, source: source as any } as IntelligenceSignal);
        setStatus({ phase: 'complete', message: 'Signal Ingested Successfully' });
        setTimeout(onClose, 1000);
      }, 3500);
      
    } catch (err) {
      setStatus({ phase: 'error', message: 'AI Processing Error' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-intel-card border border-intel-border w-full max-w-lg rounded shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-intel-border flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xs font-bold uppercase tracking-widest">Ingest Manual Signal</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Raw News Source Text</label>
            <textarea
              className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded p-3 text-sm focus:border-intel-accent outline-none font-mono"
              placeholder="Paste article text here (Supports multiple languages)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={status.phase !== 'idle'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Manual Attribution</label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm outline-none focus:border-zinc-500"
                placeholder="e.g. Local News"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Origin Country</label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm outline-none focus:border-zinc-500"
                placeholder="e.g. Sudan"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {status.phase !== 'idle' && (
            <div className="flex items-center gap-3 py-4 border-t border-zinc-800">
              <div className="w-4 h-4 border-2 border-intel-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-mono text-intel-accent animate-pulse">{status.message}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={status.phase !== 'idle' || !text.trim()}
            className="w-full py-3 bg-intel-accent hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 font-bold uppercase text-[10px] tracking-[0.2em] rounded transition-all"
          >
            Initiate Intel Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
