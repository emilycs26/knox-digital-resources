/* =============================================
   diabetes.js — Knox Clinic Digital Resources
   ============================================= */

// ── PROGRESS STATE ────────────────────────────────
const progressState = {
  modules: ['diabetes','dental','hypertension','vaccines'],
  moduleLabels: ['Diabetes','Dental Health','Hypertension','Vaccines'],
  subTabs: { diabetes: ['introduction','diet','medication'] },
  completedSubs: { diabetes: new Set() },
  completedModules: new Set(),
  currentModule: 'diabetes',
};

function renderProgressBar() {
  const container = document.querySelector('.progress-bar-container');
  const subs = progressState.subTabs.diabetes;
  const done = progressState.completedSubs.diabetes;

  const modules = progressState.modules;
  const modLabels = progressState.moduleLabels;

  const markers = [];
  const spacing = 25;
  const dotOffsets = [6, 12, 18];
  const flagOffset = 25;

  modules.forEach((mod, mi) => {
    const base = mi * spacing;
    const modDone = progressState.completedModules.has(mod);
    const modSubs = progressState.subTabs[mod] || ['a','b','c'];
    const modDoneSubs = progressState.completedSubs[mod] || new Set();

    dotOffsets.forEach((off, di) => {
      const pct = base + off * (spacing / flagOffset);
      const subName = modSubs[di];
      const isDone = modDone || modDoneSubs.has(subName);
      markers.push({ type: 'dot', pct, done: isDone, id: `dot-${mod}-${di}` });
    });

    const flagPct = base + spacing;
    markers.push({
      type: 'flag', pct: Math.min(flagPct, 100),
      done: modDone, id: `flag-${mod}`, label: modLabels[mi], mod
    });
  });

  let fillPct = progressState.completedModules.size * 25;
  if (!progressState.completedModules.has(progressState.currentModule)) {
    fillPct += (done.size / subs.length) * 25;
  }
  fillPct = Math.min(100, fillPct);

  const markersHTML = markers.map(m => {
    if (m.type === 'dot') {
      return `<div class="progress-marker" style="left:${m.pct}%" id="${m.id}">
        <span class="p-dot ${m.done ? 'done' : ''}"></span>
      </div>`;
    } else {
      return `<div class="progress-marker" style="left:${m.pct === 100 ? 'calc(100% - 4px)' : m.pct + '%'}" id="${m.id}">
        <span class="p-flag ${m.done ? 'done' : ''}">⚑</span>
      </div>`;
    }
  }).join('');

  container.innerHTML = `
    <div class="progress-bar-wrapper">
      <div class="progress-fill" id="progressFill" style="width:${fillPct}%"></div>
      <div class="progress-markers">${markersHTML}</div>
    </div>`;
}

function markSubTabDone(tabName) {
  progressState.completedSubs.diabetes.add(tabName);
  const allDone = progressState.subTabs.diabetes.every(
    s => progressState.completedSubs.diabetes.has(s)
  );
  if (allDone && !progressState.completedModules.has('diabetes')) {
    progressState.completedModules.add('diabetes');
    renderProgressBar();
    setTimeout(() => triggerStarBurst('flag-diabetes'), 400);
  } else {
    renderProgressBar();
  }
}

function triggerStarBurst(flagId) {
  const flagEl = document.getElementById(flagId);
  if (!flagEl) return;
  const rect = flagEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const burst = document.createElement('div');
  burst.className = 'star-burst';
  burst.style.left = cx + 'px';
  burst.style.top  = cy + 'px';

  const stars = ['⭐','✨','🌟','💫','⭐','✨','🌟','💫'];
  stars.forEach((s, i) => {
    const angle = (i / stars.length) * 2 * Math.PI;
    const dist = 60 + Math.random() * 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const span = document.createElement('span');
    span.textContent = s;
    span.style.setProperty('--tx', tx + 'px');
    span.style.setProperty('--ty', ty + 'px');
    span.style.animationDelay = (i * 0.06) + 's';
    burst.appendChild(span);
  });

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 1500);
}

// ── ORGAN DATA ────────────────────────────────────
const organData = {
  eyes:    { emoji: '👁',  label: 'Eyes',         detail: 'High blood sugar can damage the small blood vessels in the retina, leading to diabetic retinopathy and vision loss.' },
  kidneys: { emoji: '🫘', label: 'Kidneys',       detail: 'Diabetes is the leading cause of chronic kidney disease. Damaged kidneys lose their ability to filter waste from the blood.' },
  heart:   { emoji: '❤️', label: 'Heart',         detail: 'People with diabetes are at higher risk for heart disease, heart attacks, and stroke due to damage to blood vessels.' },
  vessels: { emoji: '🩸', label: 'Blood Vessels', detail: 'High glucose damages blood vessel walls, narrowing them and reducing circulation, especially in the legs and feet.' },
  nerves:  { emoji: '⚡', label: 'Nerves',         detail: 'Diabetic neuropathy causes tingling, numbness, and pain, usually starting in the feet and hands.' },
};

