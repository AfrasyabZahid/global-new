
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IntelligenceSignal } from './types';
import { Icons } from './constants';
import { IntelligenceFeed } from './components/IntelligenceFeed';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { FilterSidebar } from './components/FilterSidebar';
import { IngestModal } from './components/IngestModal';
import { pollBackendIngestion, getInitialSignals } from './newsService';

const App: React.FC = () => {
  const [signals, setSignals] = useState<IntelligenceSignal[]>([]);

  const [activeRegions, setActiveRegions] = useState<string[]>(['Americas', 'Middle East', 'Asia-Pacific', 'Europe', 'Africa', 'Oceania', 'Global']);
  const [activeLanguages, setActiveLanguages] = useState<string[]>(['English', 'Mandarin', 'Russian', 'Arabic', 'Farsi', 'Spanish', 'Portuguese', 'Turkish']);
  const [activeTopics, setActiveTopics] = useState<string[]>(['Foreign Policy', 'General']);
  const [activeCountries, setActiveCountries] = useState<string[]>(['USA', 'China', 'UK', 'Russia', 'Australia', 'New Zealand', 'South Africa', 'Ethiopia', 'Qatar', 'Mexico', 'France', 'Nigeria', 'Brazil', 'Turkey', 'Indonesia', 'India', 'Pakistan', 'Israel', 'Iran']);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Navigation & Saving State
  const [currentView, setCurrentView] = useState<'home' | 'saved' | 'alerts'>('home');
  const [savedSignals, setSavedSignals] = useState<IntelligenceSignal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonitorActive, setIsMonitorActive] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  const toggleSaveSignal = (signal: IntelligenceSignal) => {
    setSavedSignals(prev => {
      const isSaved = prev.find(s => s.id === signal.id);
      if (isSaved) {
        return prev.filter(s => s.id !== signal.id);
      }
      return [signal, ...prev];
    });
    addLog(`${savedSignals.find(s => s.id === signal.id) ? 'Removed' : 'Saved'} signal ${signal.id} to local storage.`);
  };

  const getFilteredSignals = () => {
    let sourceList = signals;
    if (currentView === 'saved') sourceList = savedSignals;
    if (currentView === 'alerts') sourceList = signals.filter(s => s.impactCategory === 'alert' || s.impactCategory === 'breaking');

    return sourceList.filter(s => {
      const regionMatch = activeRegions.includes(s.region);
      const langMatch = activeLanguages.includes(s.language);
      const topicMatch = activeTopics.includes(s.topic);
      const countryMatch = activeCountries.includes(s.country) || s.country === 'Global';

      const query = searchQuery.toLowerCase();
      const searchMatch = !query ||
        s.translatedText.toLowerCase().includes(query) ||
        s.originalText.toLowerCase().includes(query) ||
        s.topic.toLowerCase().includes(query) ||
        s.country.toLowerCase().includes(query);

      return regionMatch && langMatch && topicMatch && countryMatch && searchMatch;
    });
  };

  const filteredSignals = getFilteredSignals();



  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-20));
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [systemLogs]);

  useEffect(() => {
    const init = async () => {
      const initial = await getInitialSignals();
      setSignals(initial.slice(0, 500));
      addLog("Initial intelligence buffer synchronized from local node.");
    };
    init();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isMonitorActive) {
      const runPoll = async () => {
        setIsIngesting(true);
        addLog("Polling Local Aggregator...");
        const signal = await pollBackendIngestion();
        if (signal) {
          setSignals(prev => {
            if (prev.find(s => s.id === signal.id)) return prev;
            return [signal, ...prev].slice(0, 500);
          });
          addLog(`Local Signal ${signal.id} ingested from verified source.`);
        }

        setIsIngesting(false);
      };

      runPoll();
      interval = setInterval(runPoll, 20000); // Faster polling for local
    }
    return () => clearInterval(interval);
  }, [isMonitorActive]);

  const handleManualIngest = (signal: IntelligenceSignal) => {
    setSignals(prev => [signal, ...prev]);
    addLog(`Local manual entry validated via checksum.`);
  };

  const latestBreaking = signals.find(s => s.isBreaking);

  return (
    <div className="h-screen flex flex-col bg-intel-bg text-[var(--color-text-primary)] font-sans selection:bg-intel-accent selection:text-black overflow-hidden transition-colors duration-300">
      {/* GEOSCOPE HEADER */}
      <header className="h-16 border-b border-intel-border bg-intel-bg flex items-center justify-between px-4 md:px-6 z-50 transition-colors shrink-0">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="w-6 h-6 bg-intel-accent rounded-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icons.Globe className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-xs md:text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)] leading-none group-hover:text-intel-accent transition-colors hidden md:block">
            GlobalPortalConnect
          </h1>
          <h1 className="text-xs md:text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)] leading-none group-hover:text-intel-accent transition-colors md:hidden">
            GPC
          </h1>
        </div>

        <div className="flex-1 max-w-2xl px-4 md:px-12 flex items-center gap-4">
          <div className="relative group flex-1">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-intel-accent/40 group-focus-within:text-intel-accent group-focus-within:opacity-100 transition-all duration-300" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-search-bg)] border border-intel-border rounded-xl py-2.5 pl-11 pr-4 text-[13px] text-[var(--color-text-primary)] focus:outline-none focus:border-intel-accent/30 focus:bg-intel-card focus:shadow-[0_0_20px_rgba(59,130,246,0.05)] transition-all duration-300 placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50"
            />
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-intel-border hover:bg-intel-card transition-all group shrink-0"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Icons.Sun className="w-4 h-4 text-zinc-400 group-hover:text-intel-accent" />
            ) : (
              <Icons.Moon className="w-4 h-4 text-intel-accent" />
            )}
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6 text-[12px] font-bold uppercase tracking-widest border-r border-intel-border pr-8">
            <button
              onClick={() => setCurrentView('home')}
              className={`${currentView === 'home' ? 'text-intel-accent' : 'text-[var(--color-text-secondary)] opacity-70'} hover:opacity-100 transition-all`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('saved')}
              className={`${currentView === 'saved' ? 'text-intel-accent' : 'text-[var(--color-text-secondary)] opacity-70'} hover:opacity-100 transition-all`}
            >
              Saved Feeds
            </button>
            <button
              onClick={() => setCurrentView('alerts')}
              className={`flex items-center gap-2 ${currentView === 'alerts' ? 'text-intel-accent' : 'text-[var(--color-text-secondary)] opacity-70'} hover:opacity-100 transition-all`}
            >
              Alerts <span className="bg-intel-danger text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono shadow-lg shadow-intel-danger/20">
                {signals.filter(s => s.impactCategory === 'alert' || s.impactCategory === 'breaking').length}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-intel-border/50">
            <div className="w-9 h-9 rounded-xl bg-intel-card border border-intel-border flex items-center justify-center shadow-sm group cursor-pointer hover:border-intel-accent/30 transition-all">
              <Icons.User className="w-4 h-4 text-[var(--color-text-secondary)] opacity-60 group-hover:text-intel-accent transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[var(--color-text-primary)] opacity-80 leading-none">Xplorix S.</span>
              <span className="text-[9px] text-[var(--color-text-secondary)] opacity-40 font-mono tracking-tighter mt-1 leading-none">ID: 8829-PX</span>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE NAV TABS */}
      <div className="md:hidden flex items-center justify-around border-b border-intel-border bg-intel-card py-2 px-2 shrink-0">
        <button onClick={() => setCurrentView('home')} className={`p-2 rounded-lg flex flex-col items-center gap-1 ${currentView === 'home' ? 'bg-intel-accent/10 text-intel-accent' : 'text-zinc-500'}`}>
          <Icons.Globe className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase">Home</span>
        </button>
        <button onClick={() => setCurrentView('alerts')} className={`p-2 rounded-lg flex flex-col items-center gap-1 ${currentView === 'alerts' ? 'bg-intel-accent/10 text-intel-accent' : 'text-zinc-500'}`}>
          <Icons.Target className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase">Alerts</span>
        </button>
        <button onClick={() => setCurrentView('saved')} className={`p-2 rounded-lg flex flex-col items-center gap-1 ${currentView === 'saved' ? 'bg-intel-accent/10 text-intel-accent' : 'text-zinc-500'}`}>
          <Icons.Bookmark className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase">Saved</span>
        </button>
      </div>

      {/* THREE COLUMN LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR - FILTERS (Desktop: visible, Mobile: Hidden/Drawer) */}
        <div className="hidden md:block h-full">
          <FilterSidebar
            activeRegions={activeRegions}
            setActiveRegions={setActiveRegions}
            activeLanguages={activeLanguages}
            setActiveLanguages={setActiveLanguages}
            activeTopics={activeTopics}
            setActiveTopics={setActiveTopics}
            activeCountries={activeCountries}
            setActiveCountries={setActiveCountries}
            signals={signals}
          />
        </div>


        {/* FEED - CENTER */}
        <main className="flex-1 flex flex-col pt-6 px-2 md:px-4 overflow-hidden w-full max-w-full">
          <IntelligenceFeed
            signals={filteredSignals}
            savedSignals={savedSignals}
            onToggleSave={toggleSaveSignal}
            view={currentView}
          />


          {/* INGEST CONTROLS (Floating or Bottom) */}
          <div className="absolute bottom-6 right-6 md:right-80 md:mr-10 flex gap-2 z-20">
            <button
              onClick={() => setIsMonitorActive(!isMonitorActive)}
              className={`h-8 px-4 rounded border flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isMonitorActive ? 'bg-zinc-900/80 border-intel-border text-zinc-500' : 'bg-intel-accent text-black border-intel-accent shadow-lg shadow-intel-accent/20'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isMonitorActive ? 'bg-intel-success' : 'bg-zinc-600'} animate-pulse`} />
              {isMonitorActive ? 'Link Active' : 'Off-Grid Mode'}
            </button>
          </div>
          {/* Manual Entry Removed */}
        </main>

        {/* RIGHT SIDEBAR - CONTEXT & ANALYTICS (Desktop: visible, Mobile: Hidden) */}
        <aside className="hidden md:flex w-80 border-l border-intel-border bg-intel-bg/50 p-6 flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-intel-border">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--color-text-primary)] opacity-90">Context & Analytics</h2>
          </div>
          <AnalyticsPanel signals={filteredSignals} />
        </aside>
      </div>

      {isModalOpen && (
        <IngestModal
          onIngest={handleManualIngest}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
