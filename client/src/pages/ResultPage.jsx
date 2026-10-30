import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Award,
  Search,
  Key,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  FileText,
  AlertTriangle,
  Loader2,
  Lock,
  Compass
} from 'lucide-react';
import { getCaseResult } from '../services/api';

export default function ResultPage() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCaseResult(id)
      .then((res) => {
        setCaseData(res.data.data);
      })
      .catch((err) => {
        console.error('Failed to load result:', err);
        setError(err.response?.data?.message || 'Case result is not available yet.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-crime-scene flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-detective-amber animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-200">Declassifying Case Files...</h2>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-crime-scene flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl bg-noir-900 border border-noir-800 p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100">Docket Sealed</h2>
          <p className="text-sm text-slate-400 mt-2">{error}</p>
          <Link
            to={`/case/${id}`}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-detective-amber text-noir-950 text-sm font-bold"
          >
            Go to Investigation Room
          </Link>
        </div>
      </div>
    );
  }

  const isSolved = caseData.playerProgress?.isSolved;
  const score = caseData.playerProgress?.score || 0;
  const rank = caseData.rank || { title: 'Rookie Detective', badge: '📋 Field Log' };
  const clueCount = caseData.playerProgress?.discoveredClues?.length || 0;
  const hintsUsed = caseData.playerProgress?.hintsUsed || 0;
  const basePoints = isSolved
    ? caseData.difficulty === 'hard'
      ? 200
      : caseData.difficulty === 'medium'
      ? 150
      : 100
    : 0;

  return (
    <div className="min-h-screen bg-crime-scene py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verdict Banner */}
        <div
          className={`rounded-3xl border p-8 sm:p-10 relative overflow-hidden shadow-2xl ${
            isSolved
              ? 'bg-gradient-to-br from-emerald-950/70 via-noir-900 to-noir-950 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-gradient-to-br from-rose-950/70 via-noir-900 to-noir-950 border-rose-500/40 shadow-rose-500/10'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  isSolved
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                }`}
              >
                {isSolved ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1">
                  OFFICIAL MAGISTRATE VERDICT
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
                  {isSolved ? 'Case Cracked: Culprit Apprehended!' : 'Wrongful Accusation: Case Cold'}
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  {isSolved
                    ? 'Your deduction was airtight. The perpetrator confessed under interrogation.'
                    : 'Your accusation targeted the wrong person. The actual culprit escaped through the shadows.'}
                </p>
              </div>
            </div>

            {/* Detective Rank Badge */}
            <div className="shrink-0 p-4 rounded-2xl bg-noir-800/90 border border-noir-700 text-center font-mono w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Detective Standing
              </span>
              <p className="text-lg font-black text-detective-amber">{rank.title}</p>
              <p className="text-xs text-slate-300 mt-0.5">{rank.badge}</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="rounded-2xl bg-noir-900 border border-noir-800 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-detective-amber" />
              Investigative Score Docket
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Final Rating:</span>
              <span className="text-xl font-black font-mono text-detective-gold">{score} PTS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div className="bg-noir-800/80 p-4 rounded-xl border border-noir-700/80">
              <span className="text-slate-400 block mb-1">Accusation Base</span>
              <strong className={isSolved ? 'text-emerald-400 text-lg' : 'text-slate-500 text-lg'}>
                {basePoints}
              </strong>
              <span className="block text-[10px] text-slate-500 mt-1">
                {caseData.difficulty.toUpperCase()} {isSolved ? '(Granted)' : '(Forfeited)'}
              </span>
            </div>

            <div className="bg-noir-800/80 p-4 rounded-xl border border-noir-700/80">
              <span className="text-slate-400 block mb-1">Evidence Discovered</span>
              <strong className="text-emerald-400 text-lg">+{clueCount * 5}</strong>
              <span className="block text-[10px] text-slate-500 mt-1">
                {clueCount} Clues (+5 ea)
              </span>
            </div>

            <div className="bg-noir-800/80 p-4 rounded-xl border border-noir-700/80">
              <span className="text-slate-400 block mb-1">Hints Penalty</span>
              <strong className="text-rose-400 text-lg">-{hintsUsed * 10}</strong>
              <span className="block text-[10px] text-slate-500 mt-1">
                {hintsUsed} Used (-10 ea)
              </span>
            </div>

            <div className="bg-noir-800/80 p-4 rounded-xl border border-detective-amber/40 shadow-inner">
              <span className="text-detective-amber block mb-1 font-bold">TOTAL SCORE</span>
              <strong className="text-detective-gold text-2xl font-black">{score}</strong>
              <span className="block text-[10px] text-slate-400 mt-1">Min Bounded 0</span>
            </div>
          </div>
        </div>

        {/* The Truth & Culprit Revelation */}
        <div className="rounded-2xl bg-noir-900 border border-noir-800 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-100">
              Perpetrator Unmasked: {caseData.solution?.culpritName}
            </h2>
          </div>

          <div className="bg-noir-800/80 p-4 rounded-xl border border-noir-700 mb-6">
            <span className="text-xs font-mono text-rose-400 font-semibold block mb-1 uppercase">
              True Motive:
            </span>
            <p className="text-sm text-slate-200">{caseData.solution?.motive}</p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-detective-amber font-semibold block uppercase">
              Confession & Forensic Walkthrough:
            </span>
            <p className="text-sm text-slate-300 leading-relaxed bg-noir-950 p-5 rounded-xl border border-noir-800 font-sans">
              {caseData.solution?.explanation}
            </p>
          </div>

          {/* Player Rationale Comparison */}
          {caseData.playerProgress?.accusation && (
            <div className="mt-6 pt-6 border-t border-noir-800">
              <span className="text-xs font-mono text-slate-400 block mb-1 uppercase">
                Your Filed Indictment Reasoning:
              </span>
              <blockquote className="text-xs text-slate-300 italic bg-noir-800/50 p-3 rounded-lg border-l-2 border-detective-amber">
                "{caseData.playerProgress.accusation.rationale}"
              </blockquote>
            </div>
          )}
        </div>

        {/* Forensic Clues Retrospective */}
        <div className="rounded-2xl bg-noir-900 border border-noir-800 p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-detective-amber" />
            Complete Evidence Roster & Crime Scene Clues
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {caseData.clues.map((clue, idx) => (
              <div
                key={clue.id || idx}
                className="bg-noir-800/80 p-4 rounded-xl border border-noir-700/80"
              >
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                  <span>{clue.location}</span>
                  <span className="text-emerald-400">Evidence #{idx + 1}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-100 mb-1">{clue.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{clue.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-detective-amber text-noir-950 hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Investigate Another Mystery</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-noir-800 text-slate-300 hover:text-slate-100 hover:bg-noir-700 border border-noir-700 transition-colors"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Return to Case Archives</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

