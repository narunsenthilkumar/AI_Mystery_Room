import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/index.js';
import http from 'node:http';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

// ==========================================
// 1. HEALTH CHECK & ARCHIVE LIST
// ==========================================
test('1. Health check returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.status, 'healthy');
});

test('2. GET /api/cases returns array of cases for the archive list', async () => {
  const res = await fetch(`${baseUrl}/api/cases`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.cases));
});

// ==========================================
// 2. DIFFICULTY LEVELS & STRUCTURE TESTS
// ==========================================
test('3. Generates Easy difficulty: 3 suspects, 5 clues, 2 hints', async () => {
  const res = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'A vintage watch stolen from the clock tower',
      difficulty: 'easy'
    })
  });
  const json = await res.json();
  assert.equal(res.status, 201);
  assert.equal(json.data.difficulty, 'easy');
  assert.equal(json.data.suspects.length, 3, 'Easy must have 3 suspects');
  assert.equal(json.data.clues.length, 5, 'Easy must have 5 clues');
  assert.equal(json.data.hints.length, 2, 'Easy must have 2 hints');
});

test('4. Generates Medium difficulty: 4 suspects, 7 clues, 3 hints', async () => {
  const res = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Poisoned chalice at the royal masquerade gala',
      difficulty: 'medium'
    })
  });
  const json = await res.json();
  assert.equal(res.status, 201);
  assert.equal(json.data.difficulty, 'medium');
  assert.equal(json.data.suspects.length, 4, 'Medium must have 4 suspects');
  assert.equal(json.data.clues.length, 7, 'Medium must have 7 clues');
  assert.equal(json.data.hints.length, 3, 'Medium must have 3 hints');
});

test('5. Generates Hard difficulty: 5 suspects, 9 clues, 3 hints', async () => {
  const res = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Syndicate heist inside a high-security quantum lab',
      difficulty: 'hard'
    })
  });
  const json = await res.json();
  assert.equal(res.status, 201);
  assert.equal(json.data.difficulty, 'hard');
  assert.equal(json.data.suspects.length, 5, 'Hard must have 5 suspects');
  assert.equal(json.data.clues.length, 9, 'Hard must have 9 clues');
  assert.equal(json.data.hints.length, 3, 'Hard must have 3 hints');
});

// ==========================================
// 3. ANTI-CHEAT & SECURITY SEQUESTRATION TESTS
// ==========================================
test('6. Anti-Cheat: active case never reveals culprit, solution, or unexamined clue details', async () => {
  const createRes = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Art heist at the national gallery',
      difficulty: 'medium'
    })
  });
  const createJson = await createRes.json();
  const caseId = createJson.data._id || createJson.data.id;

  // 1. In creation response
  assert.equal(createJson.data.solution, undefined, 'Solution must be hidden upon creation');
  createJson.data.suspects.forEach(s => {
    assert.equal(s.isCulprit, undefined, 'isCulprit must be removed from suspects list');
  });
  createJson.data.clues.forEach(c => {
    assert.equal(c.description, null, 'Undiscovered clue description must be hidden');
  });

  // 2. In GET /api/cases/:id response
  const getRes = await fetch(`${baseUrl}/api/cases/${caseId}`);
  const getJson = await getRes.json();
  assert.equal(getJson.data.solution, undefined, 'Solution must be hidden in GET /api/cases/:id');
  getJson.data.suspects.forEach(s => {
    assert.equal(s.isCulprit, undefined, 'isCulprit must be hidden in GET /api/cases/:id');
  });

  // 3. In GET /api/cases/:id/result before accusation: Must return 403 Forbidden!
  const prematureResultRes = await fetch(`${baseUrl}/api/cases/${caseId}/result`);
  assert.equal(prematureResultRes.status, 403, 'Premature result access must be rejected with 403');
  const prematureJson = await prematureResultRes.json();
  assert.equal(prematureJson.success, false);
});

