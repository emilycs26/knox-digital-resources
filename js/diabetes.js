/* =============================================
   diabetes.js — Knox Clinic Digital Resources
   All content and logic for the Diabetes module.

   Depends on: progress.js (must load first)
     - progressState, renderProgressBar,
       markSubTabDone, triggerStarBurst
   ============================================= */


// ── ORGAN DATA ────────────────────────────────────
// Used by renderIntroduction() to build the clickable
// organ icon row and detail box.
const organData = {
  eyes:    { emoji: '👁',  label: 'Eyes',         detail: 'High blood sugar can damage the small blood vessels in the retina, leading to diabetic retinopathy and vision loss.' },
  kidneys: { emoji: '🫘', label: 'Kidneys',       detail: 'Diabetes is the leading cause of chronic kidney disease. Damaged kidneys lose their ability to filter waste from the blood.' },
  heart:   { emoji: '❤️', label: 'Heart',         detail: 'People with diabetes are at higher risk for heart disease, heart attacks, and stroke due to damage to blood vessels.' },
  vessels: { emoji: '🩸', label: 'Blood Vessels', detail: 'High glucose damages blood vessel walls, narrowing them and reducing circulation, especially in the legs and feet.' },
  nerves:  { emoji: '⚡', label: 'Nerves',         detail: 'Diabetic neuropathy causes tingling, numbness, and pain, usually starting in the feet and hands.' },
};


// ── TYPE DETAIL DATA ──────────────────────────────
// Used by buildTypePanel() to render the Type 1,
// Type 2, and Pre-diabetes detail panels.
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
    symptoms:  ['Extreme thirst', 'Frequent urination', 'Unusual fatigue', 'Unexplained weight loss', 'Blurred vision'],
    treatment: 'People with Type 1 must take insulin every day, either through multiple daily injections or an insulin pump. With proper management, people with Type 1 can live full, healthy lives.',
    extra: {
      type: 'mythbust',
      title: 'Myth Busting',
      subtitle: 'Click on each card to reveal whether each statement is true or false.',
      myths: [
        { statement: 'Type 1 is caused by eating too much sugar.', verdict: 'FALSE', explanation: 'Type 1 is an autoimmune disease — the immune system attacks insulin-producing cells. It has nothing to do with sugar intake or lifestyle.' },
        { statement: 'Type 1 only affects children.',              verdict: 'FALSE', explanation: 'While often diagnosed in youth, Type 1 can develop at any age, including in adults (sometimes called LADA).' },
        { statement: 'People with Type 1 will always need insulin.', verdict: 'TRUE', explanation: 'Because the body cannot produce insulin at all, people with Type 1 must take insulin for life. There is currently no cure.' },
      ],
    },
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
    symptoms:  ['Increased thirst and urination', 'Fatigue', 'Slow-healing cuts', 'Blurred vision', 'Frequent infections', 'Tingling or numbness in the hands or feet'],
    treatment: 'Starts with lifestyle changes — a healthy diet and regular physical activity. Some people also need medication. In some cases, insulin is needed as well.',
    extra: {
      type: 'checklist',
      title: 'Risk Factor Checklist',
      subtitle: 'Select any risk factors that apply to you:',
      riskFactors: [
        { label: 'Being overweight or obese',                         id: 'rf1' },
        { label: 'Sedentary lifestyle (little to no exercise)',        id: 'rf2' },
        { label: 'Having pre-diabetes or gestational diabetes',        id: 'rf3' },
        { label: 'Family history of Type 2 diabetes',                 id: 'rf4' },
        { label: 'Age 45 or older',                                   id: 'rf5' },
        { label: 'High blood pressure or high cholesterol',           id: 'rf6' },
      ],
      goodNews: '🎉 Good news! Type 2 diabetes can often be <strong>prevented or delayed</strong> with lifestyle changes, especially if caught early.',
    },
  },
  pre: {
    accentColor: '#e09020', bgColor: '#fce8c0', borderColor: '#f0c060',
    title: 'Pre-diabetes',
    intro: "Pre-diabetes means your blood sugar is higher than normal, but not yet high enough to be diagnosed as Type 2 diabetes. Think of it as a yellow light — a warning sign that things are heading in the wrong direction.\n\nPre-diabetes is very common and is usually symptom-free, which means many people don't know they have it.",
    table: {
      headers: ['', 'Normal', 'Prediabetes', 'Diabetes'],
      rows: [
        ['A1C',                'Below 5.7%',       '5.7% – 6.4%',       '6.5% or above'],
        ['Fasting Blood Sugar', 'Below 100 mg/dL', '100 – 125 mg/dL',   '126 mg/dL or above'],
      ],
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
    ],
  },
};


