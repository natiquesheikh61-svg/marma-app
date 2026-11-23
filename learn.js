/* Marma Translator – LEARN (Duolingo-style course)
   The course order (12 units, from greetings to everyday talk) is built into the app.
   The Marma in every lesson comes ONLY from checked entries given by Marma speakers.
   A lesson opens by itself as soon as its words have been added and approved.
   Marma is written in English letters. Progress is saved on this phone (works offline). */
'use strict';

/* ================= Words for the learning screens ================= */
const LT = {
  bn: {
    title: 'মারমা শিখুন', streak: 'দিনের ধারা', xp: 'পয়েন্ট', goal: 'আজকের লক্ষ্য',
    wordsReady: (a, b) => `কোর্সের ${b}টির মধ্যে ${a}টি মারমা শব্দ প্রস্তুত`,
    unit: (n) => `ইউনিট ${n}`, lesson: (n) => `পাঠ ${n}`, review: 'ইউনিট পুনরালোচনা', start: 'শুরু', again: 'আবার করুন',
    items: (n) => `${n}টি শব্দ/বাক্য`, guide: '📖 শব্দগুলো', practice: '💪 অনুশীলন', practiceTitle: 'অনুশীলন',
    locked: 'আগের পাঠগুলো শেষ করুন', needWords: 'এই পাঠের মারমা শব্দ এখনও আসেনি',
    needWordsHelp: 'মারমা ভাষাভাষীরা নিচের শব্দগুলোর মারমা যোগ করলে এবং যাচাইকারী অনুমোদন দিলে পাঠটি নিজে থেকেই খুলে যাবে।',
    addMarma: '＋ মারমা যোগ করুন', ready: '✔ প্রস্তুত', missing: 'এখনও আসেনি',
    emptyTitle: 'কোর্স তৈরি — শুধু মারমা শব্দের অপেক্ষা!',
    emptyText: 'পাঠগুলো তৈরি হয়ে আছে। মারমা ভাষাভাষীরা শব্দ যোগ করলে এবং যাচাই হলে পাঠ খুলে যাবে। প্রথম ইউনিট দিয়ে শুরু করুন!',
    emptyBtn: '✍️ প্রথম ইউনিটের শব্দ যোগ করুন',
    // exercises
    newWord: 'নতুন শব্দ', newPhrase: 'নতুন বাক্য', gotIt: 'বুঝেছি', check: 'যাচাই করুন', cont: 'এগিয়ে যান',
    qMeaning: 'এর অর্থ কী?', qMarma: 'মারমায় কী বলে?', qListen: 'শুনুন, তারপর বেছে নিন', qTiles: 'মারমায় বাক্যটি সাজান',
    qType: 'মারমায় লিখুন (ইংরেজি হরফে)', qMatch: 'জোড়া মেলান', qSpeak: 'জোরে বলুন',
    typeHere: 'এখানে লিখুন…', tapListen: '🔊 শুনুন', slow: '🐢 আস্তে',
    speakHelp: 'মাইক চেপে বলুন, তারপর নিজের কণ্ঠ ও শিক্ষকের কণ্ঠ মিলিয়ে শুনুন।',
    record: '🎤 রেকর্ড', stopRec: '⏹ থামান', mine: '▶ আমার কণ্ঠ', teacher: '▶ মারমা কণ্ঠ',
    saidIt: '✓ আমি বলেছি', cantSpeak: 'এখন বলতে পারছি না',
    praise: ['দারুণ!', 'চমৎকার!', 'একদম ঠিক!', 'খুব ভালো!', 'অসাধারণ!'],
    almost: 'প্রায় ঠিক! সঠিক বানান:', wrong: 'সঠিক উত্তর:', meaning: 'অর্থ:',
    quit: 'পাঠ ছেড়ে যাবেন? অগ্রগতি হারাবে।',
    outTitle: 'হৃদয় শেষ!', outText: 'চিন্তা নেই — আবার চেষ্টা করুন। প্রতিবার আরও ভালো হবে।', retry: 'আবার চেষ্টা', back: 'পথে ফিরে যান',
    doneTitle: 'পাঠ শেষ!', earned: 'পয়েন্ট', accuracy: 'নির্ভুলতা', streakNow: (n) => `🔥 ${n} দিনের ধারা!`,
    goalDone: '🎯 আজকের লক্ষ্য পূরণ!', sound: 'শব্দ', computerNote: '',
    noPractice: 'অনুশীলনের জন্য আগে অন্তত একটি পাঠ শেষ করুন।',
    honesty: 'সব মারমা শব্দ মারমা ভাষাভাষীদের দেওয়া ও যাচাই করা।'
  },
  en: {
    title: 'Learn Marma', streak: 'Day streak', xp: 'Points', goal: 'Daily goal',
    wordsReady: (a, b) => `${a} of ${b} course words have their Marma`,
    unit: (n) => `Unit ${n}`, lesson: (n) => `Lesson ${n}`, review: 'Unit review', start: 'Start', again: 'Do again',
    items: (n) => `${n} words / phrases`, guide: '📖 Words', practice: '💪 Practice', practiceTitle: 'Practice',
    locked: 'Finish the earlier lessons first', needWords: 'The Marma for this lesson has not arrived yet',
    needWordsHelp: 'When Marma speakers add the Marma for the items below and a checker approves them, this lesson opens by itself.',
    addMarma: '＋ Add Marma', ready: '✔ Ready', missing: 'Not yet',
    emptyTitle: 'The course is ready — waiting for Marma words!',
    emptyText: 'All lessons are prepared. They open as soon as Marma speakers add the words and a checker approves them. Start with Unit 1!',
    emptyBtn: '✍️ Add words for Unit 1',
    newWord: 'New word', newPhrase: 'New phrase', gotIt: 'Got it', check: 'Check', cont: 'Continue',
    qMeaning: 'What does this mean?', qMarma: 'How do you say this in Marma?', qListen: 'Listen, then choose', qTiles: 'Build the Marma sentence',
    qType: 'Write it in Marma (English letters)', qMatch: 'Match the pairs', qSpeak: 'Say it out loud',
    typeHere: 'Type here…', tapListen: '🔊 Listen', slow: '🐢 Slow',
    speakHelp: 'Press the mic and say it, then compare your voice with the Marma voice.',
    record: '🎤 Record', stopRec: '⏹ Stop', mine: '▶ My voice', teacher: '▶ Marma voice',
    saidIt: '✓ I said it', cantSpeak: "Can't speak now",
    praise: ['Great!', 'Excellent!', 'Correct!', 'Well done!', 'Amazing!'],
    almost: 'Almost! Correct spelling:', wrong: 'Correct answer:', meaning: 'Meaning:',
    quit: 'Leave this lesson? Your progress in it will be lost.',
    outTitle: 'Out of hearts!', outText: "Don't worry — try again. You get better every time.", retry: 'Try again', back: 'Back to path',
    doneTitle: 'Lesson complete!', earned: 'Points', accuracy: 'Accuracy', streakNow: (n) => `🔥 ${n} day streak!`,
    goalDone: '🎯 Daily goal reached!', sound: 'Sound', computerNote: '',
    noPractice: 'Finish at least one lesson first, then practise here.',
    honesty: 'All Marma words come from Marma speakers and are checked.'
  }
};
const lt = (k, ...a) => { const v = (LT[lang] && LT[lang][k]) ?? LT.en[k] ?? k; return typeof v === 'function' ? v(...a) : v; };

