/* Marma Translator – Part 1 (web app: opens in any browser)
   Rule of this app: it NEVER invents Marma words. Every Marma sentence comes from a Marma speaker.
   Anything the computer guesses is clearly marked as a guess. */
'use strict';

/* ================= Words for the menus (Bangla + English) ================= */
const T = {
  bn: {
    appTitle: 'মারমা অনুবাদক', switchTo: 'English', home: 'হোম',
    translate: 'অনুবাদ', talk: 'কথা বলুন', phrasebook: 'দরকারি বাক্য', dictionary: 'অভিধান',
    learn: 'মারমা শিখুন', add: 'বাক্য যোগ করুন', soon: 'শীঘ্রই আসছে',
    welcome: 'মারমা ↔ বাংলা ↔ ইংরেজি। যেকোনো ব্রাউজারে খুলুন। একবার খোলার পর ইন্টারনেট ছাড়াও চলে।',
    offline: 'ইন্টারনেট নেই — অ্যাপ তবুও চলছে',
    marma: 'মারমা', bn: 'বাংলা', en: 'ইংরেজি',
    from: 'কোন ভাষা থেকে', typeHere: 'এখানে লিখুন…', doTranslate: 'অনুবাদ করুন',
    checked: '✔ মারমা ভাষাভাষীরা যাচাই করেছেন', mine: 'এই ফোনে যোগ করা — এখনও যাচাই হয়নি',
    notChecked: 'এখনও যাচাই হয়নি', guess: '⚠ কম্পিউটারের অনুমান — ভুল হতে পারে',
    guessExplain: 'শব্দ ধরে ধরে মিলিয়ে বানানো। বাক্য হিসেবে ঠিক না-ও হতে পারে।',
    notFound: 'এটি এখনও আমাদের জানা নেই।', notFoundHelp: 'আপনি মারমা জানলে এটি যোগ করে অ্যাপটিকে সাহায্য করুন।',
    addThis: 'এটি যোগ করুন',
    noMarmaYet: 'মারমা এখনও যোগ হয়নি', addMarma: '＋ মারমা যোগ করুন', play: '▶ শুনুন',
    all: 'সব', cat_greet: 'শুভেচ্ছা', cat_help: 'সাহায্য', cat_health: 'স্বাস্থ্য', cat_market: 'বাজার',
    cat_travel: 'যাতায়াত', cat_family: 'পরিবার', cat_other: 'অন্যান্য',
    phraseNote: 'এই তালিকায় বাংলা ও ইংরেজি বাক্য আছে। মারমা অংশ খালি রাখা হয়েছে — শুধু মারমা ভাষাভাষীরা সেটি পূরণ করবেন।',
    search: 'খুঁজুন…', dictEmpty: 'অভিধানে এখনও কোনো শব্দ নেই।',
    dictEmptyHelp: 'মারমা ভাষাভাষীদের দেওয়া শব্দ যাচাইয়ের পর এখানে আসবে। আমরা নিজে থেকে কোনো মারমা শব্দ বানাই না।',
    addTitle: 'মারমা বাক্য যোগ করুন', marmaSentence: 'মারমা বাক্য', bnMeaning: 'বাংলা অর্থ', enMeaning: 'ইংরেজি অর্থ (জানলে)',
    category: 'বিষয়', yourName: 'আপনার নাম (ইচ্ছা হলে)',
    nameNote: 'নাম শুধু এই ফোনে থাকে। পাঠানোর সময় আপনি চাইলে তবেই যাবে।',
    record: '🎤 নিজের কণ্ঠে রেকর্ড করুন', stop: '⏹ থামান', recording: 'রেকর্ড হচ্ছে…', reRecord: '🎤 আবার রেকর্ড',
    noMic: 'এই ফোনে রেকর্ড করা যাচ্ছে না। মাইক্রোফোনের অনুমতি দিন।',
    save: '💾 সংরক্ষণ করুন', saved: 'সংরক্ষণ হয়েছে ✔', needMarma: 'মারমা বাক্য এবং বাংলা বা ইংরেজি অর্থ লিখুন।',
    mySentences: 'আমার যোগ করা বাক্য', none: 'এখনও কিছু নেই।', del: '🗑 মুছুন', confirmDel: 'এটি মুছে ফেলবেন?',
    send: '📤 যাচাইকারীর কাছে পাঠান',
    sendNote: 'এটি একটি ফাইল বানাবে। হোয়াটসঅ্যাপ, ইমেইল বা ব্লুটুথে যাচাইকারীকে পাঠান। যাচাইয়ের পর বাক্যটি সবার অ্যাপে আসবে।',
    shareName: 'ফাইলে আমার নাম দিন', fileReady: 'ফাইল তৈরি হয়েছে ✔',
    talkSoon: 'কথোপকথন মোড — শীঘ্রই আসছে',
    talkSoonText: 'একজন মারমা ও একজন বাংলা ভাষী কণ্ঠ দিয়ে কথা বলতে পারবেন। প্রথমে যাচাই করা বাক্য ও রেকর্ড করা কণ্ঠ জমা হতে হবে, তাই এটি পরের ধাপে তৈরি হবে।',
    learnSoon: 'মারমা শিখুন — শীঘ্রই আসছে',
    learnSoonText: 'ছোট ছোট মজার পাঠ। পাঠগুলো শুধু যাচাই করা মারমা বাক্য দিয়ে বানানো হবে, তাই বাক্য জমা হলে এটি তৈরি হবে।',
    honesty: 'এই অ্যাপ নিজে থেকে কোনো মারমা শব্দ বানায় না। সব মারমা লেখা ও কণ্ঠ মারমা ভাষাভাষীদের দেওয়া।',
    back: '← ফিরে যান'
  },
  en: {
    appTitle: 'Marma Translator', switchTo: 'বাংলা', home: 'Home',
    translate: 'Translate', talk: 'Talk', phrasebook: 'Phrasebook', dictionary: 'Dictionary',
    learn: 'Learn Marma', add: 'Add a sentence', soon: 'Coming soon',
    welcome: 'Marma ↔ Bangla ↔ English. Opens in any browser. After the first visit it also works without internet.',
    offline: 'No internet — the app still works',
    marma: 'Marma', bn: 'Bangla', en: 'English',
    from: 'Translate from', typeHere: 'Type here…', doTranslate: 'Translate',
    checked: '✔ Checked by Marma speakers', mine: 'Added on this phone — not checked yet',
    notChecked: 'Not checked yet', guess: '⚠ Computer guess — may be wrong',
    guessExplain: 'Made by matching word by word. It may not be a correct sentence.',
    notFound: 'We do not know this one yet.', notFoundHelp: 'If you know Marma, please add it to help the app grow.',
    addThis: 'Add this',
    noMarmaYet: 'Marma not added yet', addMarma: '＋ Add Marma', play: '▶ Listen',
    all: 'All', cat_greet: 'Greetings', cat_help: 'Help', cat_health: 'Health', cat_market: 'Market',
    cat_travel: 'Travel', cat_family: 'Family', cat_other: 'Other',
    phraseNote: 'This list has Bangla and English sentences. The Marma part is left empty on purpose — only Marma speakers will fill it in.',
    search: 'Search…', dictEmpty: 'The dictionary has no words yet.',
    dictEmptyHelp: 'Words given by Marma speakers will appear here after they are checked. We never make up Marma words.',
    addTitle: 'Add a Marma sentence', marmaSentence: 'Marma sentence', bnMeaning: 'Bangla meaning', enMeaning: 'English meaning (if you know)',
    category: 'Topic', yourName: 'Your name (optional)',
    nameNote: 'Your name stays on this phone. It is only sent if you choose.',
    record: '🎤 Record your voice', stop: '⏹ Stop', recording: 'Recording…', reRecord: '🎤 Record again',
    noMic: 'Cannot record on this phone. Please allow the microphone.',
    save: '💾 Save', saved: 'Saved ✔', needMarma: 'Please write the Marma sentence and its Bangla or English meaning.',
    mySentences: 'My sentences', none: 'Nothing yet.', del: '🗑 Delete', confirmDel: 'Delete this?',
    send: '📤 Send to checker',
    sendNote: 'This makes one file. Send it to a checker by WhatsApp, email or Bluetooth. After checking, the sentences will reach everyone\'s app.',
    shareName: 'Put my name in the file', fileReady: 'File is ready ✔',
    talkSoon: 'Talking mode — coming soon',
    talkSoonText: 'A Marma speaker and a Bangla speaker will talk with voice. First we need checked sentences and recorded voices, so this comes in a later part.',
    learnSoon: 'Learn Marma — coming soon',
    learnSoonText: 'Small fun lessons. They will be made only from checked Marma sentences, so this comes once sentences are collected.',
    honesty: 'This app never makes up Marma words. All Marma text and voices come from Marma speakers.',
    back: '← Back'
  }
};
const CATS = ['greet', 'help', 'health', 'market', 'travel', 'family', 'other'];

