import React from 'react';
import { Search, Brain, Shield, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-noir-800 bg-noir-900/60 mt-20 py-10 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-noir-800 flex items-center justify-center text-detective-amber">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-200">AI Mystery Room</p>
            <p className="text-xs text-slate-500 font-mono">Engineered with React, Node.js & Google Gemini</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-detective-cyan" />
            Gemini AI Generation
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            Anti-Cheat Protected
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-detective-amber" />
            Fair Scoring Engine
          </span>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} AI Mystery Room. All cases classified.
        </div>
      </div>
    </footer>
  );
}

