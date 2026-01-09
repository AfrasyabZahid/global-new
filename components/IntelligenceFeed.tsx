
import React, { useState } from 'react';
import { IntelligenceSignal } from '../types';
import { Icons } from '../constants';
import { BreakingAlert } from './BreakingAlert';

interface Props {
  signals: IntelligenceSignal[];
  savedSignals: IntelligenceSignal[];
  onToggleSave: (signal: IntelligenceSignal) => void;
  view: 'home' | 'saved' | 'alerts';
}

const SignalCard: React.FC<{
  signal: IntelligenceSignal;
  isSaved: boolean;
  onSave: (signal: IntelligenceSignal) => void;
}> = ({ signal, isSaved, onSave }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  // Country Code Mapping for Flags
  const COUNTRY_CODES: Record<string, string> = {
    'USA': 'us', 'China': 'cn', 'UK': 'gb', 'Russia': 'ru', 'Australia': 'au',
    'New Zealand': 'nz', 'South Africa': 'za', 'Ethiopia': 'et', 'Qatar': 'qa',
    'Mexico': 'mx', 'France': 'fr', 'Nigeria': 'ng', 'Brazil': 'br', 'Turkey': 'tr',
    'Indonesia': 'id', 'India': 'in', 'Pakistan': 'pk', 'Japan': 'jp',
    'Israel': 'il', 'Iran': 'ir', 'Saudi Arabia': 'sa', 'Germany': 'de',
    'Global': 'un', 'World': 'un'
  };

  const getFlagUrl = (country: string) => {
    const code = COUNTRY_CODES[country] || 'un';
    if (code === 'un') return 'https://flagcdn.com/w40/un.png'; // Fallback to UN flag
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  const isTranslated = signal.language !== 'English';

  const getImpactColor = (category: string) => {
    switch (category) {
      case 'breaking': return 'text-intel-danger border-intel-danger/30 bg-intel-danger/5';
      case 'alert': return 'text-amber-500 border-amber-500/30 bg-amber-500/5';
      default: return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5';
    }
  };

  return (
    <div className="group relative bg-intel-card/40 hover:bg-intel-card/60 border border-intel-border hover:border-intel-accent/30 rounded-xl p-5 mb-4 transition-all duration-300">
      {/* Premium Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-intel-accent/[0.02] to-transparent rounded-xl pointer-events-none" />

      {/* Save Button */}
      <button
        onClick={() => onSave(signal)}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg border border-intel-border bg-intel-card/40 flex items-center justify-center hover:border-intel-accent/50 transition-all group/save"
        title={isSaved ? "Remove from Saved" : "Save Signal"}
      >
        <Icons.Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-intel-accent fill-intel-accent' : 'text-[var(--color-text-secondary)] opacity-40 group-hover/save:opacity-100'}`} />
      </button>

      <div className="relative flex flex-col gap-4">
        {/* Title / Content */}
        <div className="text-[15px] pr-8 font-semibold leading-relaxed text-[var(--color-text-primary)] group-hover:text-intel-accent transition-colors duration-300">
          {isTranslated && (
            <span className="text-intel-accent/60 mr-2 font-mono text-[10px] uppercase tracking-tighter">
              [TRANSLATED]
            </span>
          )}
          <a
            href={signal.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline decoration-intel-accent/30 underline-offset-4 transition-all"
          >
            {showOriginal ? signal.originalText : signal.translatedText.replace('[INTEL_REPORT] ', '')}
          </a>
        </div>

        {/* Source info with Flag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-3.5 flex items-center justify-center overflow-hidden rounded-[2px] shadow-sm">
              <img
                src={getFlagUrl(signal.country)}
                alt={signal.country}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://flagcdn.com/w40/un.png';
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[var(--color-text-primary)] opacity-70 group-hover:opacity-100 transition-opacity">{signal.source}</span>
              <span className="text-[var(--color-text-secondary)] text-[10px] opacity-20">•</span>
              <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest opacity-40 font-medium">{new Date(signal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded transition-all text-[9px] font-black uppercase tracking-widest italic ${getImpactColor(signal.impactCategory)}`}>
            <span>{signal.impactCategory} impact</span>
            <span>{(signal.impactScore * 100).toFixed(0)}%</span>
            {signal.impactScore > 0.5 && <span className="animate-pulse">↑</span>}
          </div>
        </div>

        {/* Tactical Metadata Tags */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.02] dark:bg-black/20 border border-intel-border/30 rounded-md">
            <span className="text-[9px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider opacity-40">Country:</span>
            <span className="text-[9px] text-[var(--color-text-primary)] font-black uppercase tracking-wider opacity-60">{signal.country}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.02] dark:bg-black/20 border border-intel-border/30 rounded-md">
            <span className="text-[9px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider opacity-40">Topic:</span>
            <span className="text-[9px] text-[var(--color-text-primary)] font-black uppercase tracking-wider opacity-60">{signal.topic}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const IntelligenceFeed: React.FC<Props> = ({ signals, savedSignals, onToggleSave, view }) => {
  const breaking = signals.find(s => s.impactCategory === 'breaking');

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar px-1">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-[var(--color-text-primary)] opacity-90">
            {view === 'home' ? 'Live Intelligence' : view === 'saved' ? 'Saved Intelligence' : 'High-Impact Alerts'}
          </h2>
          <div className="h-0.5 w-12 bg-intel-accent/50 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="h-9 px-4 rounded-lg border border-intel-accent bg-intel-accent flex items-center gap-2 hover:bg-intel-accent/90 hover:shadow-lg hover:shadow-intel-accent/20 transition-all group"
            title="Refresh Terminal"
          >
            <Icons.Refresh className="w-3.5 h-3.5 text-black font-bold animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-black">Refresh</span>
          </button>
        </div>
      </div>

      {view !== 'saved' && breaking && (
        <BreakingAlert
          title={breaking.translatedText.replace('[INTEL_REPORT] ', '')}
          url={breaking.sourceUrl}
          velocity="Very High"
          velocityChange={`+${(breaking.impactScore * 1000).toFixed(0)}% / hr`}
          sourceCount={Math.floor(breaking.impactScore * 100)}
          languageCount={breaking.impactScore > 0.5 ? 8 : 2}
        />
      )}

      <div className="flex flex-col gap-2 pb-20">
        {signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-secondary)] opacity-40">
            <h3 className="text-xs font-bold uppercase tracking-widest">No signals detected in this sector</h3>
          </div>
        ) : (
          signals.map(s => (
            <SignalCard
              key={s.id}
              signal={s}
              isSaved={!!savedSignals.find(ss => ss.id === s.id)}
              onSave={onToggleSave}
            />
          ))
        )}
      </div>
    </div>
  );
};