// ── TYPE DETAIL DATA ──────────────────────────────
const typeDetails = {
  t1: {
    accentColor: '#e040c0', bgColor: '#fce4f5', borderColor: '#f0a8dc',
    title: 'Type 1 Diabetes',
    keyFacts: [
      'Accounts for approximately 5–10% of all cases',
      'Can develop at any age (commonly appears in children and young adults)',
      'Symptoms typically come on quickly, over days or weeks',
      'It is not caused by diet or lifestyle',
      'There is currently no cure — insulin therapy is required for life',
    ],
    symptoms: ['Extreme thirst','Frequent urination','Unusual fatigue','Unexplained weight loss','Blurred vision'],
    treatment: 'People with Type 1 must take insulin every day, either through multiple daily injections or an insulin pump. With proper management, people with Type 1 can live full, healthy lives.',
    extra: {
      type: 'mythbust',
      title: 'Myth Busting',
      subtitle: 'Click on each card to reveal whether each statement is true or false.',
      myths: [
        { statement: 'Type 1 is caused by eating too much sugar.', verdict: 'FALSE', explanation: 'Type 1 is an autoimmune disease — the immune system attacks insulin-producing cells. It has nothing to do with sugar intake or lifestyle.' },
        { statement: 'Type 1 only affects children.', verdict: 'FALSE', explanation: 'While often diagnosed in youth, Type 1 can develop at any age, including in adults (sometimes called LADA).' },
        { statement: 'People with Type 1 will always need insulin.', verdict: 'TRUE', explanation: 'Because the body cannot produce insulin at all, people with Type 1 must take insulin for life. There is currently no cure.' },
      ]
    }
  },
  t2: {
    accentColor: '#0ab8b8', bgColor: '#c8f5f5', borderColor: '#70d8d8',
    title: 'Type 2 Diabetes',
    keyFacts: [
      'Most common form of diabetes — 90–95% of all cases',
      "The body still produces insulin but cells don't respond to it effectively → insulin resistance",
      "The pancreas tries to compensate by making more insulin, but eventually can't keep up",
      'Type 2 typically develops gradually (over months or years)',
      'Many people have no symptoms at first',
    ],
    symptoms: ['Increased thirst and urination','Fatigue','Slow-healing cuts','Blurred vision','Frequent infections','Tingling or numbness in the hands or feet'],
    treatment: 'Starts with lifestyle changes — a healthy diet and regular physical activity. Some people also need medication. In some cases, insulin is needed as well.',
    extra: {
      type: 'checklist',
      title: 'Risk Factor Checklist',
      subtitle: 'Select any risk factors that apply to you:',
      riskFactors: [
        { label: 'Being overweight or obese', id: 'rf1' },
        { label: 'Sedentary lifestyle (little to no exercise)', id: 'rf2' },
        { label: 'Having pre-diabetes or gestational diabetes', id: 'rf3' },
        { label: 'Family history of Type 2 diabetes', id: 'rf4' },
        { label: 'Age 45 or older', id: 'rf5' },
        { label: 'High blood pressure or high cholesterol', id: 'rf6' },
      ],
      goodNews: '🎉 Good news! Type 2 diabetes can often be <strong>prevented or delayed</strong> with lifestyle changes, especially if caught early.',
    }
  },
  pre: {
    accentColor: '#e09020', bgColor: '#fce8c0', borderColor: '#f0c060',
    title: 'Pre-diabetes',
    intro: "Pre-diabetes means your blood sugar is higher than normal, but not yet high enough to be diagnosed as Type 2 diabetes. Think of it as a yellow light — a warning sign that things are heading in the wrong direction.\n\nPre-diabetes is very common and is usually symptom-free, which means many people don't know they have it.",
    table: {
      headers: ['', 'Normal', 'Prediabetes', 'Diabetes'],
      rows: [
        ['A1C', 'Below 5.7%', '5.7% – 6.4%', '6.5% or above'],
        ['Fasting Blood Sugar', 'Below 100 mg/dL', '100 – 125 mg/dL', '126 mg/dL or above'],
      ]
    },
    whyItMatters: [
      'People with prediabetes have a yearly conversion rate to Type 2 of approximately 5–10%',
      'Prediabetes also increases risk for cardiovascular disease',
      'Lifestyle changes can reduce the risk of progressing to Type 2 by 40–70%',
    ],
    whatYouCanDo: [
      'Eat a balanced diet with more vegetables, whole grains, and lean proteins',
      'Aim for at least 150 minutes of moderate physical activity per week',
      'Lose 5–7% of body weight if overweight',
      'Talk to your doctor about screening — the ADA recommends screening starting at age 35',
    ]
  }
};