// ── PLATE SEGMENT DATA ────────────────────────────
// Used by buildPlateSVG() and renderDiet().
// TO SWAP AN ICON: replace the svgIcon <g> block with:
//   <image href="assets/icons/your-icon.svg" x="..." y="..." width="56" height="56"
//     style="filter:brightness(0) invert(1);pointer-events:none;" />
const plateSegData = {
  veg: {
    label: 'Nonstarchy Vegetables', pct: '50%',
    bg: '#e8f5e0', border: '#b8dca0', textColor: '#336600',
    detail:  'Fill the biggest section with vegetables like broccoli, salad greens, or asparagus. These are low in carbs, so load up!',
    serving: '1 cup raw or ½ cup cooked',
    svgIcon: `<g class="plate-icon" style="pointer-events:none" transform="translate(100,183)">
      <circle cx="20" cy="26" r="10" fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="36" cy="26" r="10" fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="28" cy="13" r="10" fill="none" stroke="#fff" stroke-width="2.2"/>
    </g>`,
  },
  carb: {
    label: 'Carbs', pct: '25%',
    bg: '#fff3e0', border: '#ffcc80', textColor: '#e65100',
    detail:  'Starchy vegetables, beans, lentils, whole wheat bread, oats, peas, corn, potatoes, winter squash, chickpeas.',
    serving: '¼ of your plate (~1 cup or 1 slice bread)',
    svgIcon: `<g class="plate-icon" style="pointer-events:none" transform="translate(63,63)">
      <rect x="4" y="16" width="44" height="28" rx="4" fill="none" stroke="#fff" stroke-width="2.2"/>
      <path d="M4 20 Q26 6 48 20" fill="none" stroke="#fff" stroke-width="2.2"/>
      <line x1="14" y1="20" x2="14" y2="44" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,3"/>
      <line x1="26" y1="20" x2="26" y2="44" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,3"/>
      <line x1="38" y1="20" x2="38" y2="44" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,3"/>
    </g>`,
  },
  protein: {
    label: 'Protein', pct: '25%',
    bg: '#fce4e4', border: '#ef9a9a', textColor: '#b71c1c',
    detail:  'Aim for lean options like chicken or turkey (no skin), fish, tofu, or eggs.',
    serving: '3 oz cooked',
    svgIcon: `<g class="plate-icon" style="pointer-events:none" transform="translate(183,63)">
      <path d="M8 26 Q20 10 44 26 Q20 42 8 26Z" fill="none" stroke="#fff" stroke-width="2.2"/>
      <path d="M8 26 L0 16 L4 26 L0 36Z"        fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="38" cy="22" r="2.5" fill="#fff"/>
    </g>`,
  },
};