/* ================= Progress, saved on this phone ================= */
const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
const Progress = {
  data: (() => { try { return JSON.parse(localStorage.getItem('learnProgress')) || {}; } catch (e) { return {}; } })(),
  save() { try { localStorage.setItem('learnProgress', JSON.stringify(this.data)); } catch (e) {} },
  get xp() { return this.data.xp || 0; },
  get goal() { return this.data.goal || 20; },
  get todayXp() { return this.data.day === today() ? (this.data.dayXp || 0) : 0; },
  get streak() {
    const d = this.data.lastDay; if (!d) return 0;
    const diff = Math.round((new Date(today()) - new Date(d)) / 86400000);
    return diff <= 1 ? (this.data.streak || 0) : 0;
  },
  stars(id) { return (this.data.done || {})[id] || 0; },
  seen(code) { return !!(this.data.seen || {})[code]; },
  get sound() { return this.data.sound !== false; },
  set sound(v) { this.data.sound = v; this.save(); },
  finish(id, stars, xp, codes) {
    const d = this.data;
    d.done = d.done || {}; d.done[id] = Math.max(d.done[id] || 0, stars);
    d.seen = d.seen || {}; codes.forEach((c) => { d.seen[c] = 1; });
    d.xp = (d.xp || 0) + xp;
    if (d.day !== today()) { d.day = today(); d.dayXp = 0; }
    d.dayXp = (d.dayXp || 0) + xp;
    const last = d.lastDay, diff = last ? Math.round((new Date(today()) - new Date(last)) / 86400000) : 99;
    if (diff === 1) d.streak = (d.streak || 0) + 1; else if (diff !== 0) d.streak = 1;
    d.lastDay = today();
    this.save();
  }
};

/* ================= Sounds (made by the phone, no files needed) ================= */
const Sfx = {
  ctx: null,
  tone(freqs, dur = 0.12, type = 'sine', gap = 0.09) {
    if (!Progress.sound) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain(), t0 = this.ctx.currentTime + i * gap;
        o.type = type; o.frequency.value = f; o.connect(g); g.connect(this.ctx.destination);
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.start(t0); o.stop(t0 + dur + 0.02);
      });
    } catch (e) {}
  },
  ok() { this.tone([660, 990], 0.14); },
  bad() { this.tone([220, 170], 0.18, 'triangle', 0.12); },
  tap() { this.tone([520], 0.05); },
  win() { this.tone([523, 659, 784, 1046], 0.18, 'sine', 0.12); }
};