// ── HELPERS ───────────────────────────────────────
function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arc(cx, cy, r, a1, a2) {
  const s = polar(cx, cy, r, a1), e = polar(cx, cy, r, a2);
  const large = ((a2 - a1 + 360) % 360) > 180 ? 1 : 0;
  return `M${s.x.toFixed(2)} ${s.y.toFixed(2)} A${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

// ── BUILD TYPE DETAIL PANEL ───────────────────────
function buildTypePanel(key) {
  const d = typeDetails[key];
  const ac = d.accentColor, bg = d.bgColor, bc = d.borderColor;

  if (key === 'pre') {
    const tableRows = d.table.rows.map(row =>
      `<tr>${row.map((c, i) => i === 0 ? `<td style="font-weight:600">${c}</td>` : `<td>${c}</td>`).join('')}</tr>`
    ).join('');
    return `
      <div class="type-panel" style="background:${bg};border-color:${bc}">
        <button class="type-panel-close" style="color:${ac}" data-close="true">✕</button>
        <div class="type-panel-section" style="border-color:${bc}">
          ${d.intro.split('\n\n').map(p => `<p style="margin-bottom:10px;">${p}</p>`).join('')}
        </div>
        <div class="type-panel-section" style="border-color:${bc}">
          <table class="pre-table">
            <thead><tr>${d.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
        <div class="type-panel-section" style="border-color:${bc}">
          <p style="font-weight:600;margin-bottom:6px;">Why It Matters:</p>
          <ul style="padding-left:18px;margin-bottom:14px;">${d.whyItMatters.map(x=>`<li>${x}</li>`).join('')}</ul>
          <p style="font-weight:600;margin-bottom:6px;">What You Can Do:</p>
          <ul style="padding-left:18px;">${d.whatYouCanDo.map(x=>`<li>${x}</li>`).join('')}</ul>
        </div>
      </div>`;
  }

  const keyFactsHTML = d.keyFacts.map(f => `<li>${f}</li>`).join('');
  const sympTreatHTML = d.symptoms ? `
    <div class="type-panel-cols" style="border-color:${bc}">
      <div class="type-panel-col" style="border-color:${bc}">
        <p style="font-weight:600;margin-bottom:8px;">Common Symptoms:</p>
        <ul>${d.symptoms.map(s=>`<li>${s}</li>`).join('')}</ul>
      </div>
      <div class="type-panel-col">
        <p style="font-weight:600;margin-bottom:8px;">Treatment:</p>
        <p>${d.treatment}</p>
      </div>
    </div>` : '';

  let extraHTML = '';
  if (d.extra?.type === 'mythbust') {
    const mythCards = d.extra.myths.map((m, i) => `
      <div class="myth-card" data-myth="${i}" style="background:${ac}">
        <span class="myth-front">${m.statement}</span>
        <div class="myth-back" style="display:none">
          <span class="myth-verdict ${m.verdict==='TRUE'?'verdict-true':'verdict-false'}">${m.verdict}</span>
          <span>${m.explanation}</span>
        </div>
      </div>`).join('');
    extraHTML = `
      <div class="type-panel-section" style="border-color:${bc}">
        <p style="font-weight:700;text-align:center;margin-bottom:4px;">${d.extra.title}</p>
        <p style="font-style:italic;text-align:center;font-size:13px;margin-bottom:12px;">${d.extra.subtitle}</p>
        ${mythCards}
      </div>`;
  }
  if (d.extra?.type === 'checklist') {
    const checks = d.extra.riskFactors.map(r => `
      <div class="risk-check-row">
        <label class="risk-check-label" for="${r.id}">${r.label}</label>
        <input type="checkbox" class="risk-checkbox" id="${r.id}">
      </div>`).join('');
    extraHTML = `
      <div class="type-panel-section" style="border-color:${bc}">
        <div style="background:${ac};color:#fff;border-radius:8px;padding:12px 16px;font-size:14px;text-align:center;margin-bottom:16px;">${d.extra.goodNews}</div>
        <p style="font-weight:700;text-align:center;margin-bottom:4px;">${d.extra.title}</p>
        <p style="text-align:center;font-size:13px;margin-bottom:14px;color:#555;">${d.extra.subtitle}</p>
        <div id="riskCheckList">${checks}</div>
        <div id="riskMessage" style="margin-top:14px;display:none;background:#fff;border-radius:10px;padding:14px 16px;font-size:13px;line-height:1.6;border:1.5px solid ${bc};"></div>
        <div style="display:flex;justify-content:center;margin-top:14px;">
          <button onclick="evaluateRisk('${bc}')" style="background:${ac};color:#fff;border:none;border-radius:8px;padding:9px 24px;font-size:14px;cursor:pointer;font-family:Roboto,sans-serif;">
            See My Results
          </button>
        </div>
        <p style="font-size:11px;font-style:italic;color:#777;margin-top:10px;text-align:center;">This is not a diagnosis — it's a conversation starter with your doctor.</p>
      </div>`;
  }

  return `
    <div class="type-panel" style="background:${bg};border-color:${bc}">
      <button class="type-panel-close" style="color:${ac}" data-close="true">✕</button>
      <div class="type-panel-section" style="border-color:${bc}">
        <p style="font-weight:600;margin-bottom:6px;">Key Facts:</p>
        <ul style="padding-left:18px;">${keyFactsHTML}</ul>
      </div>
      ${sympTreatHTML}
      ${extraHTML}
    </div>`;
}

// ── RISK EVALUATOR ────────────────────────────────
window.evaluateRisk = function(borderColor) {
  const checked = document.querySelectorAll('.risk-checkbox:checked').length;
  const msg = document.getElementById('riskMessage');
  if (!msg) return;
  let text = '';
  if (checked === 0) {
    text = `✅ <strong>Great news!</strong> You didn't select any risk factors. Keep up your healthy habits and talk to your doctor about routine screening starting at age 35.`;
  } else if (checked <= 2) {
    text = `🟡 <strong>Having ${checked} risk factor${checked>1?'s':''}</strong> doesn't mean you'll develop Type 2 diabetes — but it's a good reason to mention it to your doctor. Small lifestyle changes now can make a big difference.`;
  } else if (checked <= 4) {
    text = `🟠 <strong>You selected ${checked} risk factors.</strong> This is worth a conversation with your healthcare provider. They can recommend screening and personalized steps to reduce your risk.`;
  } else {
    text = `🔴 <strong>You selected ${checked} risk factors.</strong> Please consider talking to your doctor soon about diabetes screening. Early detection makes a real difference — and many risk factors can be addressed with support.`;
  }
  msg.innerHTML = text;
  msg.style.display = 'block';
  msg.style.borderColor = borderColor;
};

