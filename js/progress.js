/* =============================================
   progress.js — Knox Clinic Digital Resources
   Shared progress bar logic used across ALL
   health modules.

   Depends on: nothing
   Used by: diabetes.js (and future modules)
   ============================================= */


// ── PROGRESS STATE ────────────────────────────────
const progressState = {
  modules:      ['diabetes', 'dental', 'hypertension', 'vaccines'],
  moduleLabels: ['Diabetes', 'Dental Health', 'Hypertension', 'Vaccines'],
  subTabs: {
    diabetes: ['introduction', 'diet', 'medication'],
    // dental:       ['introduction', ...],
    // hypertension: ['introduction', ...],
    // vaccines:     ['introduction', ...],
  },
  completedModules: new Set(),
  currentModule:   'diabetes',
  currentSubTab:   'introduction',
  currentTabIdx:    0,
};


// ── MARKER POSITIONS ──────────────────────────────
// All positions are hardcoded percentages so the fill
// bar and the dots/flags are always in sync.
//
// Layout across 4 modules (each gets 25% of the bar):
//
//  Module 0 (diabetes):     dot1=8%  dot2=16%  flag=25%
//  Module 1 (dental):       dot1=33% dot2=41%  flag=50%
//  Module 2 (hypertension): dot1=58% dot2=66%  flag=75%
//  Module 3 (vaccines):     dot1=83% dot2=91%  flag=100%
//
// Fill stop values (what fillPct is set to):
//   introduction (idx 0) →  0%  (empty)
//   diet         (idx 1) →  8%  (on dot1)
//   medication   (idx 2) → 16%  (on dot2)
//   completed             → 25%  (on flag)
//
// For future modules, extend this table by adding a new
// row following the same pattern (+25% per module).
const MODULE_MARKERS = [
  { dot1: 8,  dot2: 16, flag: 25  },  // diabetes
  { dot1: 33, dot2: 41, flag: 50  },  // dental
  { dot1: 58, dot2: 66, flag: 75  },  // hypertension
  { dot1: 83, dot2: 91, flag: 100 },  // vaccines
];

// Fill % for each tab index within a module.
// Index into this with currentTabIdx (0, 1, or 2).
// Module offset (currentModIdx * 25) is added on top.
const TAB_FILL_OFFSETS = [0, 8, 16]; // intro, diet, medication


// ── RENDER PROGRESS BAR ───────────────────────────
function renderProgressBar() {
  const container = document.querySelector('.progress-bar-container');
  const modules   = progressState.modules;
  const modLabels = progressState.moduleLabels;
  const curMod    = progressState.currentModule;
  const curModIdx = modules.indexOf(curMod);
  const curTabIdx = progressState.currentTabIdx;
  const markers   = [];

  modules.forEach((mod, mi) => {
    const m       = MODULE_MARKERS[mi];
    const modDone = progressState.completedModules.has(mod);
    const isCur   = mod === curMod;

    const dot1Done = modDone || (isCur && curTabIdx >= 1);
    const dot2Done = modDone || (isCur && curTabIdx >= 2);
    const flagDone = modDone;

    markers.push({ type: 'dot',  pct: m.dot1, done: dot1Done, id: `dot-${mod}-0` });
    markers.push({ type: 'dot',  pct: m.dot2, done: dot2Done, id: `dot-${mod}-1` });
    markers.push({ type: 'flag', pct: m.flag, done: flagDone, id: `flag-${mod}`, label: modLabels[mi] });
  });

  // Fill bar: base offset of past completed modules +
  // the offset for the current tab within this module.
  const basePct = progressState.completedModules.has(curMod)
    ? MODULE_MARKERS[curModIdx].flag
    : curModIdx * 25 + TAB_FILL_OFFSETS[Math.min(curTabIdx, TAB_FILL_OFFSETS.length - 1)];
  const fillPct = Math.min(100, basePct);

  const markersHTML = markers.map(m => {
    const left = m.pct >= 100 ? 'calc(100% - 6px)' : `${m.pct}%`;
    if (m.type === 'dot') {
      return `<div class="progress-marker" style="left:${left}" id="${m.id}">
                <span class="p-dot ${m.done ? 'done' : ''}"></span>
              </div>`;
    }
    return `<div class="progress-marker" style="left:${left}" id="${m.id}">
              <span class="p-flag ${m.done ? 'done' : ''}">⚑</span>
            </div>`;
  }).join('');

  container.innerHTML = `
    <div class="progress-bar-wrapper">
      <div class="progress-fill" id="progressFill" style="width:${fillPct}%"></div>
      <div class="progress-markers">${markersHTML}</div>
    </div>`;
}


// ── UPDATE PROGRESS ───────────────────────────────
// Call whenever the user navigates to a sub-tab.
// The bar moves to exactly where the user is,
// including backwards.
function updateProgress(tabName) {
  const subs = progressState.subTabs[progressState.currentModule];
  const idx  = subs.indexOf(tabName);
  progressState.currentSubTab = tabName;
  progressState.currentTabIdx = idx;
  renderProgressBar();
}


// ── COMPLETE MODULE ───────────────────────────────
// Call when the user explicitly completes the module.
// Moves fill to the flag and triggers the star burst.
function completeModule() {
  const mod = progressState.currentModule;
  if (!progressState.completedModules.has(mod)) {
    progressState.completedModules.add(mod);
    renderProgressBar();
    setTimeout(() => triggerStarBurst(`flag-${mod}`), 400);
  }
}


// ── STAR BURST ANIMATION ──────────────────────────
function triggerStarBurst(flagId) {
  const flagEl = document.getElementById(flagId);
  if (!flagEl) return;
  const rect  = flagEl.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className  = 'star-burst';
  burst.style.left = (rect.left + rect.width  / 2) + 'px';
  burst.style.top  = (rect.top  + rect.height / 2) + 'px';
  ['⭐','✨','🌟','💫','⭐','✨','🌟','💫'].forEach((s, i) => {
    const angle = (i / 8) * 2 * Math.PI;
    const dist  = 60 + Math.random() * 40;
    const span  = document.createElement('span');
    span.textContent = s;
    span.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    span.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    span.style.animationDelay = (i * 0.06) + 's';
    burst.appendChild(span);
  });
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 1500);
}