// ── SIDE ITEM DATA ────────────────────────────────
// Used by buildSideItems() and renderDiet().
// TO SWAP AN ICON: replace svgIcon with:
//   <img src="assets/icons/your-icon.svg" width="44" height="44"
//     style="filter:brightness(0) invert(1)">
const sideItemData = [
  {
    id: 'beverages', name: 'Beverages', title: 'Beverages',
    circleColor: '#4dd0e1', hoverColor: '#00acc1',
    cardBg: '#e0f7fa', cardBorder: '#80deea', cardTextColor: '#006064',
    body: 'Options include:', bullets: ['Water', 'Plain tea', 'Coffee', 'Diet soda', 'Diet tea'], serving: null,
    svgIcon: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none">
      <rect x="12" y="8" width="20" height="26" rx="4" stroke="#fff" stroke-width="2.4"/>
      <line x1="14" y1="18" x2="30" y2="18" stroke="#fff" stroke-width="1.6"/>
      <line x1="12" y1="34" x2="32" y2="34" stroke="#fff" stroke-width="2.2"/>
      <ellipse cx="22" cy="38" rx="6" ry="2" stroke="#fff" stroke-width="1.6"/></svg>`,
  },
  {
    id: 'fruit', name: 'Fruit', title: 'Fruit',
    circleColor: '#f06292', hoverColor: '#e91e8c',
    cardBg: '#fce4ec', cardBorder: '#f48fb1', cardTextColor: '#880e4f',
    body: 'A great source of vitamins, minerals, and fiber. Served on the side to help manage your total carb intake.',
    bullets: null, serving: '½ cup fresh',
    svgIcon: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none">
      <path d="M22 14 Q22 8 28 8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 20 Q10 36 22 36 Q34 36 34 20 Q34 14 28 12 Q22 10 16 12 Q10 14 10 20Z" stroke="#fff" stroke-width="2.4" fill="none"/>
      <path d="M22 20 Q22 28 22 34" stroke="#fff" stroke-width="1.4" stroke-dasharray="2,2"/></svg>`,
  },
  {
    id: 'dairy', name: 'Dairy', title: 'Dairy',
    circleColor: '#9575cd', hoverColor: '#7b1fa2',
    cardBg: '#f3e5f5', cardBorder: '#ce93d8', cardTextColor: '#4a148c',
    body: 'Choose low-fat or fat-free options.',
    bullets: ['Skim milk', '1% milk', 'Plain yogurt', 'Plain Greek yogurt', 'Soy milk'], serving: '1 cup',
    svgIcon: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none">
      <path d="M6 30 L22 14 L38 30 L38 36 L6 36Z" stroke="#fff" stroke-width="2.4" fill="none"/>
      <circle cx="26" cy="26" r="3" stroke="#fff" stroke-width="1.8"/>
      <circle cx="16" cy="30" r="2" stroke="#fff" stroke-width="1.8"/></svg>`,
  },
];


// ── MEDICATION SECTION DATA ───────────────────────
// Used by renderMedication() to build the Four M's
// pie chart sections and expandable content panels.
const msData = {
  monitoring: {
    title: '1. Monitoring',
    bg: '#e0f7fa',
    render: () => `
      <p>Keeping track of your blood sugar is one of the most important tools you have. It tells you how food, activity, stress, and medication are affecting your levels and helps you and your care team make smart decisions.</p>
      <p style="margin-top:10px;font-weight:600;">How to Use a Blood Glucose Meter:</p>
      <ol style="padding-left:20px;margin-top:6px;">
        <li>Wash your hands thoroughly before testing.</li>
        <li>Insert a test strip into your meter.</li>
        <li>Use your lancing device on the side of your fingertip to get a small drop of blood.</li>
        <li>Touch and hold the edge of the test strip to the drop of blood and wait for the result.</li>
        <li>Your blood glucose level will appear on the meter's display.</li>
      </ol>
      <div style="background:#fff8e8;border:1px solid #ffe082;border-radius:12px;padding:18px 20px;margin-top:18px;">
        <p style="font-weight:700;margin-bottom:8px;">Continuous Glucose Monitoring (CGM)</p>
        <p style="font-size:13px;line-height:1.7;">A CGM is a small wearable device that tracks your blood sugar levels throughout the day and night, no finger stick required for routine checks! The ADA's 2025 Standards of Care recognize time in range (TIR) as a valid and important measure of glycemic control.</p>
      </div>
      <div style="background:#fff8e8;border:1px solid #ffe082;border-radius:12px;padding:18px 20px;margin-top:12px;">
        <p style="font-weight:600;margin-bottom:8px;">Types of CGM:</p>
        <ul style="padding-left:18px;font-size:13px;line-height:1.8;">
          <li><strong>Prescription CGMs</strong> — for people on insulin or those who need close daily monitoring</li>
          <li><strong>Over-the-counter (OTC) CGMs</strong> — available without a prescription for people with Type 2 diabetes or pre-diabetes</li>
        </ul>
        <p style="font-size:12px;color:#777;margin-top:8px;">Note: CGM doesn't replace finger stick testing in all situations. Always follow your care team's guidance on when to use each.</p>
      </div>
      <p style="font-weight:600;margin-top:20px;margin-bottom:12px;">FingerStick vs CGM:</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#fdf8e8;border-radius:14px;padding:18px 16px;display:flex;flex-direction:column;gap:12px;">
          <div style="background:#99CA3D;color:#fff;border-radius:8px;padding:10px;text-align:center;font-weight:700;font-size:14px;">FingerStick</div>
          <div style="display:flex;justify-content:center;align-items:center;min-height:120px;font-size:64px;">🩸</div>
          <div class="fs-cgm-card"><h4>How it works</h4><ul><li>Prick your finger</li><li>Place a drop of blood on a test strip</li><li>Get a reading in seconds</li></ul></div>
          <div class="fs-cgm-card"><h4>What it measures</h4><ul><li>Blood glucose at a single moment in time</li></ul></div>
          <div class="fs-cgm-card"><h4>Best for</h4><ul><li>Occasional checks</li><li>Simple, low-tech monitoring</li><li>People not needing constant tracking</li></ul></div>
        </div>
        <div style="background:#fdf8e8;border-radius:14px;padding:18px 16px;display:flex;flex-direction:column;gap:12px;">
          <div style="background:#f0f0e8;color:#555;border-radius:8px;padding:10px;text-align:center;font-weight:700;font-size:14px;border:1.5px solid #ddd;">CGM</div>
          <div style="display:flex;justify-content:center;align-items:center;min-height:120px;font-size:64px;">📡</div>
          <div class="fs-cgm-card"><h4>How it works</h4><ul><li>Small sensor placed under the skin</li><li>Tracks glucose levels automatically throughout the day</li><li>Sends data to your phone or device</li></ul></div>
          <div class="fs-cgm-card"><h4>What it measures</h4><ul><li>Real-time glucose levels</li><li>Trends and patterns over time</li></ul></div>
          <div class="fs-cgm-card"><h4>Best for</h4><ul><li>Continuous monitoring</li></ul></div>
        </div>
      </div>`,
  },
  medicine: {
    title: '2. Medicine',
    bg: '#fce4ec',
    render: () => `
      <p style="font-weight:700;font-size:15px;margin-bottom:16px;">Understanding your treatment is the first step toward lasting wellness. We've simplified the core medication types to help you navigate your journey with confidence.</p>
      ${[
        { name: 'Metformin (Pill)', emoji: '💊', bg: '#f0f7e0', border: '#c5e1a5',
          body: "Metformin is often the first medication prescribed for people with Type 2 diabetes. It works by reducing the amount of glucose produced by the liver and improving the body's sensitivity to insulin. It is typically taken twice a day.",
          extra: '<p style="font-weight:600;margin:10px 0 6px;">Key things to know</p><ul><li>Usually taken with food to reduce stomach sensitivity.</li><li>Often the first medication prescribed for Type 2.</li></ul>' },
        { name: 'Insulin (Injection or Pump)', emoji: '💉', bg: '#fce4ec', border: '#f48fb1',
          body: 'Insulin is a hormone required for everyone with Type 1 diabetes and also used by some people with Type 2. It comes in different forms including fast-acting, long-acting, and combination types. Insulin can be delivered through injections or an insulin pump.',
          extra: '<div style="background:#e8d8f0;border-radius:8px;padding:12px 16px;margin-top:12px;font-style:italic;font-size:13px;color:#555;">"Consistent timing is essential for balancing meals and activity."</div>' },
        { name: 'GLP-1 Receptor Agonists (Injection)', emoji: '💉', bg: '#f3e5f5', border: '#ce93d8',
          body: 'GLP-1 receptor agonists are injectable medications that mimic natural hormones to help regulate blood sugar. Medications like semaglutide (Ozempic) and tirzepatide (Mounjaro) not only help lower blood sugar but may also support heart and kidney health.',
          extra: '<p style="font-weight:600;margin:10px 0 4px;">Common side effects</p><ul><li>Nausea</li><li>Vomiting, especially when first starting or increasing dose</li></ul>' },
        { name: 'SGLT2 Inhibitors (Pill)', emoji: '💊', bg: '#fff9e0', border: '#ffe082',
          body: 'SGLT2 inhibitors are oral medications that work in the kidneys by removing excess glucose through urine. In addition to lowering blood sugar, they may support weight loss and slightly reduce blood pressure. They are also known to improve outcomes for people with heart disease and kidney disease.' },
        { name: 'DPP-4 Inhibitors (Pill)', emoji: '💊', bg: '#e8f5e9', border: '#a5d6a7',
          body: 'DPP-4 inhibitors are oral medications that help improve A1C levels by preventing the breakdown of natural hormones that regulate blood sugar. One key advantage is that they lower blood sugar without typically causing hypoglycemia (low blood sugar).' },
      ].map(m => `
        <div style="background:${m.bg};border:1.5px solid ${m.border};border-radius:14px;padding:18px 20px;margin-bottom:16px;">
          <p style="font-weight:700;margin-bottom:8px;">${m.name} ${m.emoji}</p>
          <p style="font-size:13px;line-height:1.7;">${m.body}</p>
          ${m.extra || ''}
        </div>`).join('')}
      <p style="font-weight:700;font-size:15px;margin:24px 0 8px;">Quick Reference Cards</p>
      <p style="font-size:13px;color:#555;margin-bottom:16px;">Click a card to bring it to the front.</p>
      <div class="med-card-stack" id="medCardStack">
        ${[
          { label: 'Card 1: Metformin',             bg: '#c8e6c9', lines: ['<b>How it works</b>', 'Lowers the amount of sugar your liver releases', '<b>How it\'s taken</b>', 'Oral pill, usually once or twice daily', '<b>Key thing to know</b>', 'Often the first medication prescribed for Type 2 diabetes'] },
          { label: 'Card 2: Insulin',               bg: '#fff9c4', lines: ['<b>How it works</b>', 'Helps your body move sugar from your blood into your cells', '<b>How it\'s taken</b>', 'Injection or insulin pump', '<b>Key thing to know</b>', 'Can cause low blood sugar if not balanced with food'] },
          { label: 'Card 3: GLP-1 Receptor Agonists', bg: '#f8bbd0', lines: ['<b>How it works</b>', 'Slows digestion and helps your body release insulin', '<b>How it\'s taken</b>', 'Weekly or daily injection (some oral options exist)', '<b>Key thing to know</b>', 'Can help with weight loss'] },
          { label: 'Card 4: SGLT2 Inhibitors',      bg: '#e1bee7', lines: ['<b>How it works</b>', 'Removes excess sugar through urine', '<b>How it\'s taken</b>', 'Oral pill, once daily', '<b>Key thing to know</b>', 'Also protects the heart and kidneys'] },
        ].map((c, i) => `
          <div class="med-card" data-index="${i}" style="background:${c.bg};z-index:${4 - i};transform:rotate(${(i - 1.5) * 4}deg) translate(${(i - 1.5) * 6}px,${i * 2}px);">
            <p style="font-size:11px;color:#777;margin-bottom:6px;">${c.label}</p>
            ${c.lines.map(l => `<p style="font-size:13px;line-height:1.6;">${l}</p>`).join('')}
          </div>`).join('')}
      </div>
      <div style="display:flex;justify-content:center;gap:8px;margin-top:12px;" id="cardDots"></div>`,
  },
  movement: {
    title: '3. Movement',
    bg: '#e8f5e9',
    render: () => `
      <p>Physical activity helps your body use insulin more effectively. The ADA recommends at least 150 minutes of moderate-intensity activity per week.</p>
      <ul style="margin-top:10px;">
        <li><strong>Aerobic activity:</strong> Walking, swimming, cycling, dancing</li>
        <li><strong>Strength training:</strong> 2–3 times per week</li>
        <li><strong>Flexibility:</strong> Stretching and yoga reduce stress and improve circulation</li>
      </ul>`,
  },
  meal: {
    title: '4. Meal Planning',
    bg: '#f3e5f5',
    render: () => `
      <p>What you eat directly affects your blood sugar.</p>
      <ul style="margin-top:10px;">
        <li>Use the <strong>Plate Method</strong></li>
        <li>Choose high-fiber foods to slow glucose absorption</li>
        <li>Limit sugary drinks, refined carbs, and processed foods</li>
        <li>Eat at consistent times each day</li>
      </ul>`,
  },
};


// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

// Returns an {x, y} point on a circle at a given degree
function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Returns an SVG arc path string (does not close the path)
function arc(cx, cy, r, a1, a2) {
  const s = polar(cx, cy, r, a1), e = polar(cx, cy, r, a2);
  const large = ((a2 - a1 + 360) % 360) > 180 ? 1 : 0;
  return `M${s.x.toFixed(2)} ${s.y.toFixed(2)} A${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}


// ═══════════════════════════════════════════════════
// INTRODUCTION TAB
// ═══════════════════════════════════════════════════

// Builds the HTML for a Type 1, Type 2, or
// Pre-diabetes detail panel from typeDetails data.
function buildTypePanel(key) {
  const d  = typeDetails[key];
  const ac = d.accentColor, bg = d.bgColor, bc = d.borderColor;

  if (key === 'pre') {
    const tableRows = d.table.rows.map(row =>
      `<tr>${row.map((c, i) => i === 0 ? `<td style="font-weight:600">${c}</td>` : `<td>${c}</td>`).join('')}</tr>`
    ).join('');
    return `<div class="type-panel" style="background:${bg};border-color:${bc}">
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
        <ul style="padding-left:18px;margin-bottom:14px;">${d.whyItMatters.map(x => `<li>${x}</li>`).join('')}</ul>
        <p style="font-weight:600;margin-bottom:6px;">What You Can Do:</p>
        <ul style="padding-left:18px;">${d.whatYouCanDo.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>`;
  }

  const keyFactsHTML = d.keyFacts.map(f => `<li>${f}</li>`).join('');
  const sympTreatHTML = d.symptoms ? `
    <div class="type-panel-cols" style="border-color:${bc}">
      <div class="type-panel-col" style="border-color:${bc}">
        <p style="font-weight:600;margin-bottom:8px;">Common Symptoms:</p>
        <ul>${d.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
      <div class="type-panel-col">
        <p style="font-weight:600;margin-bottom:8px;">Treatment:</p>
        <p>${d.treatment}</p>
      </div>
    </div>` : '';

  let extraHTML = '';
  if (d.extra?.type === 'mythbust') {
    extraHTML = `
      <div class="type-panel-section" style="border-color:${bc}">
        <p style="font-weight:700;text-align:center;margin-bottom:4px;">${d.extra.title}</p>
        <p style="font-style:italic;text-align:center;font-size:13px;margin-bottom:12px;">${d.extra.subtitle}</p>
        ${d.extra.myths.map((m, i) => `
          <div class="myth-card" data-myth="${i}" style="background:${ac}">
            <span class="myth-front">${m.statement}</span>
            <div class="myth-back" style="display:none">
              <span class="myth-verdict ${m.verdict === 'TRUE' ? 'verdict-true' : 'verdict-false'}">${m.verdict}</span>
              <span>${m.explanation}</span>
            </div>
          </div>`).join('')}
      </div>`;
  }

  if (d.extra?.type === 'checklist') {
    extraHTML = `
      <div class="type-panel-section" style="border-color:${bc}">
        <div style="background:${ac};color:#fff;border-radius:8px;padding:12px 16px;font-size:14px;text-align:center;margin-bottom:16px;">${d.extra.goodNews}</div>
        <p style="font-weight:700;text-align:center;margin-bottom:4px;">${d.extra.title}</p>
        <p style="text-align:center;font-size:13px;margin-bottom:14px;color:#555;">${d.extra.subtitle}</p>
        <div id="riskCheckList">
          ${d.extra.riskFactors.map(r =>
            `<div class="risk-check-row">
              <label class="risk-check-label" for="${r.id}">${r.label}</label>
              <input type="checkbox" class="risk-checkbox" id="${r.id}">
            </div>`).join('')}
        </div>
        <div id="riskMessage" style="margin-top:14px;display:none;background:#fff;border-radius:10px;padding:14px 16px;font-size:13px;line-height:1.6;border:1.5px solid ${bc};"></div>
        <div style="display:flex;justify-content:center;margin-top:14px;">
          <button onclick="evaluateRisk('${bc}')" style="background:${ac};color:#fff;border:none;border-radius:8px;padding:9px 24px;font-size:14px;cursor:pointer;font-family:Roboto,sans-serif;">See My Results</button>
        </div>
        <p style="font-size:11px;font-style:italic;color:#777;margin-top:10px;text-align:center;">This is not a diagnosis — it's a conversation starter with your doctor.</p>
      </div>`;
  }

  return `<div class="type-panel" style="background:${bg};border-color:${bc}">
    <button class="type-panel-close" style="color:${ac}" data-close="true">✕</button>
    <div class="type-panel-section" style="border-color:${bc}">
      <p style="font-weight:600;margin-bottom:6px;">Key Facts:</p>
      <ul style="padding-left:18px;">${keyFactsHTML}</ul>
    </div>
    ${sympTreatHTML}
    ${extraHTML}
  </div>`;
}

// Evaluates checked risk factors and injects a
// personalised message. Called via inline onclick.
window.evaluateRisk = function(borderColor) {
  const checked = document.querySelectorAll('.risk-checkbox:checked').length;
  const msg = document.getElementById('riskMessage');
  if (!msg) return;

  let text = '';
  if      (checked === 0) text = `✅ <strong>Great news!</strong> You didn't select any risk factors. Keep up your healthy habits and talk to your doctor about routine screening starting at age 35.`;
  else if (checked <= 2)  text = `🟡 <strong>Having ${checked} risk factor${checked > 1 ? 's' : ''}</strong> doesn't mean you'll develop Type 2 diabetes — but it's a good reason to mention it to your doctor. Small lifestyle changes now can make a big difference.`;
  else if (checked <= 4)  text = `🟠 <strong>You selected ${checked} risk factors.</strong> This is worth a conversation with your healthcare provider. They can recommend screening and personalized steps to reduce your risk.`;
  else                    text = `🔴 <strong>You selected ${checked} risk factors.</strong> Please consider talking to your doctor soon about diabetes screening. Early detection makes a real difference — and many risk factors can be addressed with support.`;

  msg.innerHTML = text;
  msg.style.display = 'block';
  msg.style.borderColor = borderColor;
};

// Builds and wires up the Introduction tab content.
function renderIntroduction() {
  const organHTML = Object.entries(organData).map(([k, v]) => `
    <div class="organ-item" data-organ="${k}">
      <div class="organ-circle">${v.emoji}</div>
      <div class="organ-name">${v.label}</div>
    </div>`).join('');

  document.getElementById('tab-introduction').innerHTML = `
    <h2 class="section-h2">What is Diabetes?</h2>
    <div class="info-box">Diabetes is a condition in which the body's blood sugar (glucose) is too high. Glucose comes from the food we eat and is the body's main source of energy. Normally, a hormone called insulin (made by the pancreas) helps the glucose move from the bloodstream into your cells, where it is used for energy. In diabetes, the body either doesn't make enough insulin, or can't use it properly, so glucose builds up in the blood instead.</div>
    <p class="damage-label">Over time, high blood sugar can damage...</p>
    <p class="click-hint">Click each circle to learn more</p>
    <div class="organ-row">${organHTML}</div>
    <div class="organ-detail-box" id="organDetailBox"></div>
    <div class="callout-green">However, with proper management, diabetes can generally be kept under control and complications minimized.</div>
    <p class="callout-hint">Click each box to learn more</p>
    <div class="type-boxes-area" id="typeBoxesArea">
      <div class="type-boxes-grid" id="typeBoxesGrid">
        <div class="type-box t1"  data-type="t1">Diabetes 1</div>
        <div class="type-box t2"  data-type="t2">Diabetes 2</div>
      </div>
      <div class="type-boxes-center" id="typeBoxesCenter">
        <div class="type-box pre" data-type="pre">Pre-diabetes</div>
      </div>
      <div id="typePanelContainer"></div>
    </div>
    <div class="next-btn-row">
      <button class="next-btn" id="introNextBtn">Go to Diet &rarr;</button>
    </div>`;

  // Organ click → show/hide detail box
  document.querySelectorAll('.organ-item').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.organ, box = document.getElementById('organDetailBox');
      if (box.dataset.active === k) { box.style.display = 'none'; box.dataset.active = ''; return; }
      box.innerHTML = `<strong>${organData[k].label}:</strong> ${organData[k].detail}`;
      box.style.display = 'block';
      box.dataset.active = k;
    });
  });

  // Type box click → open/close detail panel
  let activeType = null;
  function openTypePanel(key) {
    const container = document.getElementById('typePanelContainer');
    const grid      = document.getElementById('typeBoxesGrid');
    const center    = document.getElementById('typeBoxesCenter');

    if (activeType === key) {
      container.innerHTML = ''; grid.style.display = ''; center.style.display = ''; activeType = null; return;
    }
    activeType = key;
    grid.style.display = 'none'; center.style.display = 'none';
    container.innerHTML = buildTypePanel(key);
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    container.querySelector('[data-close]').addEventListener('click', () => {
      container.innerHTML = ''; grid.style.display = ''; center.style.display = ''; activeType = null;
    });
    container.querySelectorAll('.myth-card').forEach(card => {
      card.addEventListener('click', () => {
        const front = card.querySelector('.myth-front'), back = card.querySelector('.myth-back');
        if (back.style.display === 'none') { front.style.display = 'none'; back.style.display = 'flex'; }
        else                               { front.style.display = '';     back.style.display = 'none'; }
      });
    });
  }

  document.querySelectorAll('.type-box').forEach(el => el.addEventListener('click', () => openTypePanel(el.dataset.type)));
  document.getElementById('introNextBtn').addEventListener('click', () => switchTab('diet'));
}