// ── RENDER INTRODUCTION ───────────────────────────
function renderIntroduction() {
  const organHTML = Object.entries(organData).map(([k, v]) => `
    <div class="organ-item" data-organ="${k}">
      <div class="organ-circle">${v.emoji}</div>
      <div class="organ-name">${v.label}</div>
    </div>`).join('');

  document.getElementById('tab-introduction').innerHTML = `
    <h2 class="section-h2">What is Diabetes?</h2>
    <div class="info-box">
      Diabetes is a condition in which the body's blood sugar (glucose) is too high.
      Glucose comes from the food we eat and is the body's main source of energy.
      Normally, a hormone called insulin (made by the pancreas) helps the glucose move
      from the bloodstream into your cells, where it is used for energy. In diabetes,
      the body either doesn't make enough insulin, or can't use it properly, so glucose
      builds up in the blood instead.
    </div>
    <p class="damage-label">Over time, high blood sugar can damage...</p>
    <p class="click-hint">Click each circle to learn more</p>
    <div class="organ-row">${organHTML}</div>
    <div class="organ-detail-box" id="organDetailBox"></div>
    <div class="callout-green">However, with proper management, diabetes can generally be kept under control and complications minimized.</div>
    <p class="callout-hint">Click each box to learn more</p>

    <div class="type-boxes-area" id="typeBoxesArea">
      <div class="type-boxes-grid" id="typeBoxesGrid">
        <div class="type-box t1" data-type="t1">Diabetes 1</div>
        <div class="type-box t2" data-type="t2">Diabetes 2</div>
      </div>
      <div class="type-boxes-center" id="typeBoxesCenter">
        <div class="type-box pre" data-type="pre">Pre-diabetes</div>
      </div>
      <div id="typePanelContainer"></div>
    </div>

    <div class="next-btn-row">
      <button class="next-btn" id="introNextBtn">Go to Diet &rarr;</button>
    </div>`;

  document.querySelectorAll('.organ-item').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.organ, box = document.getElementById('organDetailBox');
      if (box.dataset.active === k) { box.style.display='none'; box.dataset.active=''; return; }
      box.innerHTML = `<strong>${organData[k].label}:</strong> ${organData[k].detail}`;
      box.style.display = 'block'; box.dataset.active = k;
    });
  });

  let activeType = null;
  function openTypePanel(key) {
    const container = document.getElementById('typePanelContainer');
    const grid = document.getElementById('typeBoxesGrid');
    const center = document.getElementById('typeBoxesCenter');
    if (activeType === key) {
      container.innerHTML = '';
      grid.style.display = ''; center.style.display = '';
      activeType = null; return;
    }
    activeType = key;
    grid.style.display = 'none'; center.style.display = 'none';
    container.innerHTML = buildTypePanel(key);
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    container.querySelector('[data-close]').addEventListener('click', () => {
      container.innerHTML = '';
      grid.style.display = ''; center.style.display = '';
      activeType = null;
    });
    container.querySelectorAll('.myth-card').forEach(card => {
      card.addEventListener('click', () => {
        const front = card.querySelector('.myth-front');
        const back = card.querySelector('.myth-back');
        if (back.style.display === 'none') { front.style.display='none'; back.style.display='flex'; }
        else { front.style.display=''; back.style.display='none'; }
      });
    });
  }

  document.querySelectorAll('.type-box').forEach(el => {
    el.addEventListener('click', () => openTypePanel(el.dataset.type));
  });

  document.getElementById('introNextBtn').addEventListener('click', () => switchTab('diet'));
}

// ── PLATE DATA ────────────────────────────────────
// Each segment has an svgIcon string for the white outline icon.
// TO SWAP IN A NOUN PROJECT ICON: replace the <g class="plate-icon">...</g> contents
// with: <image href="path/to/icon.svg" x="..." y="..." width="60" height="60"
//         style="filter: brightness(0) invert(1); pointer-events:none;" />
const plateSegData = {
  veg: {
    label: 'Nonstarchy Vegetables', pct: '50%',
    bg: '#e8f5e0', border: '#b8dca0', textColor: '#336600',
    cardPos: 'left',
    detail: 'Fill the biggest section with vegetables like broccoli, salad greens, or asparagus. These are low in carbs, so load up!',
    serving: '1 cup raw or ½ cup cooked',
    // White outline veggie icon — centered in left half of plate (cx~75, cy~150)
    // swap this <g> for: <image href="icon.svg" x="47" y="122" width="56" height="56" style="filter:brightness(0) invert(1);pointer-events:none;"/>
    svgIcon: `<g class="plate-icon" style="pointer-events:none" transform="translate(100,183)">
      <circle cx="20" cy="26" r="10" fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="36" cy="26" r="10" fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="28" cy="13" r="10" fill="none" stroke="#fff" stroke-width="2.2"/>
    </g>`
  },
  carb: {
    label: 'Carbs', pct: '25%',
    bg: '#fff3e0', border: '#ffcc80', textColor: '#e65100',
    cardPos: 'right-top',
    detail: 'Starchy vegetables, beans, lentils, whole wheat bread, oats, peas, corn, potatoes, winter squash, chickpeas.',
    serving: '¼ of your plate (~1 cup or 1 slice bread)',
    // White outline bread loaf icon — centered in top-right quarter (cx~210, cy~90)
    // swap this <g> for: <image href="icon.svg" x="183" y="63" width="56" height="56" style="filter:brightness(0) invert(1);pointer-events:none;"/>
    svgIcon: `<g class="plate-icon" style="pointer-events:none" transform="translate(183,63)">
      <path d="M8 26 Q20 10 44 26 Q20 42 8 26Z" fill="none" stroke="#fff" stroke-width="2.2"/>
      <path d="M8 26 L0 16 L4 26 L0 36Z" fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="38" cy="22" r="2.5" fill="#fff"/>
    </g>`
  },
  protein: {
    label: 'Protein', pct: '25%',
    bg: '#fce4e4', border: '#ef9a9a', textColor: '#b71c1c',
    cardPos: 'right-bottom',
    detail: 'Aim for lean options like chicken or turkey (no skin), fish, tofu, or eggs.',
    serving: '3 oz cooked',
    // White outline fish icon — centered in bottom-right quarter (cx~210, cy~210)
    // swap this <g> for: <image href="icon.svg" x="183" y="183" width="56" height="56" style="filter:brightness(0) invert(1);pointer-events:none;"/>
    svgIcon: `<g class="plate-icon" style="pointer-events:none" transform="translate(63,63)">
      <rect x="4" y="16" width="44" height="28" rx="4" fill="none" stroke="#fff" stroke-width="2.2"/>
      <path d="M4 20 Q26 6 48 20" fill="none" stroke="#fff" stroke-width="2.2"/>
      <line x1="14" y1="20" x2="14" y2="44" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,3"/>
      <line x1="26" y1="20" x2="26" y2="44" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,3"/>
      <line x1="38" y1="20" x2="38" y2="44" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,3"/>
    </g>`
  },
};