/* ================= Confetti ================= */
function confetti(ms = 2200) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  const x = c.getContext('2d'); const W = c.width = innerWidth, H = c.height = innerHeight;
  const colors = ['#1fa36b', '#ff8a3d', '#7b5cff', '#2d9cdb', '#ff5c8a', '#ffc93c'];
  const parts = Array.from({ length: 120 }, () => ({ x: W / 2, y: H / 3, vx: (Math.random() - 0.5) * 12, vy: Math.random() * -12 - 3,
    s: 6 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[Math.random() * colors.length | 0] }));
  const t0 = performance.now();
  (function frame(t) {
    x.clearRect(0, 0, W, H);
    parts.forEach((p) => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
    if (t - t0 < ms) requestAnimationFrame(frame); else c.remove();
  })(t0);
}

/* ================= Building the course from checked words ================= */
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const meaningOf = (it) => lang === 'bn' ? (it.bn || it.en) : (it.en || it.bn);

function courseItems() {
  const prompts = PROMPTS.filter((p) => p.code && p.unit).sort((a, b) => a.unit.localeCompare(b.unit) || (a.sort || 0) - (b.sort || 0));
  const checked = allEntries().filter((e) => e.trust === 'checked' && e.marma);
  const byCode = new Map(), byBn = new Map(), byEn = new Map();
  for (const e of checked) {
    if (e.prompt_code && !byCode.has(e.prompt_code)) byCode.set(e.prompt_code, e);
    if (e.bn && !byBn.has(norm(e.bn))) byBn.set(norm(e.bn), e);
    if (e.en && !byEn.has(norm(e.en))) byEn.set(norm(e.en), e);
  }
  return prompts.map((p) => ({ code: p.code, unit: p.unit, sort: p.sort, type: p.item_type || 'word', bn: p.bn, en: p.en, cat: p.category_id,
    entry: byCode.get(p.code) || byBn.get(norm(p.bn)) || byEn.get(norm(p.en)) || null }));
}

function buildCourse() {
  const items = courseItems();
  const units = [...UNITS].sort((a, b) => a.sort - b.sort).map((u) => ({ ...u, items: items.filter((i) => i.unit === u.code) })).filter((u) => u.items.length);
  const lessons = [];
  for (const u of units) {
    // lessons of about 4 items; a short leftover joins the previous lesson
    const chunks = [];
    for (let i = 0; i < u.items.length; i += 4) chunks.push(u.items.slice(i, i + 4));
    if (chunks.length > 1 && chunks[chunks.length - 1].length < 3) chunks[chunks.length - 2].push(...chunks.pop());
    u.lessons = chunks.map((its, n) => ({ id: `${u.code}-L${n + 1}`, unit: u, n: n + 1, items: its, review: false }));
    u.lessons.push({ id: `${u.code}-R`, unit: u, n: chunks.length + 1, items: u.items, review: true });
    for (const l of u.lessons) {
      l.readyItems = l.items.filter((i) => i.entry);
      l.ready = l.review ? l.readyItems.length >= 4 : l.readyItems.length >= Math.min(3, l.items.length);
      lessons.push(l);
    }
  }
  // A lesson is open when every earlier lesson that is ready has been finished
  let blocked = false;
  for (const l of lessons) {
    l.done = Progress.stars(l.id) > 0;
    l.open = l.ready && !blocked;
    if (l.ready && !l.done) blocked = true;
  }
  const current = lessons.find((l) => l.open && !l.done);
  if (current) current.current = true;
  return { units, lessons, items };
}

/* ================= The learning path screen ================= */
const MASCOT = `<svg viewBox="0 0 120 120" class="mascot" aria-hidden="true">
  <circle cx="92" cy="26" r="13" fill="#ffc93c"/>
  <path d="M8 104 Q30 30 60 30 Q90 30 112 104 Z" fill="#1fa36b"/>
  <path d="M30 104 Q44 62 60 62 Q76 62 90 104 Z" fill="#2fc27f" opacity=".7"/>
  <circle cx="48" cy="62" r="9" fill="#fff"/><circle cx="72" cy="62" r="9" fill="#fff"/>
  <circle class="pupil" cx="50" cy="63" r="4.5" fill="#173b2a"/><circle class="pupil" cx="74" cy="63" r="4.5" fill="#173b2a"/>
  <path d="M50 80 Q60 90 70 80" stroke="#173b2a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="78" r="5" fill="#ff8a8a" opacity=".55"/><circle cx="80" cy="78" r="5" fill="#ff8a8a" opacity=".55"/>
</svg>`;

