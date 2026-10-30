import { CreateCaseInputSchema, AccusationInputSchema } from '../schemas/caseValidation.js';
import { generateMysteryCase, DIFFICULTY_CONFIG } from '../services/geminiService.js';
import CaseRepository from '../services/caseRepository.js';

/**
 * Strips confidential information (culprit and solution) from active case data.
 */
function sanitizeCaseForClient(caseDoc) {
  const data = JSON.parse(JSON.stringify(caseDoc));
  const isCompleted = data.playerProgress?.status === 'completed';

  if (!isCompleted) {
    // Hide solution completely
    delete data.solution;

    // Remove isCulprit flag from suspects
    if (Array.isArray(data.suspects)) {
      data.suspects = data.suspects.map(s => {
        const { isCulprit, ...publicSuspect } = s;
        return publicSuspect;
      });
    }

    // Conceal descriptions of undiscovered clues
    if (Array.isArray(data.clues)) {
      data.clues = data.clues.map(c => {
        if (!c.isDiscovered) {
          return {
            id: c.id,
            title: c.title,
            location: c.location,
            isDiscovered: false,
            description: null, // Hidden until player inspects/discovers
          };
        }
        return c;
      });
    }

    // Conceal text of unrevealed hints
    if (Array.isArray(data.hints)) {
      data.hints = data.hints.map(h => {
        if (!h.isRevealed) {
          return {
            id: h.id,
            order: h.order,
            isRevealed: false,
            text: null,
          };
        }
        return h;
      });
    }
  }

  return data;
}

/**
 * Compute detective rank based on final score
 */
function calculateDetectiveRank(score) {
  if (score >= 160) return { title: 'Master Detective', badge: '🕵️‍♂️ Magnifying Glass of Truth' };
  if (score >= 120) return { title: 'Senior Inspector', badge: '🎖️ Scotland Yard Ribbon' };
  if (score >= 70) return { title: 'Investigative Sleuth', badge: '🔍 Bronze Pocket Compass' };
  return { title: 'Rookie Detective', badge: '📋 Field Log Notepad' };
}

export const createCase = async (req, res) => {
  try {
    const validatedInput = CreateCaseInputSchema.parse(req.body);
    const { premise, difficulty } = validatedInput;

    // Generate mystery case via Gemini API / Engine
    const generatedCase = await generateMysteryCase(premise, difficulty);

    // Prepare case document
    const newCaseData = {
      title: generatedCase.title,
      premise,
      difficulty,
      story: generatedCase.story,
      victim: generatedCase.victim,
      crimeScene: generatedCase.crimeScene,
      suspects: generatedCase.suspects,
      clues: generatedCase.clues.map(c => ({
        ...c,
        isDiscovered: false,
      })),
      hints: generatedCase.hints.map(h => ({
        ...h,
        isRevealed: false,
      })),
      solution: generatedCase.solution,
      playerProgress: {
        discoveredClues: [],
        hintsUsed: 0,
        isSolved: false,
        score: 0,
        status: 'active',
      },
    };

    const savedCase = await CaseRepository.create(newCaseData);
    const sanitized = sanitizeCaseForClient(savedCase);

    res.status(201).json({
      success: true,
      message: 'Mystery room generated successfully',
      data: sanitized,
    });
  } catch (error) {
    console.error('[CaseController] createCase error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create case',
    });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case not found',
      });
    }

    const sanitized = sanitizeCaseForClient(caseDoc);
    res.status(200).json({
      success: true,
      data: sanitized,
    });
  } catch (error) {
    console.error('[CaseController] getCaseById error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve case',
    });
  }
};

export const discoverClue = async (req, res) => {
  try {
    const { id, clueId } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.playerProgress?.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Case is already completed' });
    }

    const clue = caseDoc.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({ success: false, message: 'Clue not found in this crime scene' });
    }

    if (!clue.isDiscovered) {
      clue.isDiscovered = true;
      clue.discoveredAt = new Date();

      if (!caseDoc.playerProgress.discoveredClues.includes(clueId)) {
        caseDoc.playerProgress.discoveredClues.push(clueId);
      }

      // Calculate running score
      const clueScore = caseDoc.playerProgress.discoveredClues.length * 5;
      const hintCost = (caseDoc.playerProgress.hintsUsed || 0) * 10;
      caseDoc.playerProgress.score = Math.max(0, clueScore - hintCost);

      await caseDoc.save();
    }

    res.status(200).json({
      success: true,
      message: 'Clue examined and cataloged',
      clue: {
        id: clue.id,
        title: clue.title,
        description: clue.description,
        location: clue.location,
        isDiscovered: true,
        discoveredAt: clue.discoveredAt,
      },
      playerProgress: caseDoc.playerProgress,
    });
  } catch (error) {
    console.error('[CaseController] discoverClue error:', error);
    res.status(500).json({ success: false, message: 'Failed to discover clue' });
  }
};

