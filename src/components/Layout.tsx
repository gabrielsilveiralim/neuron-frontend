import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

type Tab = 'chat' | 'ingest';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('neuron-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('neuron-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('neuron-theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="h-full">
      <header className="border-b border-[#E8E4DC] dark:border-[#2E2B26]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl tracking-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}> Neuron </span>
            <span className="text-xs font-mono text-[#A8A296] dark:text-[#5C594F]"> segundo cérebro </span>
          </div>

          <nav className="flex items-center gap-1">
            <button onClick={() => onTabChange('chat')} className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-150" style={{ color: activeTab === 'chat' ? '#8B7355' : '#6B6862', }} >
              Conversar
              {activeTab === 'chat' && (
                <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-[#8B7355]" />
              )}
            </button>

            <button onClick={() => onTabChange('ingest')} className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-150" style={{ color: activeTab === 'ingest' ? '#8B7355' : '#6B6862', }} >
              Anotar
              {activeTab === 'ingest' && (
                <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-[#8B7355]" />
              )}
            </button>
          </nav>

          <button onClick={() => setIsDark(!isDark)} className="btn-ghost p-2" aria-label="Alternar tema" >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}