views.learn = () => {
  const { units, lessons, items } = buildCourse();
  const readyCount = items.filter((i) => i.entry).length;
  const goalPct = Math.min(100, Math.round(Progress.todayXp / Progress.goal * 100));
  const header = `
    <div class="learn-stats">
      <div class="stat ${Progress.streak ? 'hot' : ''}"><span class="big">🔥 ${Progress.streak}</span><small>${lt('streak')}</small></div>
      <div class="stat"><span class="big">⭐ ${Progress.xp}</span><small>${lt('xp')}</small></div>
      <div class="stat"><div class="ring" style="--p:${goalPct}"><span>${Progress.todayXp}/${Progress.goal}</span></div><small>${lt('goal')}</small></div>
      <button class="icon-btn sound-btn" id="soundBtn" aria-label="${lt('sound')}">${Progress.sound ? '🔊' : '🔇'}</button>
    </div>
    <div class="course-bar"><div style="width:${Math.round(readyCount / Math.max(1, items.length) * 100)}%"></div></div>
    <p class="muted center small">${lt('wordsReady', readyCount, items.length)}</p>`;
  if (!readyCount) return `<h2 class="page-title">🎓 ${lt('title')}</h2>${header}
    <div class="empty-hero pop-in">${MASCOT}<h3>${lt('emptyTitle')}</h3><p>${lt('emptyText')}</p>
    <button class="btn full" id="guideFirst">${lt('emptyBtn')}</button></div>${unitsHtml(units)}`;
  return `<h2 class="page-title">🎓 ${lt('title')}</h2>${header}
    <div class="btn-row"><button class="btn secondary full" id="practiceBtn">${lt('practice')}</button></div>
    ${unitsHtml(units)}
    <p class="muted center small" style="margin-top:20px">${lt('honesty')}</p>`;
};

function unitsHtml(units) {
  return units.map((u, ui) => `
    <section class="unit" style="--uc:${esc(u.color || '#1fa36b')}">
      <div class="unit-banner slide-in" style="animation-delay:${ui * 60}ms">
        <div><div class="unit-no">${lt('unit', ui + 1)}</div><div class="unit-title">${esc(u.emoji || '')} ${esc(lang === 'bn' ? u.title_bn : u.title_en)}</div>
        <div class="unit-desc">${esc(lang === 'bn' ? u.desc_bn : u.desc_en)}</div></div>
        <button class="guide-btn" data-unit="${esc(u.code)}">${lt('guide')}</button>
      </div>
      <div class="path">${u.lessons.map((l, i) => nodeHtml(l, i)).join('')}</div>
    </section>`).join('');
}
function nodeHtml(l, i) {
  const offset = [0, 46, 70, 46, 0, -46, -70, -46][i % 8];
  const state = l.done ? 'done' : l.current ? 'current' : l.open ? 'open' : !l.ready ? 'needs' : 'locked';
  const icon = l.review ? '🏆' : l.done ? '★' : state === 'needs' ? '✍️' : state === 'locked' ? '🔒' : '★';
  const stars = l.done ? '★'.repeat(Progress.stars(l.id)) + '☆'.repeat(3 - Progress.stars(l.id)) : '';
  return `<div class="node-wrap" style="transform:translateX(${offset}px)">
    ${state === 'current' ? `<div class="start-bubble">${lt('start')}</div>` : ''}
    <button class="node ${state}" data-id="${l.id}" aria-label="${esc(l.review ? lt('review') : lt('lesson', l.n))}">${icon}</button>
    ${stars ? `<div class="node-stars">${stars}</div>` : ''}</div>`;
}

function openSheet(html) {
  closeSheet();
  const s = document.createElement('div'); s.className = 'sheet-backdrop'; s.innerHTML = `<div class="sheet" role="dialog">${html}</div>`;
  s.onclick = (e) => { if (e.target === s) closeSheet(); };
  document.body.appendChild(s); requestAnimationFrame(() => s.classList.add('show'));
  return s;
}
function closeSheet() { const s = $('.sheet-backdrop'); if (s) s.remove(); }

function itemRows(items) {
  CARD_ENTRIES = [];
  return items.map((it) => {
    const i = it.entry ? cardIndex(it.entry) : -1;
    return `<div class="item-row ${it.entry ? 'has' : ''}">
      <div style="flex:1"><div><b>${esc(meaningOf(it))}</b></div>
      ${it.entry ? `<div class="marma-text">${esc(it.entry.marma)}</div>` : `<div class="muted small">${lt('missing')}</div>`}</div>
      ${it.entry ? `<button class="btn small secondary playCard" data-i="${i}">🔊</button>`
                : `<a class="btn small addItem" href="#add" data-code="${esc(it.code)}">${lt('addMarma')}</a>`}</div>`;
  }).join('');
}
function wireItemRows(root, items) {
  wireCards(root);
  $$('.addItem', root).forEach((a) => a.onclick = () => {
    const it = items.find((x) => x.code === a.dataset.code);
    sessionStorage.setItem('prefill', JSON.stringify({ bn: it.bn, en: it.en, cat: it.cat, type: it.type, code: it.code }));
    closeSheet();
  });
}

