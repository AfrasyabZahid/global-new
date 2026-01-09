import React from 'react';
import { IntelligenceSignal } from '../types';

interface FilterItemProps {
    label: string;
    count: number;
    checked: boolean;
    onToggle: (label: string) => void;
}

const FilterItem: React.FC<FilterItemProps> = ({ label, count, checked, onToggle }) => (
    <div
        className="flex items-center justify-between py-1 group cursor-pointer"
        onClick={() => onToggle(label)}
    >
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-intel-accent border-intel-accent' : 'border-intel-border group-hover:border-intel-accent/50'} shadow-inner`}>
                {checked && <div className="w-2 h-2 bg-white dark:bg-black rounded-sm" />}
            </div>
            <span className={`text-[11px] font-medium ${checked ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'}`}>{label}</span>
        </div>
        <span className="text-[10px] text-[var(--color-text-secondary)] font-mono opacity-40">({count})</span>
    </div>
);

const FilterSection: React.FC<{
    title: string;
    children: React.ReactNode;
    onToggleAll: () => void;
    allSelected: boolean;
}> = ({ title, children, onToggleAll, allSelected }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2 border-b border-intel-border pb-1.5 px-0.5">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 group flex-1"
                >
                    <div className={`w-2 h-2 border-b border-r border-intel-border/60 mb-1 transition-transform duration-200 ${isOpen ? 'rotate-45' : '-rotate-45'}`} />
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-40 group-hover:text-intel-accent group-hover:opacity-100 transition-all">{title}</h3>
                </button>

                {isOpen && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleAll();
                        }}
                        className="text-[8px] font-bold uppercase tracking-wider text-intel-accent hover:text-[var(--color-text-primary)] transition-colors px-2"
                    >
                        {allSelected ? 'None' : 'All'}
                    </button>
                )}
            </div>

            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

interface SidebarProps {
    activeRegions: string[];
    setActiveRegions: React.Dispatch<React.SetStateAction<string[]>>;
    activeLanguages: string[];
    setActiveLanguages: React.Dispatch<React.SetStateAction<string[]>>;
    activeTopics: string[];
    setActiveTopics: React.Dispatch<React.SetStateAction<string[]>>;
    activeCountries: string[];
    setActiveCountries: React.Dispatch<React.SetStateAction<string[]>>;
    signals: IntelligenceSignal[];
}

export const FilterSidebar: React.FC<SidebarProps> = ({
    activeRegions, setActiveRegions,
    activeLanguages, setActiveLanguages,
    activeTopics, setActiveTopics,
    activeCountries, setActiveCountries,
    signals
}) => {
    const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const toggleAll = (
        currentList: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        allOptions: string[]
    ) => {
        if (currentList.length === allOptions.length) {
            setList([]);
        } else {
            setList(allOptions);
        }
    };

    const getCount = (type: 'region' | 'language' | 'topic' | 'country', value: string) => {
        return signals.filter(s => s[type] === value).length;
    };

    const ALL_REGIONS = ['Americas', 'Middle East', 'Asia-Pacific', 'Europe', 'Africa', 'Oceania', 'Global'];
    const ALL_COUNTRIES = ['USA', 'China', 'UK', 'Russia', 'Australia', 'New Zealand', 'South Africa', 'Ethiopia', 'Qatar', 'Mexico', 'France', 'Nigeria', 'Brazil', 'Turkey', 'Indonesia', 'India', 'Pakistan', 'Israel', 'Iran'];
    const ALL_LANGUAGES = ['English', 'Mandarin', 'Russian', 'Arabic', 'Farsi', 'Spanish', 'Portuguese', 'Turkish'];
    const ALL_TOPICS = ['Foreign Policy', 'General'];

    return (
        <aside className="w-80 border-r border-intel-border bg-intel-bg flex flex-col p-6 overflow-y-auto custom-scrollbar transition-all">
            <div className="mb-8">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-text-primary)] mb-8 flex items-center gap-2 opacity-90">
                    <div className="w-1 h-3 bg-intel-accent rounded-full" />
                    Filters & Scope
                </h2>

                <FilterSection
                    title="Regions"
                    onToggleAll={() => toggleAll(activeRegions, setActiveRegions, ALL_REGIONS)}
                    allSelected={activeRegions.length === ALL_REGIONS.length}
                >
                    {ALL_REGIONS.map(r => (
                        <FilterItem
                            key={r}
                            label={r}
                            count={getCount('region', r)}
                            checked={activeRegions.includes(r)}
                            onToggle={(v) => toggleFilter(activeRegions, setActiveRegions, v)}
                        />
                    ))}
                </FilterSection>

                <FilterSection
                    title="Countries"
                    onToggleAll={() => toggleAll(activeCountries, setActiveCountries, ALL_COUNTRIES)}
                    allSelected={activeCountries.length === ALL_COUNTRIES.length}
                >
                    {ALL_COUNTRIES.sort().map(c => (
                        <FilterItem
                            key={c}
                            label={c}
                            count={getCount('country', c)}
                            checked={activeCountries.includes(c)}
                            onToggle={(v) => toggleFilter(activeCountries, setActiveCountries, v)}
                        />
                    ))}
                </FilterSection>

                <FilterSection
                    title="Original Language"
                    onToggleAll={() => toggleAll(activeLanguages, setActiveLanguages, ALL_LANGUAGES)}
                    allSelected={activeLanguages.length === ALL_LANGUAGES.length}
                >
                    {[
                        { l: 'English', c: 'EN' }, { l: 'Mandarin', c: 'ZH' }, { l: 'Russian', c: 'RU' },
                        { l: 'Arabic', c: 'AR' }, { l: 'Farsi', c: 'FA' }, { l: 'Spanish', c: 'ES' },
                        { l: 'Portuguese', c: 'PT' }, { l: 'Turkish', c: 'TR' }
                    ].map(lang => (
                        <FilterItem
                            key={lang.l}
                            label={`${lang.l} [${lang.c}]`}
                            count={getCount('language', lang.l)}
                            checked={activeLanguages.includes(lang.l)}
                            onToggle={() => toggleFilter(activeLanguages, setActiveLanguages, lang.l)}
                        />
                    ))}
                </FilterSection>

                <FilterSection
                    title="Topic Tags"
                    onToggleAll={() => toggleAll(activeTopics, setActiveTopics, ALL_TOPICS)}
                    allSelected={activeTopics.length === ALL_TOPICS.length}
                >
                    {ALL_TOPICS.map(t => (
                        <FilterItem
                            key={t}
                            label={t}
                            count={getCount('topic', t)}
                            checked={activeTopics.includes(t)}
                            onToggle={(v) => toggleFilter(activeTopics, setActiveTopics, v)}
                        />
                    ))}
                </FilterSection>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] opacity-40">Real-time Buffer</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] opacity-40">{signals.length} Signals</span>
                    </div>
                    <div className="h-1 bg-intel-border/20 rounded-full relative overflow-hidden">
                        <div className="absolute left-0 w-full h-full bg-intel-accent opacity-5" />
                        <div className="absolute left-0 w-3/4 h-full bg-intel-accent rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)]" />
                    </div>
                </div>
            </div>
        </aside>
    );
};