/* ================= Settings saved on the phone ================= */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
let lang = store.get('lang', 'bn');
const t = (k) => (T[lang] && T[lang][k]) || T.en[k] || k;

/* ================= Small helpers ================= */
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s || '').toLowerCase().normalize('NFC')
  .replace(/[.,!?;:"'()\[\]।৷…“”‘’\-–—_]/g, ' ').replace(/\s+/g, ' ').trim();
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}

/* ================= Data: shared list + this phone's own sentences ================= */
let PHRASES = [], WORDS = [];
async function loadData() {
  try { PHRASES = (await (await fetch('data/phrases.json')).json()).phrases || []; } catch (e) { PHRASES = []; }
  try { WORDS = (await (await fetch('data/dictionary.json')).json()).words || []; } catch (e) { WORDS = []; }
}

// IndexedDB keeps the user's own sentences and voice recordings on the phone
const DB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('marma-app', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('mine', { keyPath: 'id' });
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tr = db.transaction('mine', mode); const st = tr.objectStore('mine');
      const out = fn(st); tr.oncomplete = () => res(out && out.result !== undefined ? out.result : out); tr.onerror = () => rej(tr.error);
    });
  },
  all() { return this.tx('readonly', (s) => s.getAll()); },
  put(item) { return this.tx('readwrite', (s) => s.put(item)); },
  del(id) { return this.tx('readwrite', (s) => s.delete(id)); }
};