function wireLearn() {
  const course = buildCourse();
  if ($('#soundBtn')) $('#soundBtn').onclick = () => { Progress.sound = !Progress.sound; $('#soundBtn').textContent = Progress.sound ? '🔊' : '🔇'; Sfx.tap(); };
  if ($('#practiceBtn')) $('#practiceBtn').onclick = () => {
    if (!course.lessons.some((l) => l.done)) { toast(lt('noPractice')); return; }
    location.hash = '#lesson/practice';
  };
  if ($('#guideFirst')) $('#guideFirst').onclick = () => showGuide(course.units[0]);
  $$('.guide-btn').forEach((b) => b.onclick = () => showGuide(course.units.find((u) => u.code === b.dataset.unit)));
  $$('.node').forEach((b) => b.onclick = () => {
    Sfx.tap();
    const l = course.lessons.find((x) => x.id === b.dataset.id);
    const title = `${esc(l.unit.emoji || '')} ${l.review ? lt('review') : lt('lesson', l.n)}`;
    if (!l.ready) {
      const missing = l.items.filter((i) => !i.entry);
      const s = openSheet(`<h3>${title}</h3><div class="note warn">${lt('needWords')}</div><p class="small">${lt('needWordsHelp')}</p>${itemRows(missing)}`);
      wireItemRows(s, missing); return;
    }
    if (!l.open) { toast(lt('locked')); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500); return; }
    const s = openSheet(`<h3>${title}</h3><p class="muted">${lt('items', l.readyItems.length)}</p>
      <div class="chips">${l.readyItems.slice(0, 6).map((i) => `<span class="chip">${esc(meaningOf(i))}</span>`).join('')}</div>
      <button class="btn full" id="goLesson" style="margin-top:12px">${l.done ? lt('again') : lt('start')} ▶</button>`);
    $('#goLesson', s).onclick = () => { closeSheet(); location.hash = '#lesson/' + l.id; };
  });
}
function showGuide(u) {
  const s = openSheet(`<h3>${esc(u.emoji || '')} ${esc(lang === 'bn' ? u.title_bn : u.title_en)}</h3>${itemRows(u.items)}`);
  wireItemRows(s, u.items);
}

/* ================= A lesson ================= */
let L = null; // the lesson being played

function makeExercises(lessonItems, pool, { intro = true, count = 0 } = {}) {
  const ex = [], hasAudio = (it) => !!audioSrc(it.entry);
  const types = (it) => {
    const t = ['meaning', 'marma'];
    if (hasAudio(it)) t.push('listen', 'listen');
    if (it.entry.marma.trim().split(/\s+/).length >= 2) t.push('tiles', 'tiles');
    if (it.entry.marma.length <= 30) t.push('type');
    return t;
  };
  if (count) { // practice / review: random mix, no introductions
    for (let k = 0; k < count; k++) { const it = lessonItems[k % lessonItems.length]; ex.push({ kind: pick(types(it), 1)[0], it }); }
    const out = shuffle(ex);
    if (lessonItems.length >= 3) out.splice(Math.min(4, out.length), 0, { kind: 'match', items: pick(lessonItems, Math.min(4, lessonItems.length)) });
    return out.map((e) => ({ ...e, pool }));
  }
  const second = [];
  for (const it of lessonItems) {
    if (intro && !Progress.seen(it.code)) ex.push({ kind: 'intro', it });
    const [a, b] = pick(types(it), 2);
    ex.push({ kind: a, it }); second.push({ kind: b || 'meaning', it });
  }
  ex.push(...shuffle(second));
  if (lessonItems.length >= 3) ex.splice(Math.max(ex.length - 2, 0), 0, { kind: 'match', items: lessonItems.slice(0, 4) });
  if (lessonItems.some(hasAudio) && navigator.mediaDevices && window.MediaRecorder) ex.push({ kind: 'speak', it: lessonItems.filter(hasAudio)[0] });
  return ex.map((e) => ({ ...e, pool }));
}

function startLesson(id) {
  const course = buildCourse();
  const pool = course.items.filter((i) => i.entry);
  let lesson, exercises;
  if (id === 'practice') {
    const doneItems = course.lessons.filter((l) => l.done).flatMap((l) => l.readyItems);
    if (!doneItems.length) return null;
    lesson = { id: 'practice', title: lt('practiceTitle'), items: doneItems, practice: true };
    exercises = makeExercises(pick(doneItems, 6), pool, { count: 8 });
  } else {
    lesson = course.lessons.find((l) => l.id === id);
    if (!lesson || !lesson.open) return null;
    exercises = lesson.review ? makeExercises(lesson.readyItems, pool, { count: 10 }) : makeExercises(lesson.readyItems, pool);
  }
  return { lesson, queue: exercises, total: exercises.filter((e) => e.kind !== 'intro').length, done: 0, hearts: 5, mistakes: 0, answered: 0, retried: new Set() };
}

views.lesson = (id) => {
  L = startLesson(id);
  if (!L) { setTimeout(() => { location.hash = '#learn'; }, 0); return ''; }
  return `<div class="lesson" id="lesson">
    <div class="lesson-top">
      <button class="icon-btn quit" id="quitBtn" aria-label="close">✖</button>
      <div class="lesson-bar"><div id="lessonFill" style="width:0%"></div></div>
      <div class="hearts" id="hearts">❤️ ${L.hearts}</div>
    </div>
    <div class="lesson-body" id="exBody"></div>
    <div class="lesson-foot" id="exFoot"></div>
  </div>`;
};

function wireLesson() {
  if (!L) return;
  $('#quitBtn').onclick = () => { if (confirm(lt('quit'))) location.hash = '#learn'; };
  nextExercise();
}

function paintTop() {
  $('#lessonFill').style.width = Math.min(100, Math.round(L.done / Math.max(1, L.total) * 100)) + '%';
  $('#hearts').textContent = '❤️ ' + L.hearts;
}