// ==========================================
// 4. SCORING RULES & INVESTIGATION WORKFLOW
// ==========================================
test('7. Scoring & Deductions: Correct accusation on Hard tier with clues and hints', async () => {
  // Hard tier: Base = 200 pts
  const createRes = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Murder on the Orient Express private cabin',
      difficulty: 'hard'
    })
  });
  const createJson = await createRes.json();
  const caseId = createJson.data._id || createJson.data.id;

  // Discover 3 clues: 3 * 5 = +15 pts
  const clue1 = createJson.data.clues[0].id;
  const clue2 = createJson.data.clues[1].id;
  const clue3 = createJson.data.clues[2].id;

  await fetch(`${baseUrl}/api/cases/${caseId}/clues/${clue1}/discover`, { method: 'POST' });
  await fetch(`${baseUrl}/api/cases/${caseId}/clues/${clue2}/discover`, { method: 'POST' });
  const clue3Res = await fetch(`${baseUrl}/api/cases/${caseId}/clues/${clue3}/discover`, { method: 'POST' });
  const clue3Json = await clue3Res.json();
  assert.equal(clue3Json.playerProgress.discoveredClues.length, 3);
  assert.equal(clue3Json.playerProgress.score, 15, '3 clues = 15 points');

  // Request 1 hint: -10 pts
  const hintRes = await fetch(`${baseUrl}/api/cases/${caseId}/hints`, { method: 'POST' });
  const hintJson = await hintRes.json();
  assert.equal(hintJson.playerProgress.hintsUsed, 1);
  assert.equal(hintJson.playerProgress.score, 5, '15 pts - 10 pts = 5 running score');

  // Accuse the primary suspect (suspect_1)
  const suspectId = createJson.data.suspects[0].id;
  const accuseRes = await fetch(`${baseUrl}/api/cases/${caseId}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      suspectId,
      rationale: 'Forensic evidence and lack of alibi match suspect perfectly.'
    })
  });
  const accuseJson = await accuseRes.json();
  assert.equal(accuseRes.status, 200);
  assert.equal(accuseJson.verdict.isCorrect, true);

  // Score verification: 200 (base) + 15 (clues) - 10 (hints) = 205 pts
  assert.equal(accuseJson.verdict.score, 205, 'Expected 205 points on hard difficulty');
  assert.equal(accuseJson.verdict.scoreBreakdown.basePoints, 200);
  assert.equal(accuseJson.verdict.scoreBreakdown.clueBonus, 15);
  assert.equal(accuseJson.verdict.scoreBreakdown.hintPenalty, 10);
  assert.equal(accuseJson.verdict.rank.title, 'Master Detective');

  // After completion, GET /api/cases/:id/result succeeds and includes full solution
  const resultRes = await fetch(`${baseUrl}/api/cases/${caseId}/result`);
  const resultJson = await resultRes.json();
  assert.equal(resultRes.status, 200);
  assert.ok(resultJson.data.solution.explanation);
  assert.ok(resultJson.data.solution.culpritName);
});

test('8. Scoring: Wrong accusation yields 0 base points, total bounded to min 0', async () => {
  // Easy tier: Base = 100 pts if correct, 0 if wrong
  const createRes = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Missing emerald pendant from safe',
      difficulty: 'easy'
    })
  });
  const createJson = await createRes.json();
  const caseId = createJson.data._id || createJson.data.id;

  // Request both hints (2 hints * 10 = -20 pts)
  await fetch(`${baseUrl}/api/cases/${caseId}/hints`, { method: 'POST' });
  await fetch(`${baseUrl}/api/cases/${caseId}/hints`, { method: 'POST' });

  // Do NOT discover any clues (clues = 0)
  // Deliberately accuse an innocent suspect (suspect_2)
  const innocentSuspect = createJson.data.suspects[1].id;
  const accuseRes = await fetch(`${baseUrl}/api/cases/${caseId}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      suspectId: innocentSuspect,
      rationale: 'I mistakenly suspected the innocent party.'
    })
  });
  const accuseJson = await accuseRes.json();
  assert.equal(accuseRes.status, 200);
  assert.equal(accuseJson.verdict.isCorrect, false, 'Innocent suspect should result in wrongful accusation');
  assert.equal(accuseJson.verdict.scoreBreakdown.basePoints, 0, 'Wrong accusation must award 0 base points');

  // Base 0 + Clues 0 - Hints 20 = -20 => bounded to MINIMUM 0
  assert.equal(accuseJson.verdict.score, 0, 'Score must be bounded to minimum 0');
  assert.equal(accuseJson.verdict.rank.title, 'Rookie Detective');
});

// ==========================================
// 5. INPUT VALIDATION & EDGE CASE HANDLING
// ==========================================
test('9. Validation: Rejects invalid or empty mystery premises', async () => {
  const res = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: '  ', // Empty
      difficulty: 'easy'
    })
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
});

test('10. Validation: Rejects invalid difficulty level', async () => {
  const res = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Valid premise description',
      difficulty: 'nightmare' // Not easy, medium, hard
    })
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
});

test('11. Edge Case: Requesting hints beyond limit returns error', async () => {
  const createRes = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Stolen manuscript',
      difficulty: 'easy' // has exactly 2 hints
    })
  });
  const createJson = await createRes.json();
  const caseId = createJson.data._id || createJson.data.id;

  // Request hint 1
  const h1 = await fetch(`${baseUrl}/api/cases/${caseId}/hints`, { method: 'POST' });
  assert.equal(h1.status, 200);

  // Request hint 2
  const h2 = await fetch(`${baseUrl}/api/cases/${caseId}/hints`, { method: 'POST' });
  assert.equal(h2.status, 200);

  // Request hint 3 (should fail as only 2 hints exist)
  const h3 = await fetch(`${baseUrl}/api/cases/${caseId}/hints`, { method: 'POST' });
  assert.equal(h3.status, 400);
  const h3Json = await h3.json();
  assert.equal(h3Json.success, false);
  assert.match(h3Json.message, /No more hints available/i);
});

test('12. Edge Case: Cannot modify or accuse an already completed case', async () => {
  const createRes = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Locked room poisoning',
      difficulty: 'easy'
    })
  });
  const createJson = await createRes.json();
  const caseId = createJson.data._id || createJson.data.id;
  const suspectId = createJson.data.suspects[0].id;

  // Complete case with accusation
  await fetch(`${baseUrl}/api/cases/${caseId}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      suspectId,
      rationale: 'Valid rationale.'
    })
  });

  // Attempt to accuse again
  const secondAccuse = await fetch(`${baseUrl}/api/cases/${caseId}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      suspectId,
      rationale: 'Trying again.'
    })
  });
  assert.equal(secondAccuse.status, 400);

  // Attempt to discover clue after case completed
  const discoverAfter = await fetch(`${baseUrl}/api/cases/${caseId}/clues/clue_1/discover`, {
    method: 'POST'
  });
  assert.equal(discoverAfter.status, 400);

  // Attempt to request hint after case completed
  const hintAfter = await fetch(`${baseUrl}/api/cases/${caseId}/hints`, {
    method: 'POST'
  });
  assert.equal(hintAfter.status, 400);
});