export const requestHint = async (req, res) => {
  try {
    const { id } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.playerProgress?.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Case is already completed' });
    }

    // Find the next unrevealed hint
    const nextHint = caseDoc.hints
      .slice()
      .sort((a, b) => a.order - b.order)
      .find(h => !h.isRevealed);

    if (!nextHint) {
      return res.status(400).json({
        success: false,
        message: 'No more hints available for this investigation',
      });
    }

    nextHint.isRevealed = true;
    nextHint.revealedAt = new Date();
    caseDoc.playerProgress.hintsUsed = (caseDoc.playerProgress.hintsUsed || 0) + 1;

    // Apply -10 hint deduction
    const clueScore = (caseDoc.playerProgress.discoveredClues?.length || 0) * 5;
    const hintCost = caseDoc.playerProgress.hintsUsed * 10;
    caseDoc.playerProgress.score = Math.max(0, clueScore - hintCost);

    await caseDoc.save();

    res.status(200).json({
      success: true,
      message: 'Hint revealed (-10 points)',
      hint: nextHint,
      playerProgress: caseDoc.playerProgress,
    });
  } catch (error) {
    console.error('[CaseController] requestHint error:', error);
    res.status(500).json({ success: false, message: 'Failed to request hint' });
  }
};

export const submitAccusation = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspectId, rationale } = AccusationInputSchema.parse(req.body);

    const caseDoc = await CaseRepository.findById(id);
    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.playerProgress?.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Accusation already recorded. Case file is sealed.',
      });
    }

    const suspect = caseDoc.suspects.find(s => s.id === suspectId);
    if (!suspect) {
      return res.status(400).json({ success: false, message: 'Selected suspect does not exist' });
    }

    const isCorrect = suspectId === caseDoc.solution.culpritId;
    const config = DIFFICULTY_CONFIG[caseDoc.difficulty] || DIFFICULTY_CONFIG.medium;

    // Scoring calculation rules:
    // Correct accusation: Easy 100, Medium 150, Hard 200
    // Incorrect accusation: 0
    // +5 for each discovered clue
    // -10 for each hint used
    // Minimum score: 0
    const basePoints = isCorrect ? config.basePoints : 0;
    const clueCount = caseDoc.playerProgress.discoveredClues?.length || 0;
    const clueBonus = clueCount * 5;
    const hintsUsed = caseDoc.playerProgress.hintsUsed || 0;
    const hintPenalty = hintsUsed * 10;
    const finalScore = Math.max(0, basePoints + clueBonus - hintPenalty);

    caseDoc.playerProgress.accusation = {
      suspectId,
      rationale,
      accusedAt: new Date(),
    };
    caseDoc.playerProgress.isSolved = isCorrect;
    caseDoc.playerProgress.score = finalScore;
    caseDoc.playerProgress.status = 'completed';

    // Mark all clues as discovered for the post-game review
    caseDoc.clues.forEach(c => {
      c.isDiscovered = true;
    });

    await caseDoc.save();

    const rank = calculateDetectiveRank(finalScore);

    res.status(200).json({
      success: true,
      message: isCorrect ? 'Case solved! The culprit has been apprehended!' : 'Wrongful accusation! The true culprit remains at large.',
      verdict: {
        isCorrect,
        accusedSuspect: suspect.name,
        culpritName: caseDoc.solution.culpritName,
        culpritId: caseDoc.solution.culpritId,
        motive: caseDoc.solution.motive,
        explanation: caseDoc.solution.explanation,
        score: finalScore,
        scoreBreakdown: {
          difficulty: caseDoc.difficulty,
          basePoints,
          cluesDiscovered: clueCount,
          clueBonus,
          hintsUsed,
          hintPenalty,
          finalScore,
        },
        rank,
      },
      case: caseDoc,
    });
  } catch (error) {
    console.error('[CaseController] submitAccusation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit accusation',
    });
  }
};

export const getCaseResult = async (req, res) => {
  try {
    const { id } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.playerProgress?.status !== 'completed') {
      return res.status(403).json({
        success: false,
        message: 'Case is still in progress. The solution is sealed until an accusation is filed.',
      });
    }

    const rank = calculateDetectiveRank(caseDoc.playerProgress.score || 0);

    res.status(200).json({
      success: true,
      data: {
        title: caseDoc.title,
        difficulty: caseDoc.difficulty,
        story: caseDoc.story,
        victim: caseDoc.victim,
        crimeScene: caseDoc.crimeScene,
        suspects: caseDoc.suspects,
        clues: caseDoc.clues,
        solution: caseDoc.solution,
        playerProgress: caseDoc.playerProgress,
        rank,
      },
    });
  } catch (error) {
    console.error('[CaseController] getCaseResult error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve result' });
  }
};

export const getAllCases = async (req, res) => {
  try {
    const cases = await CaseRepository.find();
    const sanitizedList = cases.map(c => ({
      _id: c._id || c.id,
      title: c.title,
      premise: c.premise,
      difficulty: c.difficulty,
      createdAt: c.createdAt,
      status: c.playerProgress?.status || 'active',
      isSolved: c.playerProgress?.isSolved || false,
      score: c.playerProgress?.score || 0,
    }));

    res.status(200).json({
      success: true,
      cases: sanitizedList,
    });
  } catch (error) {
    console.error('[CaseController] getAllCases error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cases' });
  }
};