/* ================= Screens ================= */
const views = {};

views.home = () => `
  <p class="muted">${t('welcome')}</p>
  <div class="tiles">
    <a class="tile" href="#translate"><span class="emoji">🔁</span>${t('translate')}</a>
    <a class="tile soon" href="#talk"><span class="emoji">🗣️</span>${t('talk')}<small>${t('soon')}</small></a>
    <a class="tile" href="#phrasebook"><span class="emoji">📖</span>${t('phrasebook')}</a>
    <a class="tile" href="#dictionary"><span class="emoji">🔤</span>${t('dictionary')}</a>
    <a class="tile soon" href="#learn"><span class="emoji">🎓</span>${t('learn')}<small>${t('soon')}</small></a>
    <a class="tile" href="#add"><span class="emoji">➕</span>${t('add')}</a>
  </div>
  <div class="note" style="margin-top:16px">${t('honesty')}</div>`;

views.translate = () => {
  const dirs = [['marma', 'bn'], ['marma', 'en'], ['bn', 'marma'], ['en', 'marma']];
  const cur = store.get('dir', 'bn>marma');
  return `
  <h2>🔁 ${t('translate')}</h2>
  <label for="dir">${t('from')}</label>
  <select id="dir">${dirs.map(([a, b]) => `<option value="${a}>${b}" ${cur === a + '>' + b ? 'selected' : ''}>${t(a)} → ${t(b)}</option>`).join('')}</select>
  <label for="src">${t('typeHere').replace('…', '')}</label>
  <textarea id="src" placeholder="${t('typeHere')}"></textarea>
  <div class="btn-row"><button class="btn full" id="goTr">${t('doTranslate')}</button></div>
  <div id="trOut" aria-live="polite"></div>`;
};