// ── SIDE ITEM DATA ────────────────────────────────
// TO SWAP IN A NOUN PROJECT ICON: replace the svgIcon string with an <img> tag or inline <svg>
// The icon renders inside a colored circle; use white/light colors for contrast.
const sideItemData = [
  {
    id: 'beverages',
    circleColor: '#4dd0e1',
    hoverColor:  '#00acc1',
    cardBg:      '#e0f7fa',
    cardBorder:  '#80deea',
    cardTextColor: '#006064',
    name: 'Beverages',
    title: 'Beverages',
    body: 'Options include:',
    bullets: ['Water', 'Plain tea', 'Coffee', 'Diet soda', 'Diet tea'],
    serving: null,
    // White outline glass icon — swap this string for a Noun Project <img src="..."> or <svg>
    svgIcon: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none">
      <rect x="12" y="8" width="20" height="26" rx="4" stroke="#fff" stroke-width="2.4"/>
      <line x1="14" y1="18" x2="30" y2="18" stroke="#fff" stroke-width="1.6"/>
      <line x1="12" y1="34" x2="32" y2="34" stroke="#fff" stroke-width="2.2"/>
      <ellipse cx="22" cy="38" rx="6" ry="2" stroke="#fff" stroke-width="1.6"/>
    </svg>`
  },
  {
    id: 'fruit',
    circleColor: '#f06292',
    hoverColor:  '#e91e8c',
    cardBg:      '#fce4ec',
    cardBorder:  '#f48fb1',
    cardTextColor: '#880e4f',
    name: 'Fruit',
    title: 'Fruit',
    body: 'A great source of vitamins, minerals, and fiber. Served on the side to help manage your total carb intake.',
    bullets: null,
    serving: '½ cup fresh',
    // White outline apple icon — swap this string for a Noun Project <img src="..."> or <svg>
    svgIcon: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none">
      <path d="M22 14 Q22 8 28 8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 20 Q10 36 22 36 Q34 36 34 20 Q34 14 28 12 Q22 10 16 12 Q10 14 10 20Z" stroke="#fff" stroke-width="2.4" fill="none"/>
      <path d="M22 20 Q22 28 22 34" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,2"/>
    </svg>`
  },
  {
    id: 'dairy',
    circleColor: '#9575cd',
    hoverColor:  '#7b1fa2',
    cardBg:      '#f3e5f5',
    cardBorder:  '#ce93d8',
    cardTextColor: '#4a148c',
    name: 'Dairy',
    title: 'Dairy',
    body: 'Choose low-fat or fat-free options.',
    bullets: ['Skim milk', '1% milk', 'Plain yogurt', 'Plain Greek yogurt', 'Soy milk'],
    serving: '1 cup',
    // White outline cheese icon — swap this string for a Noun Project <img src="..."> or <svg>
    svgIcon: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none">
      <path d="M6 30 L22 14 L38 30 L38 36 L6 36Z" stroke="#fff" stroke-width="2.4" fill="none"/>
      <circle cx="26" cy="26" r="3" stroke="#fff" stroke-width="1.8"/>
      <circle cx="16" cy="30" r="2" stroke="#fff" stroke-width="1.8"/>
    </svg>`
  },
];

// ── RENDER DIET ───────────────────────────────────
function renderDiet() {
  document.getElementById('tab-diet').innerHTML = `
    <h2 class="section-h3" style="font-size:22px;color:#00AAAC;font-weight:400;margin-bottom:6px;">Build Your plate</h2>
    <p style="font-size:14px;font-weight:700;margin-bottom:4px;">What is the meal plate method?</p>
    <p style="font-size:14px;margin-bottom:6px;">The plate method is a simple way to build a healthy, balanced meal. No counting calories required!</p>
    <p style="font-size:14px;margin-bottom:24px;">Use a 9-inch plate and divide it into 3 sections:</p>

    <p style="font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;">Nutritional Needs</p>
    <p style="font-size:14px;color:#00AAAC;text-align:center;margin-bottom:20px;">&#9904; Hover on the plate sections</p>

    <!-- PLATE + HOVER CARDS LAYOUT -->
    <div class="plate-layout">

      <!-- LEFT card (Veg) -->
      <div class="plate-card-left">
        <div class="plate-info-card" id="plateCardLeft"
          style="background:${plateSegData.veg.bg};border-color:${plateSegData.veg.border};display:none;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-weight:700;font-size:13px;color:${plateSegData.veg.textColor};">Nonstarchy<br>Vegetables</span>
            <span style="font-weight:700;font-size:15px;color:${plateSegData.veg.textColor};">50%</span>
          </div>
          <p style="font-size:12px;line-height:1.6;color:#414042;">${plateSegData.veg.detail}</p>
          <p style="font-size:11px;color:#777;margin-top:6px;">*Serving Size: ${plateSegData.veg.serving}</p>
        </div>
      </div>

      <!-- CENTER plate SVG -->
      <div class="plate-center">${buildPlateSVG()}</div>

      <!-- RIGHT column: Carb (top) + Protein (bottom) -->
      <div style="display:flex;flex-direction:column;gap:16px;justify-content:center;">
        <div class="plate-info-card" id="plateCardCarb"
          style="background:${plateSegData.carb.bg};border-color:${plateSegData.carb.border};display:none;max-width:220px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-weight:700;font-size:13px;color:${plateSegData.carb.textColor};">Carbs</span>
            <span style="font-weight:700;font-size:15px;color:${plateSegData.carb.textColor};">25%</span>
          </div>
          <p style="font-size:12px;line-height:1.6;color:#414042;">${plateSegData.carb.detail}</p>
          <p style="font-size:11px;color:#777;margin-top:6px;">*Serving Size: ${plateSegData.carb.serving}</p>
        </div>
        <div class="plate-info-card" id="plateCardProtein"
          style="background:${plateSegData.protein.bg};border-color:${plateSegData.protein.border};display:none;max-width:220px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-weight:700;font-size:13px;color:${plateSegData.protein.textColor};">Protein</span>
            <span style="font-weight:700;font-size:15px;color:${plateSegData.protein.textColor};">25%</span>
          </div>
          <p style="font-size:12px;line-height:1.6;color:#414042;">${plateSegData.protein.detail}</p>
          <p style="font-size:11px;color:#777;margin-top:6px;">*Serving Size: ${plateSegData.protein.serving}</p>
        </div>
      </div>

    </div>

    <!-- ON THE SIDE -->
    <p style="font-size:16px;font-weight:700;margin-bottom:4px;">On the Side</p>
    <p style="font-size:13px;color:#00AAAC;margin-bottom:20px;">&#9904; Hover on the icons</p>
    <div class="side-icons-row">${buildSideItems()}</div>

    <!-- GOOD FATS -->
    <div class="diet-list-section" style="margin-top:24px;">
      <h3 class="section-h3">Good Fats</h3>
      <p style="font-size:14px;margin-bottom:8px;">Healthy fats can be used for cooking or as toppings. Choose monounsaturated and polyunsaturated fats and eat them in moderation.</p>
      <ul><li>Canola, olive, sunflower, and peanut oils</li><li>Avocado</li><li>Nuts (e.g., walnuts)</li><li>Seeds (e.g., chia seed, flaxseed)</li></ul>
    </div>
    <div class="diet-list-section" style="margin-top:18px;">
      <h3 class="section-h3">Foods to limit or avoid:</h3>
      <ul><li>Refined carbs</li><li>High-fat dairy and animal products</li><li>Deep-fried foods</li><li>Processed foods</li><li>Alcoholic beverages</li></ul>
    </div>

    <!-- QUIZ -->
    <div class="quiz-box">
      <h3>Checkpoint: Test your Knowledge</h3>
      <p class="quiz-question">Q: Which of the following is the best beverage choice for someone managing diabetes?</p>
      <ul class="quiz-options">
        <li><label><input type="radio" name="q1" value="A"> A) Orange juice</label></li>
        <li><label><input type="radio" name="q1" value="B"> B) Regular soda</label></li>
        <li><label><input type="radio" name="q1" value="C"> C) Water</label></li>
        <li><label><input type="radio" name="q1" value="D"> D) Sweetened iced tea</label></li>
      </ul>
      <button class="quiz-btn" id="quizSubmit">Check Answer</button>
      <div class="quiz-answer" id="quizAnswer">
        <strong>Correct Answer: C</strong><br>
        Water is the top recommended beverage. Sugary drinks like regular soda and juice can cause rapid spikes in blood sugar. The ADA recommends prioritizing water over sweetened beverages.
      </div>
    </div>
    <div class="next-btn-row">
      <button class="next-btn" id="dietNextBtn">Go to Medication &nbsp;›</button>
    </div>`;

  // ── Plate hover: each segment shows exactly one card ──
  const segCardMap = {
    veg:     'plateCardLeft',
    carb:    'plateCardCarb',
    protein: 'plateCardProtein',
  };
  const allCardIds = Object.values(segCardMap);

  document.querySelectorAll('.plate-seg').forEach(el => {
    el.addEventListener('mouseenter', () => {
      allCardIds.forEach(id => { document.getElementById(id).style.display = 'none'; });
      const target = document.getElementById(segCardMap[el.dataset.seg]);
      if (target) target.style.display = 'block';
    });
    el.addEventListener('mouseleave', () => {
      allCardIds.forEach(id => { document.getElementById(id).style.display = 'none'; });
    });
  });

  // ── Side item hover ──
  document.querySelectorAll('.side-item-wrap').forEach(wrap => {
    const circle = wrap.querySelector('.side-circle-btn');
    const card   = wrap.querySelector('.side-hover-card');
    const hoverColor  = circle.dataset.hoverColor;
    const normalColor = circle.dataset.normalColor;
    wrap.addEventListener('mouseenter', () => {
      circle.style.background = hoverColor;
      card.style.display = 'block';
    });
    wrap.addEventListener('mouseleave', () => {
      circle.style.background = normalColor;
      card.style.display = 'none';
    });
  });

  document.getElementById('quizSubmit').addEventListener('click', () => {
    const sel = document.querySelector('input[name="q1"]:checked');
    const ans = document.getElementById('quizAnswer');
    const btn = document.getElementById('quizSubmit');
    if (!sel) { alert('Please select an answer first!'); return; }

    if (sel.value === 'C') {
      ans.className = 'quiz-answer show correct';
      ans.innerHTML = `<strong>Correct Answer: C</strong><br>
        Water is the top recommended beverage. Sugary drinks like regular soda and juice can cause rapid spikes in blood sugar. The ADA recommends prioritizing water over sweetened beverages.`;
      btn.style.display = 'none';
    } else {
      ans.className = 'quiz-answer show wrong';
      ans.innerHTML = `<strong>Not quite!</strong> That's not the best choice for managing blood sugar. 
        <button id="tryAgainBtn" style="display:inline-block;margin-top:10px;background:#00AAAC;color:#fff;border:none;
          border-radius:8px;padding:7px 20px;font-size:13px;cursor:pointer;font-family:Roboto,sans-serif;">
          Try Again
        </button>`;
      document.getElementById('tryAgainBtn').addEventListener('click', () => {
        document.querySelectorAll('input[name="q1"]').forEach(r => r.checked = false);
        ans.className = 'quiz-answer';
        ans.innerHTML = '';
        btn.style.display = '';
      });
    }
  });

  document.getElementById('dietNextBtn').addEventListener('click', () => switchTab('medication'));
}

// ── BUILD SIDE ITEMS HTML ─────────────────────────
function buildSideItems() {
  return sideItemData.map(s => {
    const bulletsHTML = s.bullets
      ? `<ul style="padding-left:16px;margin-top:4px;">${s.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`
      : '';
    const servingHTML = s.serving
      ? `<p style="margin-top:6px;font-size:11px;color:#777;">*Serving size: ${s.serving}</p>`
      : '';
    const bodyHTML = s.body
      ? `<p style="font-size:12px;line-height:1.6;margin-top:2px;">${s.body}</p>`
      : '';

    return `
      <div class="side-item-wrap">
        <!-- Circle button — swap svgIcon contents for a Noun Project <img> or inline SVG -->
        <button class="side-circle-btn"
          data-normal-color="${s.circleColor}"
          data-hover-color="${s.hoverColor}"
          style="background:${s.circleColor};">
          ${s.svgIcon}
        </button>
        <div class="side-item-name">${s.name}</div>
        <!-- Info card shown on hover -->
        <div class="side-hover-card"
          style="background:${s.cardBg};border-color:${s.cardBorder};color:${s.cardTextColor};display:none;">
          <p style="font-weight:700;font-size:13px;margin-bottom:4px;">${s.title}</p>
          ${bodyHTML}
          ${bulletsHTML}
          ${servingHTML}
        </div>
      </div>`;
  }).join('');
}

// ── BUILD PLATE SVG ───────────────────────────────
// Segments: veg = left half (270→90), carb = top-right (90→180, ORANGE), protein = bottom-right (180→270, RED)
// TO SWAP ICONS: replace each <g class="plate-icon"> block with
//   <image href="path/to/icon.svg" x="..." y="..." width="56" height="56"
//     style="filter:brightness(0) invert(1);pointer-events:none;" />
function buildPlateSVG() {
  const cx=150, cy=150, r=128;
  const segs = [
    { id:'veg',     color:'#7cb342', hov:'#558b2f', a1:90,  a2:270, icon: plateSegData.veg.svgIcon },
    { id:'carb',    color:'#ffa726', hov:'#e65100', a1:270, a2:360, icon: plateSegData.carb.svgIcon },
    { id:'protein', color:'#ef5350', hov:'#b71c1c', a1:0,   a2:90,  icon: plateSegData.protein.svgIcon },
  ];
  const paths = segs.map(s => `
    <path class="plate-seg" data-seg="${s.id}"
      d="${arc(cx,cy,r,s.a1,s.a2)} L${cx} ${cy}Z"
      fill="${s.color}" stroke="#fff" stroke-width="5"
      style="cursor:pointer;transition:fill 0.18s;"
      onmouseenter="this.setAttribute('fill','${s.hov}')"
      onmouseleave="this.setAttribute('fill','${s.color}')"/>
    ${s.icon}`).join('');

  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="width:260px;height:260px;">
    <circle cx="${cx}" cy="${cy}" r="${r+12}" fill="#e0e0e0"/>
    <circle cx="${cx}" cy="${cy}" r="${r+7}"  fill="#f5f5f5"/>
    ${paths}
    <circle cx="${cx}" cy="${cy}" r="24" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/>
  </svg>`;
}

