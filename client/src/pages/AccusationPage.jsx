import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  Loader2,
  Lock
} from 'lucide-react';
import { getCaseById, submitAccusation } from '../services/api';

export default function AccusationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedSuspectId, setSelectedSuspectId] = useState(searchParams.get('suspect') || '');
  const [rationale, setRationale] = useState('');

  useEffect(() => {
    getCaseById(id)
      .then((res) => {
        setCaseData(res.data.data);
        if (res.data.data.playerProgress?.status === 'completed') {
          navigate(`/case/${id}/result`);
        }
      })
      .catch((err) => {
        console.error('Failed to load case:', err);
        setError('Failed to retrieve case file for indictment.');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSuspectId) {
      setError('You must select a prime suspect before filing formal charges.');
      return;
    }

    if (!rationale.trim() || rationale.trim().length < 5) {
      setError('Please provide your investigative reasoning (at least 5 characters) explaining how the clues implicate this suspect.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await submitAccusation(id, {
        suspectId: selectedSuspectId,
        rationale: rationale.trim(),
      });
      navigate(`/case/${id}/result`);
    } catch (err) {
      console.error('Failed to submit accusation:', err);
      setError(err.response?.data?.message || 'Failed to submit accusation. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-crime-scene flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-200">Convening Magistrate Court...</h2>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-crime-scene flex flex-col items-center justify-center p-6 text-center">
        <p className="text-rose-400">Case file not found.</p>
        <Link to="/" className="mt-4 text-xs font-mono text-detective-amber underline">
          Return to HQ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crime-scene py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(`/case/${id}`)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Crime Scene Investigation
        </button>

        <div className="rounded-2xl bg-noir-900 border border-noir-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                Accusation Chamber
              </h1>
              <p className="text-sm text-slate-400">
                Identify the culprit and present your forensic justification
              </p>
            </div>
          </div>

          {/* High-stakes warning */}
          <div className="mb-8 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3 text-rose-300 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-semibold text-rose-200">Formal Indictment Warning</p>
              <p className="text-xs text-rose-300/90 mt-0.5">
                Submitting this accusation seals the case dossier permanently. A correct accusation
                awards full base points ({caseData.difficulty === 'hard' ? 200 : caseData.difficulty === 'medium' ? 150 : 100} pts),
                while an incorrect charge forfeits all base points.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-amber-500/10 border border-detective-amber/30 p-4 text-xs text-amber-300 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Suspect Lineup Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                1. Select the Prime Suspect
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseData.suspects.map((suspect) => {
                  const isSelected = selectedSuspectId === suspect.id;
                  return (
                    <div
                      key={suspect.id}
                      onClick={() => !submitting && setSelectedSuspectId(suspect.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
                        isSelected
                          ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/30'
                          : 'bg-noir-800/80 border-noir-700 hover:border-noir-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-noir-700 flex items-center justify-center font-mono font-bold text-slate-200 text-xs">
                            {suspect.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-100">{suspect.name}</h4>
                            <p className="text-[11px] font-mono text-detective-amber">{suspect.role}</p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-600'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                        {suspect.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Investigative Reasoning / Rationale */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                2. Detective's Deductive Rationale
              </label>
              <p className="text-xs text-slate-400 mb-2">
                Detail the logical chain linking the discovered evidence to this suspect's motive and alibi collapse.
              </p>
              <textarea
                rows={4}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="E.g., The suspect claimed to be at the poker club, but the monogrammed fabric caught on the safe matches their violet silk robe, and the poison traces in the goblet correspond to their private laboratory manifest..."
                className="w-full rounded-xl bg-noir-800 border border-noir-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm leading-relaxed"
                disabled={submitting}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Transmitting Indictment to Magistrate...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>File Formal Charges & Reveal Solution</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

