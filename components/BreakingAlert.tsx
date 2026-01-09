
import React from 'react';
import { Icons } from '../constants';

interface BreakingAlertProps {
    title: string;
    url?: string;
    velocity: string;
    velocityChange: string;
    sourceCount: number;
    languageCount: number;
}

export const BreakingAlert: React.FC<BreakingAlertProps> = ({
    title,
    url,
    velocity,
    velocityChange,
    sourceCount,
    languageCount
}) => {
    return (
        <div className="relative overflow-hidden bg-intel-danger/10 border border-intel-danger/30 rounded-xl px-6 py-5 mb-8 group transition-all duration-500 shadow-[0_0_30px_rgba(239,68,68,0.05)] min-h-[90px] flex flex-col justify-center">
            {/* Tactical Pulsing Glow */}
            <div className="absolute inset-0 bg-intel-danger/[0.03] animate-pulse" />
            <div className="absolute top-0 left-0 w-1.5 h-full bg-intel-danger shadow-[0_0_15px_rgba(239,68,68,0.4)]" />

            <div className="relative flex items-center justify-between gap-6">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-intel-danger/20 rounded-xl animate-pulse border border-intel-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <Icons.AlertTriangle className="w-6 h-6 text-intel-danger" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-intel-danger opacity-90">Breaking Convergence Event</span>
                            <span className="flex h-1.5 w-1.5 rounded-full bg-intel-danger animate-ping" />
                        </div>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[18px] font-black text-[var(--color-text-primary)] hover:text-intel-danger transition-colors leading-tight truncate drop-shadow-sm pr-4"
                        >
                            {title}
                        </a>
                    </div>
                </div>

                <div className="flex gap-8 items-center justify-end border-l border-intel-danger/20 pl-8 flex-shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-50 mb-1.5">Narrative</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[16px] font-black text-intel-danger tracking-tighter">{velocity}</span>
                            <span className="text-[9px] text-intel-accent font-black font-mono bg-intel-accent/10 px-1.5 py-0.5 rounded border border-intel-accent/20">{velocityChange}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-50 mb-1.5">Ingest</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[16px] font-black text-[var(--color-text-primary)] tracking-tight">{sourceCount}+ Streams</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
