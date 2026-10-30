import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiCaseOutputSchema } from '../schemas/caseValidation.js';

// Configuration per difficulty level
export const DIFFICULTY_CONFIG = {
  easy: {
    suspectCount: 3,
    clueCount: 5,
    hintCount: 2,
    basePoints: 100,
  },
  medium: {
    suspectCount: 4,
    clueCount: 7,
    hintCount: 3,
    basePoints: 150,
  },
  hard: {
    suspectCount: 5,
    clueCount: 9,
    hintCount: 3,
    basePoints: 200,
  },
};

/**
 * Generate a procedural mystery case if Gemini API key is missing or calls fail.
 */
function generateFallbackMystery(premise, difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const timestamp = new Date().toISOString();

  const themes = [
    {
      title: `The Shadow in the Archive: ${premise.slice(0, 30)}`,
      victim: { name: "Lord Alistair Sterling", description: "A secretive antiquities collector known for holding blackmail records." },
      scene: { location: "The Private Library of Sterling Manor", time: "11:42 PM, Rainy Midnight", description: "A shattered decanter of port wine, faint scent of bitter almonds, and an opened wall safe behind a velvet portrait." },
      pool: [
        { name: "Julian Sterling", role: "Estranged Nephew", desc: "Heavily indebted heir with gambling liabilities.", alibi: "Claims to have been playing poker at the gentleman's club until 1:00 AM.", motive: "Impending disinheritance scheduled to take effect the following morning." },
        { name: "Dr. Evelyn Vance", role: "Personal Archivist", desc: "Meticulous researcher who cataloged the stolen cipher parchment.", alibi: "Claims she was cataloging rare manuscripts in the basement vault.", motive: "Sterling refused to publish her lifetime translation of the Byzantine Codex." },
        { name: "Henrietta Finch", role: "Head of Housekeeping", desc: "Long-standing steward who kept all master keys.", alibi: "Claims she was locking the conservatory doors on the east wing.", motive: "Discovered her pension fund was embezzled into Sterling's offshore accounts." },
        { name: "Marcus Thorne", role: "Art Broker", desc: "Smooth-talking appraiser seen arguing with Sterling earlier that evening.", alibi: "Says he departed the estate in his carriage at 10:30 PM.", motive: "Faced public ruin after Sterling exposed a forged Renaissance sketch." },
        { name: "Sylvia Chen", role: "Private Secretary", desc: "Managed Sterling's private appointment book and encrypted ledger.", alibi: "Claims she was typing letters in the carriage house office.", motive: "Blackmailed by Sterling over illicit government correspondence." }
      ],
      cluesPool: [
        { title: "Shattered Crystal Goblet", desc: "Traces of potassium cyanide mixed with vintage 1945 port wine.", loc: "Mahogany Study Desk" },
        { title: "Muddy Footprints (Size 10)", desc: "Traces of rare conservatory peat moss leading from the terrace door.", loc: "French Terrace Window" },
        { title: "Torn Monogrammed Silk Fabric", desc: "A fragment of embroidered violet silk caught on the safe latch.", loc: "Hidden Wall Safe" },
        { title: "Forged Alibi Receipt", desc: "A poker club docket timestamped 11:30 PM, but written in fresh ink with the wrong year.", loc: "Fireplace Grate" },
        { title: "Laboratory Chemical Manifest", desc: "An order for industrial cyanide purchased under an assumed research grant.", loc: "Archivist Wastebasket" },
        { title: "Pocket Watch Stopped at 11:42", desc: "Cracked glass face indicating a brief violent scuffle at the moment of poisoning.", loc: "Near the Armchair" },
        { title: "Brass Master Key Replica", desc: "A freshly filed brass duplicate that opens the private study door from outside.", loc: "Conservatory Flowerpot" },
        { title: "Smudged Ink Ledger Page", desc: "A ledger entry recording an ultimatum delivery deadline set for 11:30 PM.", loc: "Under the Blotter" },
        { title: "Scratched Window Lock", desc: "Tool marks proving the window was unlocked from the inside, not forced open from outside.", loc: "East Terrace Latch" }
      ],
      hintsPool: [
        "Notice the chemical residue in the goblet; the poison had to be administered by someone who served the drink directly.",
        "Compare the silk fabric caught on the safe with the distinctive attire worn by the suspects that evening.",
        "The terrace latch was unlocked from the inside, proving the culprit staged an outside break-in to mask their presence inside the manor."
      ]
    }
  ];

  const t = themes[0];
  const selectedSuspects = t.pool.slice(0, config.suspectCount);
  // Pick the first suspect as culprit for deterministic consistency in fallback
  const culpritIndex = 0;
  
  const suspects = selectedSuspects.map((s, idx) => ({
    id: `suspect_${idx + 1}`,
    name: s.name,
    role: s.role,
    description: s.desc,
    alibi: s.alibi,
    motive: s.motive,
    isCulprit: idx === culpritIndex
  }));

  const culprit = suspects[culpritIndex];

  const clues = t.cluesPool.slice(0, config.clueCount).map((c, idx) => ({
    id: `clue_${idx + 1}`,
    title: c.title,
    description: c.desc,
    location: c.loc
  }));

  const hints = t.hintsPool.slice(0, config.hintCount).map((h, idx) => ({
    id: `hint_${idx + 1}`,
    order: idx + 1,
    text: h
  }));

  return {
    title: t.title,
    story: `At the heart of the estate, Lord Alistair Sterling was found motionless in his leather wingback chair. The premise of the mystery: ${premise}. Tension had been building among those closest to him, each concealing desperate secrets. As thunder broke over the manor, the fateful hour struck, leaving behind a web of deception.`,
    victim: t.victim,
    crimeScene: t.scene,
    suspects,
    clues,
    hints,
    solution: {
      culpritId: culprit.id,
      culpritName: culprit.name,
      motive: culprit.motive,
      explanation: `${culprit.name} slipped cyanide into the port wine decanter right before midnight. To divert suspicion, they forged a poker receipt and staged the terrace window from the inside to appear as a burglar's entry.`
    }
  };
}