async function doTranslate() {
  const [from, to] = $('#dir').value.split('>');
  store.set('dir', from + '>' + to);
  const q = norm($('#src').value);
  const out = $('#trOut');
  if (!q) { out.innerHTML = ''; return; }
  const mine = await DB.all().catch(() => []);
  const pool = [
    ...PHRASES.filter((p) => p.marma).map((p) => ({ ...p, kind: p.status === 'checked' ? 'checked' : 'unchecked' })),
    ...WORDS.map((w) => ({ ...w, kind: w.checked_by ? 'checked' : 'unchecked' })),
    ...mine.map((m) => ({ ...m, kind: 'mine' }))
  ];
  // 1) Exact match of the whole sentence
  const hits = pool.filter((p) => p[from] && p[to] && norm(p[from]) === q);
  if (hits.length) {
    out.innerHTML = hits.map((h) => `
      <div class="card"><div class="result">${esc(h[to])}</div>
      ${h.audio && to === 'marma' ? `<button class="btn small secondary playUrl" data-src="${esc(h.audio)}">${t('play')}</button>` : ''}
      ${h.kind === 'checked' ? `<span class="badge ok">${t('checked')}</span>` : h.kind === 'mine' ? `<span class="badge warn">${t('mine')}</span>` : `<span class="badge warn">${t('notChecked')}</span>`}
      </div>`).join('');
    return;
  }
  // 2) Word-by-word guess from the dictionary (clearly marked as a computer guess)
  const words = q.split(' ');
  const dict = new Map(WORDS.filter((w) => w[from] && w[to]).map((w) => [norm(w[from]), w[to]]));
  const parts = words.map((w) => dict.get(w));
  if (dict.size && parts.some(Boolean)) {
    out.innerHTML = `<div class="card"><div class="result">${parts.map((p, i) => p ? esc(p) : `<span class="missing">[${esc(words[i])}?]</span>`).join(' ')}</div>
      <span class="badge warn">${t('guess')}</span><p class="muted" style="margin-top:8px">${t('guessExplain')}</p></div>`;
    return;
  }
  // 3) Not known yet
  out.innerHTML = `<div class="note warn"><b>${t('notFound')}</b><br>${t('notFoundHelp')}</div>
    <a class="btn secondary" href="#add" id="addFromTr">${t('addThis')}</a>`;
  $('#addFromTr').onclick = () => {
    const txt = $('#src').value.trim();
    sessionStorage.setItem('prefill', JSON.stringify({ [from]: txt }));
  };
}

let phraseCat = 'all';
views.phrasebook = () => `
  <h2>📖 ${t('phrasebook')}</h2>
  <div class="note">${t('phraseNote')}</div>
  <div class="chips">${['all', ...CATS.filter((c) => PHRASES.some((p) => p.cat === c))].map((c) =>
    `<button class="chip ${phraseCat === c ? 'on' : ''}" data-cat="${c}">${c === 'all' ? t('all') : t('cat_' + c)}</button>`).join('')}</div>
  <div id="phraseList">${PHRASES.filter((p) => phraseCat === 'all' || p.cat === phraseCat).map(phraseCard).join('')}</div>`;

function phraseCard(p) {
  const first = lang === 'bn' ? p.bn : p.en, second = lang === 'bn' ? p.en : p.bn;
  return `<div class="card">
    <div class="line"><b>${esc(first)}</b></div>
    <div class="line muted">${esc(second)}</div>
    <div class="line">${p.marma ? `<span class="marma">${esc(p.marma)}</span>` : `<span class="missing">${t('noMarmaYet')}</span>`}</div>
    <div class="btn-row">
      ${p.audio ? `<button class="btn small secondary playUrl" data-src="${esc(p.audio)}">${t('play')}</button>` : ''}
      ${p.marma ? `<span class="badge ${p.status === 'checked' ? 'ok' : 'warn'}">${p.status === 'checked' ? t('checked') : t('notChecked')}</span>`
               : `<a class="btn small secondary addMarma" href="#add" data-bn="${esc(p.bn)}" data-en="${esc(p.en)}" data-cat="${esc(p.cat)}">${t('addMarma')}</a>`}
    </div></div>`;
}

views.dictionary = () => `
  <h2>🔤 ${t('dictionary')}</h2>
  ${WORDS.length ? `<input type="search" id="dq" placeholder="${t('search')}" aria-label="${t('search')}"><div id="dList"></div>`
                 : `<div class="note"><b>${t('dictEmpty')}</b><br>${t('dictEmptyHelp')}</div>`}`;