// ── RENDER MEDICATION ─────────────────────────────
const msData = {
  monitoring: {
    title: '1. Monitoring',
    content: `<p>Keeping track of your blood sugar is one of the most important tools you have.</p>
      <p style="margin-top:10px;font-weight:600;">How to Use a Blood Glucose Meter:</p>
      <ol><li>Wash your hands thoroughly before testing.</li><li>Insert a test strip into your meter.</li><li>Use your lancing device on the side of your fingertip to get a small drop of blood.</li><li>Touch the test strip to the drop of blood and wait for the result.</li><li>Your blood glucose level will appear on the meter's display.</li></ol>
      <div class="sub-card"><h4>Continuous Glucose Monitoring (CGM)</h4><p>A CGM is a small wearable device that tracks your blood sugar throughout the day — no finger stick required for routine checks!</p><ul style="margin-top:8px;padding-left:18px;"><li><strong>Prescription CGMs</strong> — for people on insulin or those needing close daily monitoring</li><li><strong>OTC CGMs</strong> — available without a prescription for Type 2 or pre-diabetes</li></ul></div>
      <p style="margin-top:16px;font-weight:600;">FingerStick vs CGM:</p>
      <div class="monitor-toggle"><button class="monitor-btn active" data-monitor="fs">FingerStick</button><button class="monitor-btn" data-monitor="cgm">CGM</button></div>
      <div class="monitor-panel open" id="panel-fs">
        <div class="monitor-card"><h4>How it works</h4><ul><li>Prick your finger</li><li>Place a drop of blood on a test strip</li><li>Get a reading in seconds</li></ul></div>
        <div class="monitor-card"><h4>What it measures</h4><ul><li>Blood glucose at a single moment in time</li></ul></div>
        <div class="monitor-card"><h4>Best for</h4><ul><li>Occasional checks</li><li>Simple, low-tech monitoring</li></ul></div>
      </div>
      <div class="monitor-panel" id="panel-cgm">
        <div class="monitor-card"><h4>How it works</h4><ul><li>Small sensor placed under the skin</li><li>Tracks glucose automatically all day</li><li>Sends data to your phone</li></ul></div>
        <div class="monitor-card"><h4>What it measures</h4><ul><li>Real-time glucose levels</li><li>Trends and patterns over time</li></ul></div>
        <div class="monitor-card"><h4>Best for</h4><ul><li>Continuous monitoring</li></ul></div>
      </div>`
  },
  medicine: { title: '2. Medicine', content: `<p>Many people with diabetes take medication to help manage blood sugar.</p><ul style="margin-top:10px;"><li><strong>Insulin:</strong> Required for Type 1; sometimes used in Type 2</li><li><strong>Metformin:</strong> Often the first medication prescribed for Type 2</li><li><strong>GLP-1 receptor agonists:</strong> Help lower blood sugar and may support weight loss</li><li><strong>SGLT-2 inhibitors:</strong> Help kidneys remove excess glucose through urine</li></ul>` },
  movement: { title: '3. Movement', content: `<p>Physical activity helps your body use insulin more effectively. The ADA recommends at least 150 minutes of moderate-intensity activity per week.</p><ul style="margin-top:10px;"><li><strong>Aerobic activity:</strong> Walking, swimming, cycling, dancing</li><li><strong>Strength training:</strong> 2–3 times per week</li><li><strong>Flexibility:</strong> Stretching and yoga reduce stress and improve circulation</li></ul>` },
  meal: { title: '4. Meal Planning', content: `<p>What you eat directly affects your blood sugar.</p><ul style="margin-top:10px;"><li>Use the <strong>Plate Method</strong></li><li>Choose high-fiber foods to slow glucose absorption</li><li>Limit sugary drinks, refined carbs, and processed foods</li><li>Eat at consistent times each day</li></ul>` }
};