/**
 * Generate a full mystery case using Gemini API or fallback
 */
export async function generateMysteryCase(premise, difficulty = 'medium') {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key') {
    console.info(`[GeminiService] No GEMINI_API_KEY detected. Using intelligent mystery engine for: "${premise}" (${difficulty})`);
    return generateFallbackMystery(premise, difficulty);
  }

  const prompt = `
You are an award-winning mystery fiction designer and master criminologist.
Generate an immersive, logically tight detective murder mystery based on the following user premise:
Premise: "${premise}"
Difficulty Level: "${difficulty}"

Strict Requirements:
1. Suspects count: Exactly ${config.suspectCount} suspects. Exactly ONE must be the culprit (isCulprit: true), while all others must be innocent (isCulprit: false) with plausible alibis and motives.
2. Clues count: Exactly ${config.clueCount} clues. The clues must collectively form a logical chain proving the culprit's guilt while providing fair red herrings.
3. Hints count: Exactly ${config.hintCount} hints. Hints must progressively guide an investigative player without instantly spoiling the culprit.
4. Solution: Clearly state the culpritId (must match the suspect's id), culpritName, true motive, and a logical step-by-step explanation linking the clues to the culprit's guilt.

Output MUST be valid JSON matching this exact structure:
{
  "title": "string",
  "story": "string (immersive narrative background)",
  "victim": {
    "name": "string",
    "description": "string"
  },
  "crimeScene": {
    "location": "string",
    "time": "string",
    "description": "string"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "string",
      "role": "string",
      "description": "string",
      "alibi": "string",
      "motive": "string",
      "isCulprit": boolean
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "string",
      "description": "string",
      "location": "string"
    }
  ],
  "hints": [
    {
      "id": "hint_1",
      "order": 1,
      "text": "string"
    }
  ],
  "solution": {
    "culpritId": "suspect_1",
    "culpritName": "string",
    "motive": "string",
    "explanation": "string"
  }
}
Return only JSON. Do not include markdown codeblocks or conversational text.
`;

  try {
    let rawText = '';

    // Attempt using @google/genai first, then @google/generative-ai
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      rawText = response.text || '';
    } catch (sdkError) {
      // Fallback to @google/generative-ai
      console.warn(`[GeminiService] @google/genai attempt error: ${sdkError.message}. Trying @google/generative-ai...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });
      const result = await model.generateContent(prompt);
      rawText = result.response.text();
    }

    // Clean potential markdown backticks
    let cleanedJson = rawText.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleanedJson);
    const validated = GeminiCaseOutputSchema.parse(parsed);

    // Verify exactly one culprit
    const culprits = validated.suspects.filter(s => s.isCulprit);
    if (culprits.length !== 1) {
      throw new Error(`AI generated ${culprits.length} culprits; exactly 1 required.`);
    }

    // Ensure culpritId matches
    if (validated.solution.culpritId !== culprits[0].id) {
      validated.solution.culpritId = culprits[0].id;
      validated.solution.culpritName = culprits[0].name;
    }

    return validated;
  } catch (error) {
    console.error(`[GeminiService] Error calling Gemini API: ${error.message}. Engaging fallback mystery engine.`);
    return generateFallbackMystery(premise, difficulty);
  }
}

