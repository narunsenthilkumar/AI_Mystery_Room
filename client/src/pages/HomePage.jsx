import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, ShieldCheck, Zap, Award, ArrowRight, Clock, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getAllCases } from '../services/api';

export default function HomePage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCases()
      .then((res) => {
        if (res.data?.cases) {
          setCases(res.data.cases);
        }
      })
      .catch((err) => {
        console.warn('Could not load recent cases:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-crime-scene">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-noir-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-noir-800 border border-noir-700 text-xs font-mono text-detective-amber mb-6">
              <span className="w-2 h-2 rounded-full bg-detective-amber animate-pulse"></span>
              ACTIVE CRIME SCENE PROTOCOL
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
              Deduce the Unseen. <br />
              <span className="bg-gradient-to-r from-detective-amber via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Unmask the Culprit.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Step into an AI-orchestrated mystery room powered by Gemini. Every case is procedurally generated with tight forensic clues, intricate suspect alibis, and fair scoring. Investigate the crime scene, discover hidden evidence, and indict the real perpetrator.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                to="/create"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-base font-bold bg-detective-amber text-noir-950 hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>Launch Investigation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-noir-800 text-slate-200 hover:bg-noir-700 border border-noir-700 transition-colors"
              >
                <Compass className="w-5 h-5 text-slate-400" />
                <span>Detective Field Manual</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Overview Matrix */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Forensic Investigation Protocol
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            Cases are balanced around logical consistency, deductive reasoning, and fair scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Easy Card */}
          <div className="rounded-2xl bg-noir-900 border border-emerald-500/20 p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                Easy Tier
              </span>
              <span className="text-slate-400 font-mono text-xs">100 Base Pts</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Local Precinct Inquest</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Ideal for novice sleuths. Clear evidence chain and straightforward suspect alibis with fewer red herrings.
            </p>
            <div className="space-y-2.5 pt-4 border-t border-noir-800 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>Suspects:</span>
                <strong className="text-slate-100">3 Persons of Interest</strong>
              </div>
              <div className="flex justify-between">
                <span>Forensic Clues:</span>
                <strong className="text-slate-100">5 Crime Scene Artifacts</strong>
              </div>
              <div className="flex justify-between">
                <span>Investigative Hints:</span>
                <strong className="text-slate-100">2 Available</strong>
              </div>
            </div>
          </div>

          {/* Medium Card */}
          <div className="rounded-2xl bg-noir-900 border border-detective-amber/30 p-6 relative overflow-hidden group hover:border-detective-amber/60 transition-all shadow-lg shadow-amber-500/5">
            <div className="absolute top-0 right-0 bg-detective-amber text-noir-950 text-[10px] font-black px-3 py-1 uppercase tracking-wider font-mono">
              Recommended
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-detective-amber font-mono text-xs font-bold uppercase tracking-wider">
                Medium Tier
              </span>
              <span className="text-slate-400 font-mono text-xs">150 Base Pts</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Scotland Yard Docket</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Standard detective challenge. Multiple conflicting motives, nuanced alibis, and subtle forensic evidence.
            </p>
            <div className="space-y-2.5 pt-4 border-t border-noir-800 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>Suspects:</span>
                <strong className="text-slate-100">4 Persons of Interest</strong>
              </div>
              <div className="flex justify-between">
                <span>Forensic Clues:</span>
                <strong className="text-slate-100">7 Crime Scene Artifacts</strong>
              </div>
              <div className="flex justify-between">
                <span>Investigative Hints:</span>
                <strong className="text-slate-100">3 Available</strong>
              </div>
            </div>
          </div>

          {/* Hard Card */}
          <div className="rounded-2xl bg-noir-900 border border-rose-500/20 p-6 relative overflow-hidden group hover:border-rose-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                Hard Tier
              </span>
              <span className="text-slate-400 font-mono text-xs">200 Base Pts</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Mastermind Syndicate</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              For seasoned criminologists. Complex conspiratorial web, deep red herrings, and elaborate cover-ups.
            </p>
            <div className="space-y-2.5 pt-4 border-t border-noir-800 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>Suspects:</span>
                <strong className="text-slate-100">5 Persons of Interest</strong>
              </div>
              <div className="flex justify-between">
                <span>Forensic Clues:</span>
                <strong className="text-slate-100">9 Crime Scene Artifacts</strong>
              </div>
              <div className="flex justify-between">
                <span>Investigative Hints:</span>
                <strong className="text-slate-100">3 Available</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Blueprint */}
        <div className="mt-12 rounded-2xl bg-noir-900/80 border border-noir-800 p-8">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-detective-amber" />
            Backend Scoring & Anti-Cheat Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Accusation Verdict</p>
                <p className="text-xs text-slate-400 mt-1">
                  Correct suspect yields full difficulty base points (100 / 150 / 200). Wrong accusation yields 0 base points.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-detective-amber/10 flex items-center justify-center text-detective-amber shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Evidence Discovery</p>
                <p className="text-xs text-slate-400 mt-1">
                  Each examined clue grants <strong className="text-emerald-400">+5 bonus points</strong>. Examine every item on scene.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Hint Penalty</p>
                <p className="text-xs text-slate-400 mt-1">
                  Each requested hint deducts <strong className="text-rose-400">-10 points</strong>. Total score is bounded at minimum 0.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cases Section */}
      <section className="py-12 border-t border-noir-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Recent Case Archives</h2>
            <p className="text-xs text-slate-400 mt-1">Investigate or review previously synthesized cases</p>
          </div>
          <Link
            to="/create"
            className="text-xs font-semibold text-detective-amber hover:underline flex items-center gap-1 font-mono"
          >
            Create Case <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mono text-sm">
            Accessing database archives...
          </div>
        ) : cases.length === 0 ? (
          <div className="py-12 text-center bg-noir-900 rounded-2xl border border-noir-800 p-8">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No open cases on file yet.</p>
            <p className="text-xs text-slate-500 mt-1">Be the first detective to generate a mystery room dossier.</p>
            <Link
              to="/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-noir-800 hover:bg-noir-700 text-detective-amber text-xs font-semibold border border-noir-700"
            >
              Start First Mystery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((c) => (
              <Link
                key={c._id}
                to={c.status === 'completed' ? `/case/${c._id}/result` : `/case/${c._id}`}
                className="block p-5 rounded-xl bg-noir-900/90 border border-noir-800 hover:border-detective-amber/40 hover:bg-noir-850 transition-all group"
              >
                <div className="flex items-center justify-between text-xs mb-3 font-mono">
                  <span className={`px-2 py-0.5 rounded font-semibold uppercase ${
                    c.difficulty === 'hard'
                      ? 'bg-rose-500/10 text-rose-400'
                      : c.difficulty === 'medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {c.difficulty}
                  </span>
                  <span className={c.status === 'completed' ? (c.isSolved ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold') : 'text-detective-cyan font-bold'}>
                    {c.status === 'completed' ? (c.isSolved ? 'SOLVED' : 'FAILED') : 'IN PROGRESS'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-200 group-hover:text-detective-amber transition-colors line-clamp-1">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {c.premise}
                </p>
                <div className="mt-4 pt-3 border-t border-noir-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Score: {c.score} pts</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-slate-400">
                    Enter Case <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
