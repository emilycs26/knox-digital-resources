/* =============================================
   progress.js — Knox Clinic Digital Resources
   Shared progress bar logic used across ALL
   health modules. No module-specific content
   belongs here.

   Depends on: nothing (no imports needed)
   Used by: diabetes.js (and future modules)
   ============================================= */


// ── PROGRESS STATE ────────────────────────────────
// Each module page that uses this file should
// update progressState to reflect its own tabs.
const progressState = {
  modules:      ['diabetes', 'dental', 'hypertension', 'vaccines'],
  moduleLabels: ['Diabetes', 'Dental Health', 'Hypertension', 'Vaccines'],

  // subTabs: which sub-tabs each module has
  // Future modules should add their key here.
  subTabs: {
    diabetes: ['introduction', 'diet', 'medication'],
    // dental:      ['introduction', ...],
    // hypertension: ['introduction', ...],
    // vaccines:    ['introduction', ...],
  },

  completedSubs:    { diabetes: new Set() },
  completedModules: new Set(),
  currentModule:    'diabetes',
  currentSubTab:    'introduction',
};


// ── RENDER PROGRESS BAR ───────────────────────────
// Builds and injects the full progress bar HTML
// into .progress-bar-container. Call this any time
// progress state changes.
function renderProgressBar() {
  const container = document.querySelector('.progress-bar-container');
  const subs      = progressState.subTabs[progressState.currentModule];
  const done      = progressState.completedSubs[progressState.currentModule];
  const modules   = progressState.modules;
  const modLabels = progressState.moduleLabels;

  const spacing = 25, dotOffsets = [6, 12, 18], flagOffset = 25;
  const markers = [];

  modules.forEach((mod, mi) => {
    const base       = mi * spacing;
    const modDone    = progressState.completedModules.has(mod);
    const modSubs    = progressState.subTabs[mod] || ['a', 'b', 'c'];
    const modDoneSubs = progressState.completedSubs[mod] || new Set();

    dotOffsets.forEach((off, di) => {
      const pct   = base + off * (spacing / flagOffset);
      const isDone = modDone || modDoneSubs.has(modSubs[di]);
      markers.push({ type: 'dot', pct, done: isDone, id: `dot-${mod}-${di}` });
    });

    markers.push({
      type:  'flag',
      pct:   Math.min(base + spacing, 100),
      done:  modDone,
      id:    `flag-${mod}`,
      label: modLabels[mi],
      mod,
    });
  });

  // Calculate fill width
  let fillPct = progressState.completedModules.size * 25;
  if (!progressState.completedModules.has(progressState.currentModule)) {
    fillPct += (done.size / subs.length) * 25;
  }
  fillPct = Math.min(100, fillPct);

  const markersHTML = markers.map(m =>
    m.type === 'dot'
      ? `<div class="progress-marker" style="left:${m.pct}%" id="${m.id}">
           <span class="p-dot ${m.done ? 'done' : ''}"></span>
         </div>`
      : `<div class="progress-marker" style="left:${m.pct === 100 ? 'calc(100% - 4px)' : m.pct + '%'}" id="${m.id}">
           <span class="p-flag ${m.done ? 'done' : ''}">⚑</span>
         </div>`
  ).join('');

  container.innerHTML = `
    <div class="progress-bar-wrapper">
      <div class="progress-fill" id="progressFill" style="width:${fillPct}%"></div>
      <div class="progress-markers">${markersHTML}</div>
    </div>`;
}


// ── MARK SUB-TAB COMPLETE ─────────────────────────
// Call this when a user reaches or completes a sub-tab.
// Automatically marks the parent module done when all
// sub-tabs are complete and triggers the star burst.
function markSubTabDone(tabName) {
  const mod  = progressState.currentModule;
  const subs = progressState.subTabs[mod];

  progressState.completedSubs[mod].add(tabName);

  const allDone = subs.every(s => progressState.completedSubs[mod].has(s));

  if (allDone && !progressState.completedModules.has(mod)) {
    progressState.completedModules.add(mod);
    renderProgressBar();
    setTimeout(() => triggerStarBurst(`flag-${mod}`), 400);
  } else {
    renderProgressBar();
  }
}


// ── STAR BURST ANIMATION ──────────────────────────
// Fires a celebratory star animation from the flag
// element when a module is fully completed.
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