// ═══════════════════════════════════════════════════
// DIET TAB
// ═══════════════════════════════════════════════════

// Builds the plate SVG from plateSegData.
function buildPlateSVG() {
  const cx = 150, cy = 150, r = 128;
  const segs = [
    { id: 'veg',     color: '#7cb342', hov: '#558b2f', a1: 90,  a2: 270, icon: plateSegData.veg.svgIcon },
    { id: 'carb',    color: '#ffa726', hov: '#e65100', a1: 270, a2: 360, icon: plateSegData.carb.svgIcon },
    { id: 'protein', color: '#ef5350', hov: '#b71c1c', a1: 0,   a2: 90,  icon: plateSegData.protein.svgIcon },
  ];
  const paths = segs.map(s => `
    <path class="plate-seg" data-seg="${s.id}"
      d="${arc(cx, cy, r, s.a1, s.a2)} L${cx} ${cy}Z"
      fill="${s.color}" stroke="#fff" stroke-width="5"
      style="cursor:pointer;transition:fill 0.18s;"
      onmouseenter="this.setAttribute('fill','${s.hov}')"
      onmouseleave="this.setAttribute('fill','${s.color}')"/>
    ${s.icon}`).join('');
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="width:260px;height:260px;">
    <circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="#e0e0e0"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 7}"  fill="#f5f5f5"/>
    ${paths}
    <circle cx="${cx}" cy="${cy}" r="24" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/>
  </svg>`;
}

// Builds the three side-item icon circles from sideItemData.
function buildSideItems() {
  return sideItemData.map(s => {
    const bulletsHTML = s.bullets ? `<ul style="padding-left:16px;margin-top:4px;">${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : '';
    const servingHTML = s.serving ? `<p style="margin-top:6px;font-size:11px;color:#777;">*Serving size: ${s.serving}</p>` : '';
    const bodyHTML    = s.body    ? `<p style="font-size:12px;line-height:1.6;margin-top:2px;">${s.body}</p>` : '';
    return `
      <div class="side-item-wrap">
        <button class="side-circle-btn" data-normal-color="${s.circleColor}" data-hover-color="${s.hoverColor}" style="background:${s.circleColor};">${s.svgIcon}</button>
        <div class="side-item-name">${s.name}</div>
        <div class="side-hover-card" style="background:${s.cardBg};border-color:${s.cardBorder};color:${s.cardTextColor};display:none;">
          <p style="font-weight:700;font-size:13px;margin-bottom:4px;">${s.title}</p>
          ${bodyHTML}${bulletsHTML}${servingHTML}
        </div>
      </div>`;
  }).join('');
}

