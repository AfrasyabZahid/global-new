
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { IntelligenceSignal } from '../types';

interface Props {
  signals: IntelligenceSignal[];
}

const TopicItem: React.FC<{ rank: number; label: string; count: number; percentage: number }> = ({ rank, label, count, percentage }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-intel-accent">{rank}.</span>
        <span className="text-[11px] font-medium text-[var(--color-text-primary)] opacity-90">{label}</span>
      </div>
      <span className="text-[10px] text-[var(--color-text-secondary)] font-mono opacity-70">({count} sources)</span>
    </div>
    <div className="h-1 bg-intel-border/50 rounded-full overflow-hidden">
      <div className="h-full bg-intel-accent transition-all duration-500" style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

export const AnalyticsPanel: React.FC<Props> = ({ signals }) => {
  // 1. Calculate Source Activity Spike
  const sourceCounts = signals.reduce((acc, s) => {
    acc[s.source] = (acc[s.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 2. Calculate Top Converging Topics
  const topicCounts = signals.reduce((acc, s) => {
    const key = `${s.region}: ${s.topic}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTopics = Object.entries(topicCounts)
    .map(([label, count]) => ({ label, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const maxTopicCount: number = topTopics.length > 0 ? topTopics[0].count : 1;

  // 3. Heatmap Dot Logic (Pulsate for regions with highest activity)
  const regionCounts = signals.reduce((acc, s) => {
    acc[s.region] = (acc[s.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getHeatColor = (region: string) => {
    const count = regionCounts[region] || 0;
    if (count > 5) return 'text-intel-danger animate-pulse';
    if (count > 0) return 'text-intel-warning opacity-60';
    return 'text-zinc-800 opacity-20';
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar p-1">
      {/* HEATMAP */}
      <div className="bg-intel-card border border-intel-border rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Global Narrative Heatmap</h3>
          <span className="text-[9px] font-mono text-intel-accent animate-pulse">Live Tracking</span>
        </div>
        <div className="aspect-video relative flex items-center justify-center bg-black/40 rounded border border-intel-border/50 overflow-hidden">
          <svg viewBox="0 0 1000 500" className="w-full h-full opacity-90">
            {/* Map Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-intel-accent/5" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* AMERICAS */}
            <path
              d="M150,50 L250,50 L300,150 L250,350 L200,450 L100,300 L50,150 Z"
              fill="currentColor"
              className={`${regionCounts['Americas'] > 0 ? 'text-intel-accent' : 'text-zinc-700'} transition-colors duration-1000`}
              style={{ opacity: Math.min(0.2 + (regionCounts['Americas'] || 0) * 0.05, 0.9) }}
            />
            {/* North America approximation */}
            <path d="M70,30 L180,30 L220,130 L150,180 L80,130 L20,80 Z" fill="currentColor" onClick={() => console.log('NA')} className={`${regionCounts['Americas'] > 0 ? 'text-intel-accent' : 'text-zinc-800'} transition-all duration-700 hover:brightness-125`} style={{ opacity: Math.min(0.1 + (regionCounts['Americas'] || 0) * 0.02, 0.8) }} />
            {/* South America approximation */}
            <path d="M180,200 L260,200 L280,300 L230,420 L180,320 Z" fill="currentColor" className={`${regionCounts['Americas'] > 0 ? 'text-intel-accent' : 'text-zinc-800'} transition-all duration-700 hover:brightness-125`} style={{ opacity: Math.min(0.1 + (regionCounts['Americas'] || 0) * 0.02, 0.8) }} />


            {/* EUROPE */}
            <path d="M430,70 L520,70 L520,140 L440,150 L400,120 Z" fill="currentColor" className={`${regionCounts['Europe'] > 0 ? 'text-intel-accent' : 'text-zinc-800'} transition-all duration-700 hover:brightness-125`} style={{ opacity: Math.min(0.1 + (regionCounts['Europe'] || 0) * 0.02, 0.8) }} />

            {/* AFRICA */}
            <path d="M420,160 L540,160 L580,250 L520,380 L440,300 L400,200 Z" fill="currentColor" className={`${regionCounts['Africa'] > 0 ? 'text-intel-accent' : 'text-zinc-800'} transition-all duration-700 hover:brightness-125`} style={{ opacity: Math.min(0.1 + (regionCounts['Africa'] || 0) * 0.03, 0.8) }} />

            {/* ASIA & MIDDLE EAST */}
            <path d="M540,60 L850,60 L900,150 L850,250 L700,280 L580,220 L540,140 Z" fill="currentColor" className={`${(regionCounts['Asia-Pacific'] + regionCounts['Middle East']) > 0 ? 'text-intel-accent' : 'text-zinc-800'} transition-all duration-700 hover:brightness-125`} style={{ opacity: Math.min(0.1 + ((regionCounts['Asia-Pacific'] || 0) + (regionCounts['Middle East'] || 0)) * 0.02, 0.8) }} />

            {/* OCEANIA (Australia + NZ) */}
            <g className={`${regionCounts['Oceania'] > 0 ? 'text-intel-accent' : 'text-zinc-800'} transition-all duration-700 hover:brightness-125`} style={{ opacity: Math.min(0.2 + (regionCounts['Oceania'] || 0) * 0.05, 0.9) }}>
              {/* Australia Main Landmass */}
              <path d="M760,310 L810,300 L870,300 L880,340 L880,390 L850,420 L770,410 L760,360 Z" fill="currentColor" />
              {/* New Zealand North Island */}
              <path d="M910,400 L930,390 L940,410 L920,415 Z" fill="currentColor" />
              {/* New Zealand South Island */}
              <path d="M900,420 L920,420 L910,450 L890,440 Z" fill="currentColor" />
            </g>

          </svg>

          {/* Overlay Labels */}
          <div className="absolute inset-0 pointer-events-none">
            {Object.entries(regionCounts).map(([region, count]) => {
              if (count < 1) return null;
              // Simple positioning map
              const positions: any = {
                'Americas': { top: '40%', left: '20%' },
                'Europe': { top: '20%', left: '48%' },
                'Africa': { top: '55%', left: '48%' },
                'Asia-Pacific': { top: '30%', left: '75%' },
                'Middle East': { top: '35%', left: '60%' },
                'Oceania': { top: '75%', left: '82%' }
              };
              const pos = positions[region] || { top: '50%', left: '50%' };
              return (
                <div key={region} className="absolute flex flex-col items-center" style={{ top: pos.top, left: pos.left }}>
                  <span className="text-[8px] font-black text-white bg-black/50 px-1 rounded backdrop-blur-sm shadow-sm">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* TOP TOPICS */}
      <div className="bg-intel-card border border-intel-border rounded-lg p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-5">Top Converging Topics</h3>
        {topTopics.length > 0 ? (
          topTopics.map((item, i) => (
            <TopicItem
              key={item.label}
              rank={i + 1}
              label={item.label}
              count={item.count}
              percentage={(item.count / maxTopicCount) * 100}
            />
          ))
        ) : (
          <p className="text-[10px] text-zinc-600 italic">No topic convergence detected.</p>
        )}
      </div>

      {/* ACTIVITY SPIKE */}
      <div className="bg-intel-card border border-intel-border rounded-lg p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Source Activity Spike</h3>
        <div className="h-32 w-full mb-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? 'var(--color-intel-accent, #3b82f6)' : '#334155'}
                    />
                  ))}
                </Bar>
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-black border border-intel-border p-2 rounded shadow-xl">
                          <p className="text-[9px] font-bold text-white uppercase mb-1">{data.name}</p>
                          <p className="text-[9px] text-intel-accent font-mono">{data.value} active reports</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-intel-border rounded">
              <span className="text-[9px] text-zinc-600 font-mono">WAITING_FOR_DATA_PULSE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