function optionsFor(correct, field, pool, n = 4) {
  const want = norm(correct);
  const others = [...new Map(pool.map((p) => [norm(field(p)), field(p)])).entries()].filter(([k, v]) => k && k !== want && v).map(([, v]) => v);
  return shuffle([correct, ...pick(others, n - 1)]);
}
const marmaOf = (it) => it.entry.marma;
const say = (it) => playEntry(it.entry);

function nextExercise() {
  paintTop();
  const ex = L.queue.shift();
  if (!ex) return finishLesson();
  L.ex = ex; L.answer = null;
  const body = $('#exBody'), foot = $('#exFoot');
  body.classList.remove('ex-in'); void body.offsetWidth; body.classList.add('ex-in');
  foot.className = 'lesson-foot';
  const it = ex.it;
  const checkBtn = `<button class="btn full big" id="checkBtn" disabled>${lt('check')}</button>`;

  if (ex.kind === 'intro') {
    body.innerHTML = `<div class="ex-label">✨ ${it.type === 'sentence' ? lt('newPhrase') : lt('newWord')}</div>
      <div class="intro-card pop-in">
        ${imageSrc(it.entry) ? `<img src="${esc(imageSrc(it.entry))}" class="thumb" alt="">` : ''}
        <div class="marma-big">${esc(marmaOf(it))}</div>
        <div class="intro-meaning">${esc(meaningOf(it))}</div>
        ${audioSrc(it.entry) ? `<button class="speaker-btn" id="introPlay">🔊</button>` : ''}
      </div>`;
    foot.innerHTML = `<button class="btn full big" id="checkBtn">${lt('gotIt')}</button>`;
    if ($('#introPlay')) { $('#introPlay').onclick = () => say(it); setTimeout(() => say(it), 300); }
    $('#checkBtn').onclick = () => { Sfx.tap(); nextExercise(); };
    return;
  }

  if (ex.kind === 'meaning' || ex.kind === 'marma' || ex.kind === 'listen') {
    const askMarma = ex.kind !== 'meaning';
    const correct = askMarma ? marmaOf(it) : meaningOf(it);
    const opts = optionsFor(correct, askMarma ? (p) => p.entry.marma : meaningOf, ex.pool);
    const q = ex.kind === 'meaning' ? `<div class="ex-label">${lt('qMeaning')}</div>
        <div class="prompt-row"><button class="speaker-btn small" id="qPlay">🔊</button><div class="marma-big">${esc(marmaOf(it))}</div></div>`
      : ex.kind === 'marma' ? `<div class="ex-label">${lt('qMarma')}</div><div class="prompt-text">${esc(meaningOf(it))}</div>`
      : `<div class="ex-label">${lt('qListen')}</div><div class="listen-row"><button class="speaker-btn huge" id="qPlay">🔊</button></div>`;
    body.innerHTML = q + `<div class="options">${opts.map((o, i) => `<button class="option ${askMarma ? 'marma-text' : ''}" data-i="${i}" style="animation-delay:${i * 50}ms"><span class="key">${i + 1}</span>${esc(o)}</button>`).join('')}</div>`;
    foot.innerHTML = checkBtn;
    if ($('#qPlay')) { $('#qPlay').onclick = () => say(it); if (ex.kind !== 'marma' && audioSrc(it.entry)) setTimeout(() => say(it), 250); }
    $$('.option').forEach((b) => b.onclick = () => {
      Sfx.tap(); $$('.option').forEach((x) => x.classList.remove('sel')); b.classList.add('sel');
      L.answer = opts[+b.dataset.i]; $('#checkBtn').disabled = false;
      if (askMarma && ex.kind === 'marma' && audioSrc(it.entry) && norm(L.answer) === norm(correct)) { /* no hint before checking */ }
    });
    $('#checkBtn').onclick = () => grade(norm(L.answer) === norm(correct), correct);
    return;
  }

  if (ex.kind === 'tiles') {
    const words = marmaOf(it).trim().split(/\s+/);
    const extra = pick([...new Set(ex.pool.flatMap((p) => p.entry.marma.trim().split(/\s+/)))].filter((w) => !words.map(norm).includes(norm(w))), Math.min(3, Math.max(1, 6 - words.length)));
    const bank = shuffle([...words, ...extra]).map((w, i) => ({ w, i }));
    const chosen = [];
    body.innerHTML = `<div class="ex-label">${lt('qTiles')}</div><div class="prompt-text">${esc(meaningOf(it))}</div>
      <div class="tile-answer" id="tileAnswer"></div><div class="tile-bank" id="tileBank"></div>`;
    foot.innerHTML = checkBtn;
    const paint = () => {
      $('#tileAnswer').innerHTML = chosen.map((c) => `<button class="wtile in" data-i="${c.i}">${esc(c.w)}</button>`).join('');
      $('#tileBank').innerHTML = bank.map((c) => `<button class="wtile ${chosen.includes(c) ? 'used' : ''}" data-i="${c.i}" ${chosen.includes(c) ? 'disabled' : ''}>${esc(c.w)}</button>`).join('');
      $$('#tileBank .wtile').forEach((b) => b.onclick = () => { Sfx.tap(); chosen.push(bank.find((c) => c.i === +b.dataset.i)); paint(); });
      $$('#tileAnswer .wtile').forEach((b) => b.onclick = () => { chosen.splice(chosen.findIndex((c) => c.i === +b.dataset.i), 1); paint(); });
      $('#checkBtn').disabled = !chosen.length;
    };
    paint();
    $('#checkBtn').onclick = () => grade(norm(chosen.map((c) => c.w).join(' ')) === norm(marmaOf(it)), marmaOf(it));
    return;
  }

  if (ex.kind === 'type') {
    body.innerHTML = `<div class="ex-label">${lt('qType')}</div><div class="prompt-text">${esc(meaningOf(it))}</div>
      <textarea id="typeIn" class="type-in" placeholder="${lt('typeHere')}" autocapitalize="off" autocomplete="off" spellcheck="false"></textarea>`;
    foot.innerHTML = checkBtn;
    $('#typeIn').oninput = () => { $('#checkBtn').disabled = !$('#typeIn').value.trim(); };
    $('#typeIn').focus();
    $('#checkBtn').onclick = () => {
      const a = latin($('#typeIn').value), b = latin(marmaOf(it));
      const d = editDistance(a, b), allowed = b.length >= 12 ? 2 : b.length >= 5 ? 1 : 0;
      grade(d <= allowed, marmaOf(it), d > 0 && d <= allowed);
    };
    return;
  }

  if (ex.kind === 'match') {
    const items = ex.items;
    const left = shuffle(items.map((x) => ({ code: x.code, text: x.entry.marma, side: 'm' })));
    const right = shuffle(items.map((x) => ({ code: x.code, text: meaningOf(x), side: 'b' })));
    let sel = null, matched = 0, wrongOnce = false;
    body.innerHTML = `<div class="ex-label">${lt('qMatch')}</div><div class="match-grid">
      <div>${left.map((c) => `<button class="mtile marma-text" data-code="${esc(c.code)}" data-side="m">${esc(c.text)}</button>`).join('')}</div>
      <div>${right.map((c) => `<button class="mtile" data-code="${esc(c.code)}" data-side="b">${esc(c.text)}</button>`).join('')}</div></div>`;
    foot.innerHTML = '';
    $$('.mtile').forEach((b) => b.onclick = () => {
      if (b.classList.contains('ok')) return;
      if (b.dataset.side === 'm') { const it2 = items.find((x) => x.code === b.dataset.code); if (audioSrc(it2.entry)) say(it2); }
      if (!sel || sel.dataset.side === b.dataset.side) { $$('.mtile.sel').forEach((x) => x.classList.remove('sel')); sel = b; b.classList.add('sel'); Sfx.tap(); return; }
      if (sel.dataset.code === b.dataset.code) {
        [sel, b].forEach((x) => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; }); Sfx.ok(); matched++;
        if (matched === items.length) setTimeout(() => grade(!wrongOnce, '', false, true), 350);
      } else {
        [sel, b].forEach((x) => { x.classList.add('bad'); setTimeout(() => x.classList.remove('bad', 'sel'), 450); }); Sfx.bad();
        if (!wrongOnce) { wrongOnce = true; L.hearts = Math.max(0, L.hearts - 1); L.mistakes++; paintTop(); if (!L.hearts) return outOfHearts(); }
      }
      sel = null;
    });
    return;
  }

  if (ex.kind === 'speak') {
    let rec = null, blob = null;
    body.innerHTML = `<div class="ex-label">🗣️ ${lt('qSpeak')}</div>
      <div class="intro-card"><div class="marma-big">${esc(marmaOf(it))}</div><div class="intro-meaning">${esc(meaningOf(it))}</div></div>
      <p class="muted small center">${lt('speakHelp')}</p>
      <div class="btn-row center"><button class="btn secondary" id="tPlay">${lt('teacher')}</button>
      <button class="btn" id="recB">${lt('record')}</button><button class="btn secondary" id="myPlay" disabled>${lt('mine')}</button></div>`;
    foot.innerHTML = `<button class="btn full big" id="checkBtn" disabled>${lt('saidIt')}</button><button class="link-btn" id="skipSpeak">${lt('cantSpeak')}</button>`;
    $('#tPlay').onclick = () => say(it);
    $('#recB').onclick = async () => {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      try {
        const st = await navigator.mediaDevices.getUserMedia({ audio: true }); const ch = [];
        rec = new MediaRecorder(st); rec.ondataavailable = (e) => ch.push(e.data);
        rec.onstop = () => { st.getTracks().forEach((x) => x.stop()); blob = new Blob(ch, { type: rec.mimeType }); $('#recB').textContent = lt('record'); $('#recB').classList.remove('pulse'); $('#myPlay').disabled = false; $('#checkBtn').disabled = false; };
        rec.start(); $('#recB').textContent = lt('stopRec'); $('#recB').classList.add('pulse');
        setTimeout(() => rec && rec.state === 'recording' && rec.stop(), 6000);
      } catch (e) { toast(t('noMic')); }
    };
    $('#myPlay').onclick = () => blob && new Audio(URL.createObjectURL(blob)).play();
    $('#checkBtn').onclick = () => grade(true, '');
    $('#skipSpeak').onclick = () => { L.total = Math.max(1, L.total - 1); nextExercise(); };
  }
}