function renderMedication() {
  const sections = Object.entries(msData).map(([k,v]) =>
    `<div class="ms-section" id="ms-${k}"><h3>${v.title}</h3>${v.content}</div>`).join('');

  document.getElementById('tab-medication').innerHTML = `
    <p style="font-size:14px;color:#888;margin-bottom:6px;">How to Manage Your Diabetes: <strong style="color:#b07010;">The Four M's</strong></p>
    <div class="four-ms-intro">Managing diabetes is about balance. <strong>The four M's: Monitoring, Medicine, Movement, and Meal Planning</strong> work together to keep blood sugar in a healthy range.</div>
    <p class="four-ms-hint">Click on the sections of the circle below to learn more</p>
    <div class="pie-svg-wrapper">${buildMsPieSVG()}</div>
    ${sections}
    <div class="next-btn-row"><button class="next-btn" id="medNextBtn">Complete Diabetes Module ✓</button></div>`;

  document.getElementById('ms-monitoring').classList.add('open');

  document.querySelectorAll('.ms-slice').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.ms;
      document.querySelectorAll('.ms-section').forEach(s => s.classList.remove('open'));
      const target = document.getElementById(`ms-${k}`);
      target.classList.add('open');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  document.getElementById('tab-medication').addEventListener('click', e => {
    if (e.target.classList.contains('monitor-btn')) {
      const mode = e.target.dataset.monitor;
      document.querySelectorAll('.monitor-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      document.querySelectorAll('.monitor-panel').forEach(p => p.classList.remove('open'));
      document.getElementById(`panel-${mode}`).classList.add('open');
    }
  });

  document.getElementById('medNextBtn').addEventListener('click', () => {
    markSubTabDone('medication');
  });
}

// ── BUILD MEDICATION PIE SVG ──────────────────────
function buildMsPieSVG() {
  const cx=140,cy=140,r=112;
  const slices=[
    {id:'monitoring',color:'#f5c842',hov:'#d0a010',a1:270,a2:360,lx:178,ly:95},
    {id:'medicine',  color:'#6cc644',hov:'#4ea020',a1:0,  a2:90, lx:178,ly:186},
    {id:'movement',  color:'#2eb87a',hov:'#1a8058',a1:90, a2:180,lx:102,ly:186},
    {id:'meal',      color:'#c8a0e0',hov:'#a070c0',a1:180,a2:270,lx:102,ly:95},
  ];
  const paths=slices.map(s=>`
    <path class="ms-slice" data-ms="${s.id}" d="${arc(cx,cy,r,s.a1,s.a2)} L${cx} ${cy}Z"
      fill="${s.color}" stroke="#fff" stroke-width="4" style="cursor:pointer"
      onmouseenter="this.setAttribute('fill','${s.hov}')"
      onmouseleave="this.setAttribute('fill','${s.color}')"/>
    <text x="${s.lx}" y="${s.ly}" text-anchor="middle" dominant-baseline="middle"
      font-size="30" font-weight="700" fill="#fff" style="pointer-events:none">M</text>`).join('');
  return `<svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
    ${paths}<circle cx="${cx}" cy="${cy}" r="22" fill="#fff"/>
  </svg>`;
}

// ── TAB SWITCHING ─────────────────────────────────
const tabRenderers = { introduction:renderIntroduction, diet:renderDiet, medication:renderMedication };
const rendered = {};
let progressState_currentSubTab = 'introduction';

function switchTab(name) {
  progressState.currentSubTab = name;
  progressState_currentSubTab = name;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab===name));
  document.querySelectorAll('.tab-content').forEach(p => p.classList.toggle('hidden', p.id!==`tab-${name}`));
  if (!rendered[name]) { tabRenderers[name](); rendered[name]=true; }
  markSubTabDone(name);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Initial render
progressState.currentSubTab = 'introduction';
renderProgressBar();
switchTab('introduction');