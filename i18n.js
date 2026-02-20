/**
 * HermiBorð i18n — Tungumálakerfi
 * 
 * Hvernig á að bæta við nýju tungumáli:
 * 1. Afritaðu lang/is.json sem lang/XX.json (t.d. lang/pl.json)
 * 2. Þýddu öll gildi (ekki breyta lyklum!)
 * 3. Uppfærðu _meta hlutann
 * 4. Bættu tungumálinu við LANGUAGES listann hér að neðan
 * 
 * Strengir sem innihalda HTML (t.d. <strong>, <em>, <code>, <br>)
 * eru settir inn með innerHTML. Þýðandi má nota þessi HTML tög.
 */

const LANGUAGES = [
  { code: 'is', label: 'Íslenska', flag: '🇮🇸' },
  { code: 'en', label: 'English',  flag: '🇬🇧' }
  // Bættu við fleiri hér:
  // { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  // { code: 'da', label: 'Dansk',  flag: '🇩🇰' },
];

const DEFAULT_LANG = 'is';

let currentLang = {};
let currentCode = DEFAULT_LANG;

/**
 * Sækir nested gildi úr hlut með punkta-slóð
 * t.d. resolve(obj, "step1.title") => obj.step1.title
 */
function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

/**
 * Hleður tungumálaskrá og beitir á síðuna
 */
async function loadLanguage(code) {
  try {
    const resp = await fetch(`./lang/${code}.json`);
    if (!resp.ok) throw new Error(`Language file not found: ${code}`);
    currentLang = await resp.json();
    currentCode = code;
    applyTranslations();
    document.documentElement.lang = code;
    if (currentLang._meta && currentLang._meta.direction) {
      document.documentElement.dir = currentLang._meta.direction;
    }
    localStorage.setItem('hb-lang', code);
    updateLangSelector();
  } catch (err) {
    console.warn('i18n: Could not load language "' + code + '":', err.message);
    if (code !== DEFAULT_LANG) {
      loadLanguage(DEFAULT_LANG);
    }
  }
}

/**
 * Beitir þýðingum á öll element með data-i18n
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = resolve(currentLang, key);
    if (val === null) return;

    // Ef gildið inniheldur HTML tög, nota innerHTML
    if (/<[a-z][\s\S]*>/i.test(val)) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // Sérstök meðhöndlun: aria-label
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const val = resolve(currentLang, key);
    if (val !== null) el.setAttribute('aria-label', val);
  });

  // Sérstök meðhöndlun: title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = resolve(currentLang, key);
    if (val !== null) el.setAttribute('title', val);
  });

  // Uppfæra step badges (SKREF X AF Y)
  document.querySelectorAll('[data-i18n-step]').forEach(el => {
    const [current, total] = el.getAttribute('data-i18n-step').split('/');
    const template = resolve(currentLang, 'ui.stepOf') || 'STEP {current} OF {total}';
    el.textContent = template.replace('{current}', current).replace('{total}', total);
  });

  // Uppfæra test button labels
  updateAllTestLabels();
}

/**
 * Uppfærir test takka labels eftir stöðu
 */
function updateAllTestLabels() {
  document.querySelectorAll('.test-btn').forEach(btn => {
    const state = btn.getAttribute('data-state') || '';
    const nameKey = btn.getAttribute('data-i18n-test');
    const name = resolve(currentLang, nameKey) || btn.querySelector('.test-name').textContent;

    // Update name
    if (nameKey) btn.querySelector('.test-name').textContent = name;

    // Update status text
    const statusMap = {
      '':     resolve(currentLang, 'ui.notTested') || 'Ekki prófað',
      'pass': resolve(currentLang, 'ui.testPass')  || '✓ Pass',
      'fail': resolve(currentLang, 'ui.testFail')  || '✗ Fail'
    };
    btn.querySelector('.test-status').textContent = statusMap[state];
    btn.setAttribute('aria-label', name + ': ' + statusMap[state]);
  });
}

/**
 * Hringferli test stöðu
 */
function cycleTestI18n(btn) {
  const states = ['', 'pass', 'fail'];
  const icons  = { '': '', 'pass': '✓', 'fail': '✗' };
  const curr = btn.getAttribute('data-state') || '';
  const next = states[(states.indexOf(curr) + 1) % states.length];
  btn.setAttribute('data-state', next);
  btn.querySelector('.test-indicator').textContent = icons[next];
  updateAllTestLabels();
}

/**
 * Uppfærir tungumálaval í toolbar
 */
function updateLangSelector() {
  const sel = document.getElementById('lang-select');
  if (!sel) return;
  sel.value = currentCode;
}

/**
 * Setur upp tungumálaval dropdown
 */
function initLangSelector() {
  const sel = document.getElementById('lang-select');
  if (!sel) return;

  sel.innerHTML = '';
  LANGUAGES.forEach(lang => {
    const opt = document.createElement('option');
    opt.value = lang.code;
    opt.textContent = lang.flag + ' ' + lang.label;
    sel.appendChild(opt);
  });

  sel.value = currentCode;
  sel.addEventListener('change', () => loadLanguage(sel.value));
}

/**
 * Helper: sækir þýðingu fyrir JS notkun
 */
function t(key) {
  return resolve(currentLang, key) || key;
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  initLangSelector();
  const saved = localStorage.getItem('hb-lang') || DEFAULT_LANG;
  loadLanguage(saved);
});
