import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  isCulprit: { type: Boolean, default: false }
}, { _id: false });

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  isDiscovered: { type: Boolean, default: false },
  discoveredAt: { type: Date }
}, { _id: false });

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  order: { type: Number, required: true },
  text: { type: String, required: true },
  isRevealed: { type: Boolean, default: false },
  revealedAt: { type: Date }
}, { _id: false });

const SolutionSchema = new mongoose.Schema({
  culpritId: { type: String, required: true },
  culpritName: { type: String, required: true },
  motive: { type: String, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  story: { type: String, required: true },
  victim: {
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  crimeScene: {
    location: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true }
  },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],
  solution: {
    type: SolutionSchema,
    required: true
  },
  playerProgress: {
    discoveredClues: [{ type: String }],
    hintsUsed: { type: Number, default: 0 },
    accusation: {
      suspectId: { type: String },
      rationale: { type: String },
      accusedAt: { type: Date }
    },
    isSolved: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
  }
}, { timestamps: true });

export const CaseModel = mongoose.models.Case || mongoose.model('Case', CaseSchema);
export default CaseModel;