// Builds and wires up the Diet tab content.
function renderDiet() {
  document.getElementById('tab-diet').innerHTML = `
    <h2 class="section-h3" style="font-size:22px;color:#00AAAC;font-weight:400;margin-bottom:6px;">Build Your Plate</h2>
    <p style="font-size:14px;font-weight:700;margin-bottom:4px;">What is the meal plate method?</p>
    <p style="font-size:14px;margin-bottom:6px;">The plate method is a simple way to build a healthy, balanced meal. No counting calories required!</p>
    <p style="font-size:14px;margin-bottom:24px;">Use a 9-inch plate and divide it into 3 sections:</p>
    <p style="font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;">Nutritional Needs</p>
    <p style="font-size:14px;color:#00AAAC;text-align:center;margin-bottom:20px;">&#9904; Hover on the plate sections</p>
    <div class="plate-layout">
      <div class="plate-card-left">
        <div class="plate-info-card" id="plateCardLeft" style="background:${plateSegData.veg.bg};border-color:${plateSegData.veg.border};display:none;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-weight:700;font-size:13px;color:${plateSegData.veg.textColor};">Nonstarchy<br>Vegetables</span>
            <span style="font-weight:700;font-size:15px;color:${plateSegData.veg.textColor};">50%</span>
          </div>
          <p style="font-size:12px;line-height:1.6;color:#414042;">${plateSegData.veg.detail}</p>
          <p style="font-size:11px;color:#777;margin-top:6px;">*Serving Size: ${plateSegData.veg.serving}</p>
        </div>
      </div>
      <div class="plate-center">${buildPlateSVG()}</div>
      <div style="display:flex;flex-direction:column;gap:16px;justify-content:center;">
        <div class="plate-info-card" id="plateCardCarb" style="background:${plateSegData.carb.bg};border-color:${plateSegData.carb.border};display:none;max-width:220px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-weight:700;font-size:13px;color:${plateSegData.carb.textColor};">Carbs</span>
            <span style="font-weight:700;font-size:15px;color:${plateSegData.carb.textColor};">25%</span>
          </div>
          <p style="font-size:12px;line-height:1.6;color:#414042;">${plateSegData.carb.detail}</p>
          <p style="font-size:11px;color:#777;margin-top:6px;">*Serving Size: ${plateSegData.carb.serving}</p>
        </div>
        <div class="plate-info-card" id="plateCardProtein" style="background:${plateSegData.protein.bg};border-color:${plateSegData.protein.border};display:none;max-width:220px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-weight:700;font-size:13px;color:${plateSegData.protein.textColor};">Protein</span>
            <span style="font-weight:700;font-size:15px;color:${plateSegData.protein.textColor};">25%</span>
          </div>
          <p style="font-size:12px;line-height:1.6;color:#414042;">${plateSegData.protein.detail}</p>
          <p style="font-size:11px;color:#777;margin-top:6px;">*Serving Size: ${plateSegData.protein.serving}</p>
        </div>
      </div>
    </div>
    <p style="font-size:16px;font-weight:700;margin-bottom:4px;">On the Side</p>
    <p style="font-size:13px;color:#00AAAC;margin-bottom:20px;">&#9904; Hover on the icons</p>
    <div class="side-icons-row">${buildSideItems()}</div>
    <div class="diet-list-section" style="margin-top:24px;">
      <h3 class="section-h3">Good Fats</h3>
      <p style="font-size:14px;margin-bottom:8px;">Healthy fats can be used for cooking or as toppings. Choose monounsaturated and polyunsaturated fats and eat them in moderation.</p>
      <ul><li>Canola, olive, sunflower, and peanut oils</li><li>Avocado</li><li>Nuts (e.g., walnuts)</li><li>Seeds (e.g., chia seed, flaxseed)</li></ul>
    </div>
    <div class="diet-list-section" style="margin-top:18px;">
      <h3 class="section-h3">Foods to limit or avoid:</h3>
      <ul><li>Refined carbs</li><li>High-fat dairy and animal products</li><li>Deep-fried foods</li><li>Processed foods</li><li>Alcoholic beverages</li></ul>
    </div>
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
      <div class="quiz-answer" id="quizAnswer"></div>
    </div>
    <div class="next-btn-row">
      <button class="next-btn" id="dietNextBtn">Go to Medication &nbsp;›</button>
    </div>`;

  // Plate hover → show matching info card
  const segCardMap  = { veg: 'plateCardLeft', carb: 'plateCardCarb', protein: 'plateCardProtein' };
  const allCardIds  = Object.values(segCardMap);
  document.querySelectorAll('.plate-seg').forEach(el => {
    el.addEventListener('mouseenter', () => {
      allCardIds.forEach(id => { document.getElementById(id).style.display = 'none'; });
      const t = document.getElementById(segCardMap[el.dataset.seg]);
      if (t) t.style.display = 'block';
    });
    el.addEventListener('mouseleave', () => {
      allCardIds.forEach(id => { document.getElementById(id).style.display = 'none'; });
    });
  });

  // Side icon hover → show matching hover card
  document.querySelectorAll('.side-item-wrap').forEach(wrap => {
    const circle = wrap.querySelector('.side-circle-btn'), card = wrap.querySelector('.side-hover-card');
    wrap.addEventListener('mouseenter', () => { circle.style.background = circle.dataset.hoverColor; card.style.display = 'block'; });
    wrap.addEventListener('mouseleave', () => { circle.style.background = circle.dataset.normalColor; card.style.display = 'none'; });
  });

  // Quiz submit
  document.getElementById('quizSubmit').addEventListener('click', () => {
    const sel = document.querySelector('input[name="q1"]:checked');
    const ans = document.getElementById('quizAnswer'), btn = document.getElementById('quizSubmit');
    if (!sel) { alert('Please select an answer first!'); return; }

    if (sel.value === 'C') {
      ans.className = 'quiz-answer show correct';
      ans.innerHTML = `<strong>Correct Answer: C</strong><br>Water is the top recommended beverage. Sugary drinks like regular soda and juice can cause rapid spikes in blood sugar. The ADA recommends prioritizing water over sweetened beverages.`;
      btn.style.display = 'none';
    } else {
      ans.className = 'quiz-answer show wrong';
      ans.innerHTML = `<strong>Not quite!</strong> That's not the best choice for managing blood sugar.
        <button id="tryAgainBtn" style="display:inline-block;margin-top:10px;background:#00AAAC;color:#fff;border:none;border-radius:8px;padding:7px 20px;font-size:13px;cursor:pointer;font-family:Roboto,sans-serif;">Try Again</button>`;
      document.getElementById('tryAgainBtn').addEventListener('click', () => {
        document.querySelectorAll('input[name="q1"]').forEach(r => r.checked = false);
        ans.className = 'quiz-answer'; ans.innerHTML = ''; btn.style.display = '';
      });
    }
  });

  document.getElementById('dietNextBtn').addEventListener('click', () => switchTab('medication'));
}


