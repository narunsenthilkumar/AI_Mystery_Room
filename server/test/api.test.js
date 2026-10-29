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

test('1. Health check returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.status, 'healthy');
});

test('2. POST /api/cases generates an Easy mystery room with sanitized secrets', async () => {
  const payload = {
    premise: 'The Stolen Emerald of the Maharaja from the Grand Museum',
    difficulty: 'easy'
  };

  const res = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  assert.equal(res.status, 201);
  assert.equal(json.success, true);
  
  const caseData = json.data;
  assert.ok(caseData._id || caseData.id);
  assert.equal(caseData.difficulty, 'easy');
  assert.equal(caseData.suspects.length, 3, 'Easy difficulty must have 3 suspects');
  assert.equal(caseData.clues.length, 5, 'Easy difficulty must have 5 clues');
  assert.equal(caseData.hints.length, 2, 'Easy difficulty must have 2 hints');

  // CRITICAL SECURITY TEST: Ensure solution and isCulprit are sequestered
  assert.equal(caseData.solution, undefined, 'Solution must NOT be returned to the client during active gameplay');
  caseData.suspects.forEach(s => {
    assert.equal(s.isCulprit, undefined, 'isCulprit must be hidden from suspects list');
  });

  // Verify undiscovered clues do not reveal descriptions
  caseData.clues.forEach(c => {
    assert.equal(c.isDiscovered, false);
    assert.equal(c.description, null, 'Undiscovered clue description must be hidden');
  });
});

test('3. Full investigation lifecycle: discover clue, request hint, and submit accusation', async () => {
  // Step A: Create medium case
  const createRes = await fetch(`${baseUrl}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Poisoned chalice at the royal banquet',
      difficulty: 'medium'
    })
  });
  const createJson = await createRes.json();
  const caseId = createJson.data._id || createJson.data.id;
  const firstClueId = createJson.data.clues[0].id;
  const suspectId = createJson.data.suspects[0].id;

  // Step B: Discover a clue
  const discoverRes = await fetch(`${baseUrl}/api/cases/${caseId}/clues/${firstClueId}/discover`, {
    method: 'POST'
  });
  const discoverJson = await discoverRes.json();
  assert.equal(discoverRes.status, 200);
  assert.equal(discoverJson.clue.isDiscovered, true);
  assert.ok(discoverJson.clue.description, 'Discovered clue must have its description revealed');
  assert.equal(discoverJson.playerProgress.discoveredClues.length, 1);
  assert.equal(discoverJson.playerProgress.score, 5, '1 clue discovered should yield 5 points');

  // Step C: Request a hint
  const hintRes = await fetch(`${baseUrl}/api/cases/${caseId}/hints`, {
    method: 'POST'
  });
  const hintJson = await hintRes.json();
  assert.equal(hintRes.status, 200);
  assert.ok(hintJson.hint.text, 'Revealed hint must have text');
  assert.equal(hintJson.playerProgress.hintsUsed, 1);
  // Score: 1 clue (+5) - 1 hint (-10) = -5, bounded to min 0
  assert.equal(hintJson.playerProgress.score, 0, 'Score bounded to minimum 0');

  // Step D: Submit Accusation
  const accuseRes = await fetch(`${baseUrl}/api/cases/${caseId}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      suspectId,
      rationale: 'The poison traces matched their laboratory manifest and they lacked an alibi.'
    })
  });
  const accuseJson = await accuseRes.json();
  assert.equal(accuseRes.status, 200);
  assert.equal(accuseJson.success, true);
  assert.ok(accuseJson.verdict);
  assert.ok(accuseJson.verdict.explanation);
  assert.ok(accuseJson.verdict.rank);

  // Step E: Fetch Result
  const resultRes = await fetch(`${baseUrl}/api/cases/${caseId}/result`);
  const resultJson = await resultRes.json();
  assert.equal(resultRes.status, 200);
  assert.equal(resultJson.data.playerProgress.status, 'completed');
  assert.ok(resultJson.data.solution.explanation);
});