function renderDict() {
  const q = norm(($('#dq') || {}).value);
  const list = WORDS.filter((w) => !q || [w.marma, w.bn, w.en].some((x) => norm(x).includes(q))).slice(0, 200);
  $('#dList').innerHTML = list.map((w) => `<div class="card"><span class="marma">${esc(w.marma)}</span>
    <div class="line">${esc(w.bn)}</div><div class="line muted">${esc(w.en)}</div>
    <span class="badge ${w.checked_by ? 'ok' : 'warn'}">${w.checked_by ? t('checked') : t('notChecked')}</span></div>`).join('') || `<p class="muted">${t('none')}</p>`;
}

views.add = () => `
  <h2>➕ ${t('addTitle')}</h2>
  <label for="fMarma">${t('marmaSentence')} *</label><textarea id="fMarma"></textarea>
  <label for="fBn">${t('bnMeaning')}</label><input type="text" id="fBn">
  <label for="fEn">${t('enMeaning')}</label><input type="text" id="fEn">
  <label for="fCat">${t('category')}</label>
  <select id="fCat">${CATS.map((c) => `<option value="${c}">${t('cat_' + c)}</option>`).join('')}</select>
  <label for="fName">${t('yourName')}</label><input type="text" id="fName" value="${esc(store.get('myName', ''))}">
  <p class="muted" style="font-size:.85rem">${t('nameNote')}</p>
  <div class="btn-row"><button class="btn secondary" id="recBtn">${t('record')}</button><span id="recState"></span></div>
  <audio id="recPreview" controls hidden style="width:100%"></audio>
  <div class="btn-row"><button class="btn full" id="saveBtn">${t('save')}</button></div>
  <h3>${t('mySentences')}</h3>
  <div id="mineList"></div>
  <div id="sendBox"></div>`;

let recorder = null, recChunks = [], recBlob = null;
async function toggleRecord() {
  const btn = $('#recBtn'), state = $('#recState');
  if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recChunks = []; recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => e.data.size && recChunks.push(e.data);
    recorder.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop());
      recBlob = new Blob(recChunks, { type: recorder.mimeType || 'audio/webm' });
      const a = $('#recPreview'); a.src = URL.createObjectURL(recBlob); a.hidden = false;
      btn.textContent = t('reRecord'); state.innerHTML = '';
    };
    recorder.start();
    btn.textContent = t('stop'); state.innerHTML = `<span class="rec-dot"></span> ${t('recording')}`;
    setTimeout(() => recorder && recorder.state === 'recording' && recorder.stop(), 30000); // max 30 seconds
  } catch (e) { toast(t('noMic')); }
}

async function saveMine() {
  const marma = $('#fMarma').value.trim(), bn = $('#fBn').value.trim(), en = $('#fEn').value.trim();
  if (!marma || (!bn && !en)) { toast(t('needMarma')); return; }
  store.set('myName', $('#fName').value.trim());
  await DB.put({ id: 'm' + Date.now(), marma, bn, en, cat: $('#fCat').value, audioBlob: recBlob, created: new Date().toISOString() });
  recBlob = null; toast(t('saved')); render();
}

async function renderMine() {
  const mine = (await DB.all().catch(() => [])).sort((a, b) => b.created.localeCompare(a.created));
  $('#mineList').innerHTML = mine.length ? mine.map((m) => `<div class="card">
      <span class="marma">${esc(m.marma)}</span>
      <div class="line">${esc(m.bn)}</div><div class="line muted">${esc(m.en)}</div>
      <span class="badge warn">${t('mine')}</span>
      <div class="btn-row">${m.audioBlob ? `<button class="btn small secondary playMine" data-id="${m.id}">${t('play')}</button>` : ''}
      <button class="btn small danger delMine" data-id="${m.id}">${t('del')}</button></div></div>`).join('')
    : `<p class="muted">${t('none')}</p>`;
  $('#sendBox').innerHTML = mine.length ? `<div class="note">${t('sendNote')}</div>
      <label class="check"><input type="checkbox" id="shareName"> ${t('shareName')}</label>
      <div class="btn-row"><button class="btn full" id="sendBtn">${t('send')}</button></div>` : '';
  document.querySelectorAll('.playMine').forEach((b) => b.onclick = () => {
    const m = mine.find((x) => x.id === b.dataset.id); new Audio(URL.createObjectURL(m.audioBlob)).play();
  });
  document.querySelectorAll('.delMine').forEach((b) => b.onclick = async () => {
    if (confirm(t('confirmDel'))) { await DB.del(b.dataset.id); renderMine(); }
  });
  if ($('#sendBtn')) $('#sendBtn').onclick = () => exportMine(mine);
}

