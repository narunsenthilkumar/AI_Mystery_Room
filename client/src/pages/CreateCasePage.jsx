import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, AlertCircle, ArrowLeft, Loader2, KeyRound, Eye, Lightbulb } from 'lucide-react';
import { createCase } from '../services/api';

const PRESETS = [
  {
    title: 'Victorian Manor Poisoning',
    premise: 'A wealthy lord is found poisoned by cyanide in his locked study during his 60th birthday gala, with five family members and staff holding grudge motives.',
  },
  {
    title: 'Cyber-Heist on Neo-Tokyo Express',
    premise: 'An experimental quantum encryption drive is stolen from a locked high-speed maglev compartment between Tokyo and Kyoto; four passengers had proximity access.',
  },
  {
    title: 'Vanishing Opera Prima Donna',
    premise: 'The lead soprano vanishes from her dressing room seconds before the final act of Carmen at the Paris Opera House, leaving a shattered mirror and a cryptic sheet music note.',
  },
  {
    title: 'Billionaire Tech Pitch Murder',
    premise: 'A controversial venture capitalist is found dead inside an airtight server farm immediately following a heated demo room argument.',
  },
];

export default function CreateCasePage() {
  const navigate = useNavigate();
  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    'Consulting Gemini Detective Engine...',
    'Synthesizing suspect dossiers and alibis...',
    'Concealing forensic clues across crime scene...',
    'Encrypting culprit identity & solution...',
    'Finalizing case docket...',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!premise.trim()) {
      setError('Please provide a mystery premise or select one of the inspiration presets.');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await createCase({
        premise: premise.trim(),
        difficulty,
      });

      clearInterval(stepInterval);
      const caseId = response.data?.data?._id || response.data?.data?.id;
      if (caseId) {
        navigate(`/case/${caseId}`);
      } else {
        throw new Error('Case ID missing in response.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Failed to create case:', err);
      setError(
        err.response?.data?.message || err.message || 'Failed to generate mystery case. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-crime-scene py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Headquarters
        </button>

        <div className="rounded-2xl bg-noir-900 border border-noir-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-detective-amber/10 border border-detective-amber/30 flex items-center justify-center text-detective-amber">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                Synthesize Mystery Room
              </h1>
              <p className="text-sm text-slate-400">
                Specify your investigative premise or pick an inspiration preset
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-semibold">Investigation Commission Rejected</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Premise Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Mystery Premise / Core Narrative
              </label>
              <textarea
                rows={4}
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="Describe the setting, the crime, and key circumstances (e.g., 'A vintage violin is stolen from a backstage vault during a stormy concert...')"
                className="w-full rounded-xl bg-noir-800 border border-noir-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-detective-amber focus:ring-1 focus:ring-detective-amber text-sm leading-relaxed"
                disabled={loading}
              />

              {/* Inspiration Presets */}
              <div className="mt-3">
                <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
                  Preset Inspiration Dossiers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={loading}
                      onClick={() => setPremise(p.premise)}
                      className="px-3 py-1 rounded-lg bg-noir-800 hover:bg-noir-700 border border-noir-700 text-xs text-slate-300 hover:text-detective-amber font-mono transition-colors text-left"
                    >
                      + {p.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Select Investigation Difficulty
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Easy */}
                <div
                  onClick={() => !loading && setDifficulty('easy')}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    difficulty === 'easy'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-noir-800/80 border-noir-700 hover:border-noir-600 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-200">Easy</span>
                    <span className="text-xs font-mono">100 Base Pts</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-400 font-mono">
                    <li>• 3 Suspects</li>
                    <li>• 5 Clues</li>
                    <li>• 2 Hints</li>
                  </ul>
                </div>

                {/* Medium */}
                <div
                  onClick={() => !loading && setDifficulty('medium')}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    difficulty === 'medium'
                      ? 'bg-amber-500/10 border-detective-amber text-detective-amber ring-2 ring-amber-500/20'
                      : 'bg-noir-800/80 border-noir-700 hover:border-noir-600 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-200">Medium</span>
                    <span className="text-xs font-mono">150 Base Pts</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-400 font-mono">
                    <li>• 4 Suspects</li>
                    <li>• 7 Clues</li>
                    <li>• 3 Hints</li>
                  </ul>
                </div>

                {/* Hard */}
                <div
                  onClick={() => !loading && setDifficulty('hard')}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    difficulty === 'hard'
                      ? 'bg-rose-500/10 border-rose-500 text-rose-400 ring-2 ring-rose-500/20'
                      : 'bg-noir-800/80 border-noir-700 hover:border-noir-600 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-200">Hard</span>
                    <span className="text-xs font-mono">200 Base Pts</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-400 font-mono">
                    <li>• 5 Suspects</li>
                    <li>• 9 Clues</li>
                    <li>• 3 Hints</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-detective-amber via-amber-400 to-amber-500 text-noir-950 hover:brightness-110 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{loadingSteps[loadingStep]}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Generate Crime Scene & Enter Investigation</span>
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

