import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Key,
  Lightbulb,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Award,
  ArrowRight,
  Clock,
  MapPin,
  HelpCircle,
  ShieldAlert,
  Loader2,
  Sparkles
} from 'lucide-react';
import { getCaseById, discoverClue, requestHint } from '../services/api';

export default function InvestigationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('clues'); // 'clues' | 'suspects' | 'scene' | 'hints'
  const [examiningClueId, setExaminingClueId] = useState(null);
  const [hintPromptOpen, setHintPromptOpen] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await getCaseById(id);
      setCaseData(res.data.data);
      // If completed, redirect to results
      if (res.data.data.playerProgress?.status === 'completed') {
        navigate(`/case/${id}/result`);
      }
    } catch (err) {
      console.error('Failed to load case:', err);
      setError(err.response?.data?.message || 'Failed to load case dossier');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoverClue = async (clueId) => {
    if (examiningClueId) return;
    setExaminingClueId(clueId);

    try {
      const res = await discoverClue(id, clueId);
      const updatedClue = res.data.clue;
      const updatedProgress = res.data.playerProgress;

      setCaseData((prev) => ({
        ...prev,
        clues: prev.clues.map((c) => (c.id === clueId ? { ...c, ...updatedClue } : c)),
        playerProgress: updatedProgress,
      }));
    } catch (err) {
      console.error('Failed to discover clue:', err);
    } finally {
      setExaminingClueId(null);
    }
  };

  const handleRequestHint = async () => {
    setHintLoading(true);
    try {
      const res = await requestHint(id);
      const revealedHint = res.data.hint;
      const updatedProgress = res.data.playerProgress;

      setCaseData((prev) => ({
        ...prev,
        hints: prev.hints.map((h) => (h.id === revealedHint.id ? revealedHint : h)),
        playerProgress: updatedProgress,
      }));
      setHintPromptOpen(false);
    } catch (err) {
      console.error('Failed to request hint:', err);
    } finally {
      setHintLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-crime-scene flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-detective-amber animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-200">Accessing Crime Scene Files...</h2>
        <p className="text-sm text-slate-500 font-mono mt-1">Securing chain of custody</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-crime-scene flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl bg-noir-900 border border-noir-800 p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100">Case Dossier Unavailable</h2>
          <p className="text-sm text-slate-400 mt-2">{error || 'Case could not be found'}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-noir-800 hover:bg-noir-700 text-slate-200 text-sm font-semibold border border-noir-700"
          >
            Return to Headquarters
          </Link>
        </div>
      </div>
    );
  }

  const discoveredCount = caseData.playerProgress?.discoveredClues?.length || 0;
  const totalClues = caseData.clues?.length || 0;
  const hintsUsed = caseData.playerProgress?.hintsUsed || 0;
  const totalHints = caseData.hints?.length || 0;
  const currentScore = caseData.playerProgress?.score || 0;

  return (
    <div className="min-h-screen bg-crime-scene pb-24">
      {/* Top HUD Bar */}
      <div className="sticky top-16 z-40 bg-noir-900/95 backdrop-blur border-b border-noir-800 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded font-mono text-xs font-bold uppercase tracking-wider ${
                caseData.difficulty === 'hard'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : caseData.difficulty === 'medium'
                  ? 'bg-amber-500/10 text-detective-amber border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {caseData.difficulty} Tier
            </span>
            <h1 className="text-lg font-bold text-slate-100 truncate max-w-xs sm:max-w-md">
              {caseData.title}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Clues Counter */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Key className="w-4 h-4 text-detective-amber" />
              <span className="text-slate-400">Clues:</span>
              <strong className="text-slate-100">
                {discoveredCount} / {totalClues}
              </strong>
            </div>

            {/* Hints Counter */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Lightbulb className="w-4 h-4 text-detective-cyan" />
              <span className="text-slate-400">Hints:</span>
              <strong className="text-slate-100">
                {hintsUsed} / {totalHints}
              </strong>
            </div>

            {/* Score Tracker */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-noir-800 border border-noir-700 text-xs font-mono">
              <Award className="w-4 h-4 text-detective-gold" />
              <span className="text-slate-400">Evidence Pts:</span>
              <span className="font-bold text-detective-gold">{currentScore}</span>
            </div>

            {/* Indict Button */}
            <Link
              to={`/case/${id}/accuse`}
              className="px-4 py-2 rounded-lg font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-105"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Make Accusation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-noir-800 mb-8 space-x-2">
          <button
            onClick={() => setActiveTab('clues')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'clues'
                ? 'border-detective-amber text-detective-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Forensic Clues ({discoveredCount}/{totalClues})</span>
          </button>

          <button
            onClick={() => setActiveTab('suspects')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'suspects'
                ? 'border-detective-amber text-detective-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Suspect Dossiers ({caseData.suspects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scene')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'scene'
                ? 'border-detective-amber text-detective-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Crime Scene Briefing</span>
          </button>

          <button
            onClick={() => setActiveTab('hints')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'hints'
                ? 'border-detective-amber text-detective-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Investigative Hints ({hintsUsed}/{totalHints})</span>
          </button>
        </div>

        {/* TAB 1: CLUES BOARD */}
        {activeTab === 'clues' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Key className="w-5 h-5 text-detective-amber" />
                  Forensic Evidence Locker
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Examine each location to discover forensic evidence (+5 points each)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseData.clues.map((clue, idx) => (
                <div
                  key={clue.id || idx}
                  className={`rounded-2xl border p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                    clue.isDiscovered
                      ? 'bg-noir-900 border-detective-amber/30 shadow-lg shadow-amber-500/5'
                      : 'bg-noir-900/60 border-noir-800 hover:border-noir-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3 font-mono">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {clue.location}
                      </span>
                      {clue.isDiscovered ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Discovered (+5)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-noir-800 text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Sealed
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-2">{clue.title}</h3>

                    {clue.isDiscovered ? (
                      <p className="text-sm text-slate-300 leading-relaxed mt-2 bg-noir-800/80 p-3 rounded-xl border border-noir-700">
                        {clue.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic mt-2">
                        Forensic artifact unexamined. Click below to inspect evidence at {clue.location}.
                      </p>
                    )}
                  </div>

                  {!clue.isDiscovered && (
                    <button
                      onClick={() => handleDiscoverClue(clue.id)}
                      disabled={examiningClueId === clue.id}
                      className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold font-mono bg-noir-800 hover:bg-noir-700 border border-noir-700 text-detective-amber hover:border-detective-amber/50 flex items-center justify-center gap-2 transition-all"
                    >
                      {examiningClueId === clue.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Forensic Analysis...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Inspect Evidence (+5 pts)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SUSPECTS DOSSIER */}
        {activeTab === 'suspects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-detective-amber" />
                  Persons of Interest
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Examine statements, motives, and verify each suspect's alibi against discovered clues
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseData.suspects.map((suspect, idx) => (
                <div
                  key={suspect.id || idx}
                  className="rounded-2xl bg-noir-900 border border-noir-800 hover:border-noir-700 p-6 shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-noir-800 border border-noir-700 flex items-center justify-center text-detective-amber font-mono font-bold text-lg">
                        {suspect.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{suspect.name}</h3>
                        <p className="text-xs font-mono text-detective-amber">{suspect.role}</p>
                      </div>
                    </div>

                    <Link
                      to={`/case/${id}/accuse?suspect=${suspect.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Accuse</span>
                    </Link>
                  </div>

                  <p className="text-sm text-slate-300 mb-4">{suspect.description}</p>

                  <div className="space-y-3 pt-3 border-t border-noir-800 text-xs">
                    <div className="bg-noir-800/80 p-3 rounded-xl border border-noir-700/80">
                      <span className="font-semibold text-slate-200 block mb-1 font-mono">
                        Alibi Statement:
                      </span>
                      <p className="text-slate-300 italic">"{suspect.alibi}"</p>
                    </div>

                    <div className="bg-noir-800/80 p-3 rounded-xl border border-noir-700/80">
                      <span className="font-semibold text-rose-400 block mb-1 font-mono">
                        Investigated Motive:
                      </span>
                      <p className="text-slate-300">{suspect.motive}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CRIME SCENE BRIEFING */}
        {activeTab === 'scene' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="rounded-2xl bg-noir-900 border border-noir-800 p-8 shadow-xl">
              <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-detective-amber" />
                Case Narrative Briefing
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {caseData.story}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Victim Card */}
              <div className="rounded-2xl bg-noir-900 border border-noir-800 p-6 shadow-xl">
                <span className="text-xs font-mono text-detective-amber uppercase tracking-wider block mb-2">
                  Victim Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  {caseData.victim?.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {caseData.victim?.description}
                </p>
              </div>

              {/* Crime Scene Card */}
              <div className="rounded-2xl bg-noir-900 border border-noir-800 p-6 shadow-xl">
                <span className="text-xs font-mono text-detective-cyan uppercase tracking-wider block mb-2">
                  Crime Scene Overview
                </span>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <strong>{caseData.crimeScene?.location}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{caseData.crimeScene?.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 pt-2 border-t border-noir-800 leading-relaxed">
                    {caseData.crimeScene?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HINTS DRAWER */}
        {activeTab === 'hints' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-detective-cyan" />
                  Investigative Hints
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Request guidance from senior inspectors. Each revealed hint deducts 10 points.
                </p>
              </div>

              {caseData.hints.some((h) => !h.isRevealed) && (
                <button
                  onClick={() => setHintPromptOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-detective-cyan/10 hover:bg-detective-cyan/20 border border-detective-cyan/30 text-detective-cyan flex items-center gap-2 transition-colors"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Request Next Hint (-10 pts)</span>
                </button>
              )}
            </div>

            {/* Hint Warning Modal */}
            {hintPromptOpen && (
              <div className="mb-6 rounded-2xl bg-amber-500/10 border border-detective-amber/30 p-6 text-slate-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-detective-amber shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-100">Confirm Hint Disclosure</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Are you sure you want to disclose the next hint? This will deduct{' '}
                      <strong className="text-detective-amber">10 points</strong> from your final
                      investigation score.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={handleRequestHint}
                        disabled={hintLoading}
                        className="px-4 py-2 rounded-lg bg-detective-amber hover:bg-amber-400 text-noir-950 font-bold text-xs flex items-center gap-2"
                      >
                        {hintLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>Yes, Reveal Hint</span>
                      </button>
                      <button
                        onClick={() => setHintPromptOpen(false)}
                        className="px-4 py-2 rounded-lg bg-noir-800 hover:bg-noir-700 text-slate-300 font-semibold text-xs border border-noir-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {caseData.hints.map((hint, idx) => (
                <div
                  key={hint.id || idx}
                  className={`rounded-2xl border p-6 transition-all ${
                    hint.isRevealed
                      ? 'bg-noir-900 border-detective-cyan/30 shadow-lg shadow-cyan-500/5'
                      : 'bg-noir-900/60 border-noir-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">Hint #{hint.order}</span>
                    {hint.isRevealed ? (
                      <span className="px-2 py-0.5 rounded bg-detective-cyan/10 text-detective-cyan font-bold">
                        Revealed (-10 pts)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-noir-800 text-slate-500">
                        Classified
                      </span>
                    )}
                  </div>

                  {hint.isRevealed ? (
                    <p className="text-sm text-slate-200 leading-relaxed font-sans mt-2">
                      {hint.text}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 italic font-mono mt-1">
                      [CLASSIFIED INSPECTION HINT — Use "Request Next Hint" to decrypt]
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Indictment Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-noir-900/95 backdrop-blur-md border-t border-noir-800 py-3 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="hidden sm:block text-xs text-slate-400 font-mono">
            Analyzed {discoveredCount} of {totalClues} clues • Ready to name the perpetrator?
          </div>
          <Link
            to={`/case/${id}/accuse`}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Enter Accusation Chamber & File Charges</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

