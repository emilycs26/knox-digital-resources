/* =============================================
   dental.js — Knox Clinic Digital Resources
   All content and logic for the Dental Health module.

   Depends on: progress.js (must load first)
     - progressState, renderProgressBar,
       updateProgress, completeModule, triggerStarBurst
   ============================================= */


// ── MODULE SETUP ──────────────────────────────────
// Register this module's sub-tabs with the shared
// progress state so the progress bar knows the layout.
progressState.currentModule = 'dental';
progressState.currentTabIdx = 0;
progressState.subTabs.dental = ['introduction', 'risk-factors', 'daily-care', 'warning-signs'];
progressState.completedSubs  = progressState.completedSubs || {};
progressState.completedSubs.dental = new Set();


// ── COMING SOON HELPER ────────────────────────────
// Returns a placeholder block for tabs not yet written.
// Replace the call to comingSoon() with real content
// when the tab is ready.
function comingSoon(tabLabel) {
  return `
    <div class="coming-soon-box">
      <div class="coming-soon-icon">🦷</div>
      <div class="coming-soon-title">${tabLabel}</div>
      <div class="coming-soon-sub">Content coming soon — check back later!</div>
    </div>`;
}


// ═══════════════════════════════════════════════════
// TAB RENDER FUNCTIONS
// Replace comingSoon() with real content as each
// section is researched and written.
// ═══════════════════════════════════════════════════

function renderIntroduction() {
  document.getElementById('tab-introduction').innerHTML = `
    ${comingSoon('Introduction')}
    <div class="next-btn-row">
      <button class="next-btn" id="introNextBtn">Go to Risk Factors &rarr;</button>
    </div>`;
  document.getElementById('introNextBtn').addEventListener('click', () => switchTab('risk-factors'));
}

function renderRiskFactors() {
  document.getElementById('tab-risk-factors').innerHTML = `
    ${comingSoon('Risk Factors')}
    <div class="next-btn-row">
      <button class="next-btn" id="riskNextBtn">Go to Daily Care &rarr;</button>
    </div>`;
  document.getElementById('riskNextBtn').addEventListener('click', () => switchTab('daily-care'));
}

function renderDailyCare() {
  document.getElementById('tab-daily-care').innerHTML = `
    ${comingSoon('Daily Care')}
    <div class="next-btn-row">
      <button class="next-btn" id="dailyNextBtn">Go to Warning Signs &rarr;</button>
    </div>`;
  document.getElementById('dailyNextBtn').addEventListener('click', () => switchTab('warning-signs'));
}

function renderWarningSigns() {
  document.getElementById('tab-warning-signs').innerHTML = `
    ${comingSoon('Warning Signs')}
    <div class="next-btn-row">
      <button class="next-btn" id="warningNextBtn">Next Module: Hypertension &rarr;</button>
    </div>`;
  document.getElementById('warningNextBtn').addEventListener('click', () => completeModule());
}


// ═══════════════════════════════════════════════════
// TAB SWITCHING
// ═══════════════════════════════════════════════════

const tabRenderers = {
  'introduction':  renderIntroduction,
  'risk-factors':  renderRiskFactors,
  'daily-care':    renderDailyCare,
  'warning-signs': renderWarningSigns,
};
const rendered = {};

function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(p => p.classList.toggle('hidden', p.id !== `tab-${name}`));
  if (!rendered[name]) { tabRenderers[name](); rendered[name] = true; }
  updateProgress(name);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));


// ── INIT ──────────────────────────────────────────
renderProgressBar();
switchTab('introduction');