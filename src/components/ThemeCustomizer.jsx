import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Check } from 'lucide-react';

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('indigo'); // 'indigo', 'emerald', 'dark'

  useEffect(() => {
    // Apply theme classes to the document element
    const root = document.documentElement;
    root.classList.remove('theme-indigo', 'theme-emerald', 'theme-dark');
    root.classList.add(`theme-${activeTheme}`);

    // If dark mode is selected, add dark mode class
    if (activeTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--text-primary', '#f8fafc');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--text-primary', '#0f172a');
    }
  }, [activeTheme]);

  const themes = [
    { id: 'indigo', name: 'Midnight Indigo', color: 'bg-indigo-600' },
    { id: 'emerald', name: 'Classic Emerald', color: 'bg-emerald-600' },
    { id: 'dark', name: 'Sleek Dark Mode', color: 'bg-slate-950' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative overflow-hidden group"
      >
        <span className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform rounded-full" />
        <Palette size={20} className="relative z-10 animate-in spin-in-12 duration-500" />
      </button>

      {/* Slide-up Menu Options */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-lg shadow-xl w-60 animate-in slide-in-from-bottom-5 duration-300">
          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">SomoBloom Themes</h4>
          <div className="space-y-2">
            {themes.map((t) => (
              <button 
                key={t.id}
                onClick={() => {
                  setActiveTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full p-2 rounded-md flex items-center justify-between border transition-all ${
                  activeTheme === t.id 
                    ? 'bg-slate-50 border-slate-300 font-semibold' 
                    : 'bg-white/50 border-transparent hover:border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
                  <span className="text-xs text-slate-700">{t.name}</span>
                </div>
                {activeTheme === t.id && <Check size={14} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
