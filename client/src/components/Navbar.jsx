import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, ShieldAlert, BookOpen } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-noir-900/90 backdrop-blur-md border-b border-noir-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-detective-amber/10 border border-detective-amber/30 flex items-center justify-center text-detective-amber group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
                AI <span className="text-detective-amber">MYSTERY</span> ROOM
              </span>
              <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                Gemini Forensic Dossier Engine
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-detective-amber bg-noir-800'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-noir-800/60'
              }`}
            >
              Archive
            </Link>

            <Link
              to="/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-detective-amber to-amber-600 text-noir-950 hover:brightness-110 shadow-lg shadow-amber-500/10 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Mystery</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