const blobToDataURL = (b) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); });
async function exportMine(mine) {
  const items = [];
  for (const m of mine) items.push({ marma: m.marma, bn: m.bn, en: m.en, cat: m.cat, created: m.created, audio: m.audioBlob ? await blobToDataURL(m.audioBlob) : '' });
  const payload = { app: 'marma-translator', format: 1, exported: new Date().toISOString(),
    contributor: $('#shareName').checked ? store.get('myName', '') : '', items };
  const name = 'marma-sentences-' + new Date().toISOString().slice(0, 10) + '.json';
  const file = new File([JSON.stringify(payload)], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; a.click();
  toast(t('fileReady'));
}

views.talk = () => `<h2>🗣️ ${t('talkSoon')}</h2><div class="note">${t('talkSoonText')}</div><a class="btn secondary" href="#home">${t('back')}</a>`;
views.learn = () => `<h2>🎓 ${t('learnSoon')}</h2><div class="note">${t('learnSoonText')}</div><a class="btn secondary" href="#home">${t('back')}</a>`;

/* ================= Page switching ================= */
function render() {
  const name = (location.hash || '#home').slice(1);
  const view = views[name] || views.home;
  document.documentElement.lang = lang;
  $('#appTitle').textContent = t('appTitle');
  $('#langBtn').textContent = t('switchTo');
  $('#homeBtn').setAttribute('aria-label', t('home'));
  $('#app').innerHTML = view();
  wire(name);
}

function wire(name) {
  document.querySelectorAll('.playUrl').forEach((b) => b.onclick = () => new Audio(b.dataset.src).play().catch(() => {}));
  if (name === 'translate') {
    $('#goTr').onclick = doTranslate;
    $('#dir').onchange = () => { store.set('dir', $('#dir').value); $('#trOut').innerHTML = ''; };
  }
  if (name === 'phrasebook') {
    document.querySelectorAll('.chip').forEach((c) => c.onclick = () => { phraseCat = c.dataset.cat; render(); });
    document.querySelectorAll('.addMarma').forEach((a) => a.onclick = () =>
      sessionStorage.setItem('prefill', JSON.stringify({ bn: a.dataset.bn, en: a.dataset.en, cat: a.dataset.cat })));
  }
  if (name === 'dictionary' && WORDS.length) { $('#dq').oninput = renderDict; renderDict(); }
  if (name === 'add') {
    const pre = JSON.parse(sessionStorage.getItem('prefill') || '{}'); sessionStorage.removeItem('prefill');
    if (pre.marma) $('#fMarma').value = pre.marma;
    if (pre.bn) $('#fBn').value = pre.bn;
    if (pre.en) $('#fEn').value = pre.en;
    if (pre.cat) $('#fCat').value = pre.cat;
    $('#recBtn').onclick = toggleRecord; $('#saveBtn').onclick = saveMine; renderMine();
  }
  $('#app').focus({ preventScroll: true }); window.scrollTo(0, 0);
}

/* ================= Top bar buttons, theme, offline notice ================= */

function isDark() {
  const th = document.documentElement.dataset.theme;
  return th ? th === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}
function paintThemeBtn() { $('#themeBtn').textContent = isDark() ? '☀️' : '🌙'; }
$('#themeBtn').onclick = () => { const th = isDark() ? 'light' : 'dark'; document.documentElement.dataset.theme = th; store.set('theme', th); paintThemeBtn(); };
$('#langBtn').onclick = () => { lang = lang === 'bn' ? 'en' : 'bn'; store.set('lang', lang); render(); };
$('#homeBtn').onclick = () => { location.hash = '#home'; };

function paintOffline() { const bar = $('#offlineBar'); bar.hidden = navigator.onLine; bar.textContent = t('offline'); }
window.addEventListener('online', paintOffline); window.addEventListener('offline', paintOffline);
window.addEventListener('hashchange', render);

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

loadData().then(() => { paintThemeBtn(); paintOffline(); render(); });