// ═══════════════════════════════════════════════════
// MEDICATION TAB
// ═══════════════════════════════════════════════════

// Builds the Four M's pie SVG from msData keys.
function buildMsPieSVG() {
  const cx = 150, cy = 150, r = 130;
  const slices = [
    { id: 'movement',   color: '#f9a825', hov: '#f57f17', a1: 225, a2: 315, label: 'Movement' },
    { id: 'monitoring', color: '#80deea', hov: '#00acc1', a1: 315, a2: 405, label: 'Monitoring' },
    { id: 'medicine',   color: '#ce93d8', hov: '#ab47bc', a1: 45,  a2: 135, label: 'Medicine' },
    { id: 'meal',       color: '#aed581', hov: '#7cb342', a1: 135, a2: 225, label: 'Meal\nPlanning' },
  ];
  const paths = slices.map(s => {
    const mid   = (s.a1 + s.a2) / 2;
    const lp    = polar(cx, cy, r * 0.65, mid);
    const lines = s.label.split('\n');
    const textEls = lines.map((l, i) =>
      `<text x="${lp.x.toFixed(1)}" y="${(lp.y + (i - (lines.length - 1) / 2) * 18).toFixed(1)}"
        text-anchor="middle" dominant-baseline="middle"
        font-size="13" font-weight="700" fill="#fff" font-family="Roboto,sans-serif"
        style="pointer-events:none">${l}</text>`
    ).join('');
    return `<path class="ms-slice" data-ms="${s.id}"
      d="${arc(cx, cy, r, s.a1, s.a2)} L${cx} ${cy}Z"
      fill="${s.color}" stroke="#fff" stroke-width="5"
      style="cursor:pointer;transition:fill 0.18s;"
      onmouseenter="this.setAttribute('fill','${s.hov}')"
      onmouseleave="this.setAttribute('fill','${s.color}')"/>
    ${textEls}`;
  }).join('');
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="width:260px;height:260px;">
    ${paths}
    <circle cx="${cx}" cy="${cy}" r="26" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/>
  </svg>`;
}

// Builds and wires up the Medication tab content.
function renderMedication() {
  const sections = Object.entries(msData).map(([k, v]) =>
    `<div class="ms-section" id="ms-${k}" style="background:${v.bg};">
       <h3>${v.title}</h3>${v.render()}
     </div>`
  ).join('');

  document.getElementById('tab-medication').innerHTML = `
    <p style="font-size:14px;color:#888;margin-bottom:6px;">How to Manage Your Diabetes: <strong style="color:#b07010;">The Four M's</strong></p>
    <div class="four-ms-intro">Managing diabetes is about balance. <strong>The four M's: Monitoring, Medicine, Movement, and Meal Planning</strong> work together to keep blood sugar in a healthy range and help prevent long-term complications.</div>
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div class="pie-svg-wrapper">${buildMsPieSVG()}</div>
      <p style="font-size:13px;color:#00AAAC;margin-top:4px;margin-bottom:20px;">Click on the sections of the circle to learn more</p>
    </div>
    ${sections}
    <div class="next-btn-row">
      <button class="next-btn" id="medNextBtn">End of Diabetes — Go to Dental &rarr;</button>
    </div>`;

  // Open Monitoring by default
  document.getElementById('ms-monitoring').classList.add('open');

  // Pie slice click → open matching section
  document.querySelectorAll('.ms-slice').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.ms;
      document.querySelectorAll('.ms-section').forEach(s => s.classList.remove('open'));
      const target = document.getElementById(`ms-${k}`);
      target.classList.add('open');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  initCardStack();
  document.getElementById('medNextBtn').addEventListener('click', () => {
    completeModule();
    // Small delay so the star burst plays before navigating
    setTimeout(() => { window.location.href = 'dental.html'; }, 1000);
  });
}

// Manages the stacked medication quick-reference cards.
function initCardStack() {
  const stack = document.getElementById('medCardStack');
  if (!stack) return;
  const dotsEl = document.getElementById('cardDots');
  const cards  = Array.from(stack.querySelectorAll('.med-card'));
  let topIndex = 0;

  function updateStack() {
    cards.forEach((c, i) => {
      const rel = (i - topIndex + cards.length) % cards.length;
      c.style.zIndex        = cards.length - rel;
      c.style.transform     = `rotate(${(rel - 1.5) * 4}deg) translate(${(rel - 1.5) * 6}px,${rel * 2}px)`;
      c.style.opacity       = rel < 3 ? 1 : 0;
      c.style.pointerEvents = rel === 0 ? 'auto' : 'none';
    });
    dotsEl.innerHTML = cards.map((_, i) =>
      `<span style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${i === topIndex ? '#00AAAC' : '#c8d8c8'};cursor:pointer;" data-dot="${i}"></span>`
    ).join('');
    dotsEl.querySelectorAll('span').forEach(dot => {
      dot.addEventListener('click', () => { topIndex = +dot.dataset.dot; updateStack(); });
    });
  }
  cards.forEach((card, i) => card.addEventListener('click', () => { topIndex = i; updateStack(); }));
  updateStack();
}


// ═══════════════════════════════════════════════════
// TAB SWITCHING
// ═══════════════════════════════════════════════════

const tabRenderers = {
  introduction: renderIntroduction,
  diet:         renderDiet,
  medication:   renderMedication,
};
const rendered = {}; // tracks which tabs have been rendered already

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