// Marma in English letters: ignore capitals, accents and punctuation when comparing
const latin = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim();
function editDistance(a, b) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

function grade(ok, correct, almost = false, silent = false) {
  const ex = L.ex, foot = $('#exFoot');
  L.answered++;
  if (ok) {
    L.done++; Sfx.ok();
    foot.className = 'lesson-foot good';
    foot.innerHTML = `<div class="fb"><div class="fb-title">✅ ${pick(lt('praise'), 1)[0]}</div>
      ${almost ? `<div>${lt('almost')} <b class="marma-text">${esc(correct)}</b></div>` : ''}
      ${ex.it && ex.kind !== 'meaning' && ex.kind !== 'speak' ? `<div class="small">${lt('meaning')} ${esc(meaningOf(ex.it))}</div>` : ''}</div>
      <button class="btn full big good" id="contBtn">${lt('cont')}</button>`;
    if (ex.it && audioSrc(ex.it.entry) && ['marma', 'tiles', 'type'].includes(ex.kind)) say(ex.it);
  } else {
    Sfx.bad(); L.mistakes++; L.hearts = Math.max(0, L.hearts - 1);
    $('#exBody').classList.add('shake'); setTimeout(() => $('#exBody') && $('#exBody').classList.remove('shake'), 500);
    foot.className = 'lesson-foot bad';
    foot.innerHTML = `<div class="fb"><div class="fb-title">❌ ${lt('wrong')}</div><div class="fb-answer marma-text">${esc(correct)}</div>
      ${ex.it ? `<div class="small">${lt('meaning')} ${esc(meaningOf(ex.it))}</div>` : ''}</div>
      <button class="btn full big bad" id="contBtn">${lt('cont')}</button>`;
    // Like Duolingo: a missed question comes back once at the end
    const key = ex.kind + (ex.it ? ex.it.code : 'match');
    if (!L.retried.has(key)) { L.retried.add(key); L.queue.push(ex); L.total++; }
    if (ex.it && audioSrc(ex.it.entry)) say(ex.it);
  }
  paintTop();
  $('#contBtn').onclick = () => { if (!L.hearts) return outOfHearts(); nextExercise(); };
  $('#contBtn').focus();
}

