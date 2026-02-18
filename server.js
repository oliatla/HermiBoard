/**
 * HermiBorð — VMA Rafdeild
 * Express server með framgangsvistunar API
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'progress-data.json');

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Hjálparföll ──────────────────────────────────────────────
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Villa við að lesa gögn:', err.message);
  }
  return {};
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Villa við að vista gögn:', err.message);
  }
}

// ─── Validate userId (UUID format only) ───────────────────────
function isValidId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

// ─── API Routes ───────────────────────────────────────────────

// Sækja framgang nemanda
app.get('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  if (!isValidId(userId)) return res.status(400).json({ error: 'Ógilt notandaauðkenni' });

  const data = loadData();
  const userProgress = data[userId] || {
    currentStep: 0,
    completedSteps: [],
    checks: {},
    testResults: {},
    lodaState: {},
    compChecks: {}
  };
  res.json(userProgress);
});

// Vista framgang nemanda
app.post('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  if (!isValidId(userId)) return res.status(400).json({ error: 'Ógilt notandaauðkenni' });

  const data = loadData();
  data[userId] = {
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  saveData(data);
  res.json({ ok: true, saved: new Date().toISOString() });
});

// Hreinsa framgang (ef nemandi vill byrja aftur)
app.delete('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  if (!isValidId(userId)) return res.status(400).json({ error: 'Ógilt notandaauðkenni' });

  const data = loadData();
  delete data[userId];
  saveData(data);
  res.json({ ok: true });
});

// Health check fyrir Render
app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🔌 HermiBorð keyrir á http://localhost:${PORT}`);
  console.log(`📁 Gögn vistuð í: ${DATA_FILE}`);
});
