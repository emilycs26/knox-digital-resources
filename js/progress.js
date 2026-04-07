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
// Layout across 4 modules (each gets 25% of the bar).
// dots: array of dot positions (%) within the full bar.
// flag: position of the completion flag (%).
//
// Diabetes    (2 dots): dot1=8   dot2=16          flag=25
// Dental      (3 dots): dot1=31  dot2=37  dot3=44 flag=50
// Hypertension(2 dots): dot1=58  dot2=66          flag=75
// Vaccines    (2 dots): dot1=83  dot2=91          flag=100
//
// For future modules, add a new entry following the
// same pattern (+25% per module).
const MODULE_MARKERS = [
  { dots: [8, 16],       flag: 25  },  // diabetes
  { dots: [31, 37, 44], flag: 50  },  // dental (3 dots for 4 tabs)
  { dots: [58, 66],      flag: 75  },  // hypertension
  { dots: [83, 91],      flag: 100 },  // vaccines
];

// Fill % for each tab index within a module, keyed by module name.
// Each array: index 0 = entry tab (no fill), remaining = one value per dot.
// Values are offsets within that module's 25% slice of the bar.
const TAB_FILL_OFFSETS = {
  diabetes: [0, 8, 16],               // 2 dots: intro(0), diet(8), medication(16)
  dental:   [0, 6, 12, 19],           // 3 dots: intro, risk-factors, daily-care, warning-signs
  hypertension: [0, 8, 16],           // placeholder — update when module is built
  vaccines:     [0, 8, 16],           // placeholder — update when module is built
};


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
    const flagDone = modDone;

    m.dots.forEach((pct, di) => {
      const done = modDone || (isCur && curTabIdx >= di + 1);
      markers.push({ type: 'dot', pct, done, id: `dot-${mod}-${di}` });
    });
    markers.push({ type: 'flag', pct: m.flag, done: flagDone, id: `flag-${mod}`, label: modLabels[mi] });
  });

  // Fill bar: base offset of past completed modules +
  // the offset for the current tab within this module.
  const offsets    = TAB_FILL_OFFSETS[curMod] || [0, 8, 16];
  const basePct = progressState.completedModules.has(curMod)
    ? MODULE_MARKERS[curModIdx].flag
    : curModIdx * 25 + (offsets[Math.min(curTabIdx, offsets.length - 1)] || 0);
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