function outOfHearts() {
  Sfx.bad();
  $('#exFoot').innerHTML = ''; $('#exFoot').className = 'lesson-foot';
  $('#exBody').innerHTML = `<div class="end-card pop-in">${MASCOT.replace('class="mascot"', 'class="mascot sad"')}
    <h2>💔 ${lt('outTitle')}</h2><p>${lt('outText')}</p>
    <button class="btn full big" id="retryBtn">${lt('retry')}</button>
    <button class="btn secondary full" id="backBtn" style="margin-top:10px">${lt('back')}</button></div>`;
  const id = L.lesson.id;
  $('#retryBtn').onclick = () => { render.last = ''; L = null; location.hash = '#lesson/' + id; if (route() === 'lesson/' + id) render(); };
  $('#backBtn').onclick = () => { location.hash = '#learn'; };
}

function finishLesson() {
  const acc = Math.round(100 * Math.max(0, L.answered - L.mistakes) / Math.max(1, L.answered));
  const stars = L.mistakes <= 1 ? 3 : L.mistakes <= 3 ? 2 : 1;
  const xp = (L.lesson.practice ? 5 : 10) + (L.mistakes === 0 ? 5 : 0);
  const beforeGoal = Progress.todayXp < Progress.goal, beforeStreakDay = Progress.data.lastDay === today();
  Progress.finish(L.lesson.id === 'practice' ? 'practice' : L.lesson.id, stars, xp, L.lesson.items.filter((i) => i.entry).map((i) => i.code));
  Sfx.win(); confetti();
  $('#lessonFill').style.width = '100%';
  $('#exFoot').innerHTML = `<button class="btn full big" id="contBtn">${lt('cont')}</button>`; $('#exFoot').className = 'lesson-foot';
  $('#exBody').innerHTML = `<div class="end-card pop-in">${MASCOT.replace('class="mascot"', 'class="mascot jump"')}
    <h2>🎉 ${lt('doneTitle')}</h2>
    <div class="end-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    <div class="end-stats"><div class="estat xp"><b id="xpCount">0</b><small>⭐ ${lt('earned')}</small></div>
    <div class="estat acc"><b>${acc}%</b><small>🎯 ${lt('accuracy')}</small></div></div>
    ${!beforeStreakDay ? `<div class="end-line">${lt('streakNow', Progress.streak)}</div>` : ''}
    ${beforeGoal && Progress.todayXp >= Progress.goal ? `<div class="end-line">${lt('goalDone')}</div>` : ''}</div>`;
  let n = 0; const timer = setInterval(() => { n++; const el = $('#xpCount'); if (!el || n > xp) return clearInterval(timer); el.textContent = '+' + n; }, 40);
  $('#contBtn').onclick = () => { location.hash = '#learn'; };
}
