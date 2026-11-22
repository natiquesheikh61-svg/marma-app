/* Marma Translator – Part 2 (web app: opens in any browser, works offline after the first visit)
   Rule of this app: it NEVER invents Marma words. Every Marma sentence comes from a Marma speaker.
   Anything the computer guesses is clearly marked as a guess. */
'use strict';

/* ================= Words for the menus (Bangla + English) ================= */
const T = {
  bn: {
    appTitle: 'মারমা অনুবাদক', switchTo: 'English', home: 'হোম',
    translate: 'অনুবাদ', talk: 'কথা বলুন', phrasebook: 'দরকারি বাক্য', dictionary: 'অভিধান',
    learn: 'মারমা শিখুন', add: 'যোগ করুন', soon: 'শীঘ্রই আসছে', checker: 'যাচাইকারী',
    welcome: 'মারমা ↔ বাংলা ↔ ইংরেজি। যেকোনো ব্রাউজারে খুলুন। একবার খোলার পর ইন্টারনেট ছাড়াও চলে।',
    offline: 'ইন্টারনেট নেই — অ্যাপ তবুও চলছে',
    dataMissing: 'ডেটা ফাইল পাওয়া যায়নি। GitHub-এ "data" ফোল্ডারটি আপলোড হয়েছে কি না দেখুন।',
    marma: 'মারমা', bn: 'বাংলা', en: 'ইংরেজি',
    stats: (s, w) => `মারমা বাক্য: ${s} · মারমা শব্দ: ${w}`,
    from: 'কোন ভাষা থেকে', typeHere: 'এখানে লিখুন বা 🎤 চাপুন…', doTranslate: 'অনুবাদ করুন',
    suggestions: 'এগুলোর মধ্যে কোনটি? চাপ দিন:',
    checked: '✔ মারমা ভাষাভাষীরা যাচাই করেছেন', mine: 'এই ফোনে যোগ করা — এখনও যাচাই হয়নি',
    notChecked: 'এখনও যাচাই হয়নি', guess: '⚠ কম্পিউটারের অনুমান — ভুল হতে পারে',
    guessExplain: 'শব্দ ধরে ধরে মিলিয়ে বানানো। বাক্য হিসেবে ঠিক না-ও হতে পারে।',
    similar: '≈ হুবহু মেলেনি — সবচেয়ে কাছের বাক্যটি দেখানো হলো',
    youMeant: 'আমাদের জানা বাক্য:',
    inListNoMarma: 'এই বাক্যটি তালিকায় আছে, কিন্তু এর মারমা এখনও কেউ যোগ করেননি।',
    notFound: 'এটি এখনও আমাদের জানা নেই।', notFoundHelp: 'আপনি মারমা জানলে এটি যোগ করে অ্যাপটিকে সাহায্য করুন।',
    addThis: 'এটি যোগ করুন',
    noMarmaYet: 'মারমা এখনও যোগ হয়নি', addMarma: '＋ মারমা যোগ করুন', play: '▶ শুনুন', speak: '🔊 শুনুন',
    noVoiceYet: 'এখনও কারও কণ্ঠ রেকর্ড হয়নি',
    all: 'সব', cat_greet: 'শুভেচ্ছা', cat_help: 'সাহায্য', cat_health: 'স্বাস্থ্য', cat_market: 'বাজার',
    cat_travel: 'যাতায়াত', cat_family: 'পরিবার', cat_other: 'অন্যান্য',
    phraseNote: 'এই তালিকায় বাংলা ও ইংরেজি বাক্য আছে। মারমা অংশ শুধু মারমা ভাষাভাষীরা পূরণ করবেন।',
    search: 'মারমা, বাংলা বা ইংরেজিতে খুঁজুন…', words: 'শব্দ', sentences: 'বাক্য',
    dictEmpty: 'অভিধানে এখনও কোনো মারমা শব্দ নেই।',
    dictEmptyHelp: 'মারমা ভাষাভাষীরা শব্দ যোগ করলে এবং যাচাইকারী অনুমোদন দিলে এখানে আসবে। আমরা নিজে থেকে কোনো মারমা শব্দ বানাই না।',
    addWord: '＋ শব্দ যোগ করুন', noResults: 'কিছু পাওয়া যায়নি।',
    addTitle: 'মারমা শব্দ বা বাক্য যোগ করুন', kind: 'কী যোগ করবেন?', kindSentence: 'বাক্য', kindWord: 'একটি শব্দ',
    marmaText: 'মারমা (মারমা ভাষায় লিখুন)', bnMeaning: 'বাংলা অর্থ', enMeaning: 'ইংরেজি অর্থ (জানলে)',
    category: 'বিষয়', yourName: 'আপনার নাম (ইচ্ছা হলে)',
    nameNote: 'নাম শুধু এই ফোনে থাকে। পাঠানোর সময় আপনি চাইলে তবেই যাবে।',
    record: '🎤 নিজের কণ্ঠে রেকর্ড করুন', stop: '⏹ থামান', recording: 'রেকর্ড হচ্ছে…', reRecord: '🎤 আবার রেকর্ড',
    noMic: 'রেকর্ড করা যাচ্ছে না। মাইক্রোফোনের অনুমতি দিন।',
    save: '💾 সংরক্ষণ করুন', saved: 'সংরক্ষণ হয়েছে ✔', needMarma: 'মারমা লেখা এবং বাংলা বা ইংরেজি অর্থ লিখুন।',
    mySentences: 'আমার যোগ করা শব্দ ও বাক্য', none: 'এখনও কিছু নেই।', del: '🗑 মুছুন', confirmDel: 'এটি মুছে ফেলবেন?',
    send: '📤 যাচাইকারীর কাছে পাঠান',
    sendNote: 'এটি একটি ফাইল বানাবে। হোয়াটসঅ্যাপ, ইমেইল বা ব্লুটুথে যাচাইকারীকে পাঠান। যাচাইয়ের পর এটি সবার অ্যাপে আসবে।',
    shareName: 'ফাইলে আমার নাম দিন', fileReady: 'ফাইল তৈরি হয়েছে ✔',
    forCheckers: '✅ যাচাইকারীদের পাতা',
    // Talk
    talkTitle: 'কথা বলুন', bnSpeaker: 'বাংলা ভাষী', mmSpeaker: 'মারমা ভাষী',
    pressSpeak: '🎤 বাংলায় বলুন', listening: 'শুনছি… এখন বলুন',
    heard: 'শোনা গেছে:', orPick: 'অথবা নিচে থেকে একটি বাক্য বেছে নিন',
    pickMarma: 'নিচ থেকে আপনার মারমা বাক্যটি চাপুন। ফোন বাংলায় বলে দেবে।',
    talkHelp: 'কম্পিউটার এখনও মারমা কথা বুঝতে পারে না। তাই মারমা ভাষী তালিকা থেকে বাক্য বেছে নেবেন।',
    talkNoData: 'এখনও কোনো মারমা বাক্য যোগ হয়নি। আগে "যোগ করুন" পাতায় মারমা বাক্য যোগ করুন, তারপর এখানে কথা বলা যাবে।',
    micNeedsNet: 'কণ্ঠ চেনার জন্য ইন্টারনেট লাগে। ইন্টারনেট না থাকলে বাক্য বেছে নিন।',
    noSR: 'এই ব্রাউজারে কণ্ঠ চেনা যায় না। Android-এ Chrome ব্যবহার করুন, বা লিখে দিন।',
    srError: 'কণ্ঠ বোঝা যায়নি। আবার চেষ্টা করুন, বা লিখে দিন।',
    noBnVoice: 'এই ফোনে বাংলা কণ্ঠ নেই। ফোনের Settings → Text-to-speech-এ বাংলা যোগ করুন।',
    privacyMic: '🎤 চাপলে আপনার কণ্ঠ Google-এর কাছে যায় লেখা বানাতে।',
    // Checker
    checkTitle: 'যাচাইকারীদের পাতা',
    checkIntro: 'মানুষের পাঠানো ফাইল এখানে খুলুন। প্রতিটি মারমা লেখা ও কণ্ঠ মন দিয়ে দেখুন। ঠিক হলে অনুমোদন দিন। তারপর নিচের দুটি বোতাম চাপুন এবং ফাইল দুটি GitHub-এর data ফোল্ডারে আপলোড করুন।',
    openFiles: '📂 পাঠানো ফাইল খুলুন', reviewerName: 'আপনার নাম (যাচাইকারী)',
    waiting: 'যাচাইয়ের অপেক্ষায়', approved: 'অনুমোদিত (এই ফোনে)', approve: '✔ ঠিক আছে', reject: '✖ বাদ দিন',
    imported: (n) => `${n}টি নতুন জিনিস এসেছে`, badFile: 'এই ফাইলটি এই অ্যাপের নয়।',
    exportData: 'অনুমোদনের পর দুটি ফাইলই নামান', exportDone: 'phrases.json ও dictionary.json নামানো হয়েছে। এখন GitHub-এ data ফোল্ডারে আপলোড করুন।',
    needReviewer: 'আগে যাচাইকারীর নাম লিখুন।', nothingApproved: 'এখনও কিছু অনুমোদন হয়নি।',
    from_: 'পাঠিয়েছেন:', anon: 'নাম নেই',
    learnSoon: 'মারমা শিখুন — শীঘ্রই আসছে',
    learnSoonText: 'ছোট ছোট মজার পাঠ। পাঠগুলো শুধু যাচাই করা মারমা বাক্য দিয়ে বানানো হবে, তাই বাক্য জমা হলে এটি তৈরি হবে।',
    honesty: 'এই অ্যাপ নিজে থেকে কোনো মারমা শব্দ বানায় না। সব মারমা লেখা ও কণ্ঠ মারমা ভাষাভাষীদের দেওয়া।',
    back: '← ফিরে যান'
  },
  en: {
    appTitle: 'Marma Translator', switchTo: 'বাংলা', home: 'Home',
    translate: 'Translate', talk: 'Talk', phrasebook: 'Phrasebook', dictionary: 'Dictionary',
    learn: 'Learn Marma', add: 'Add', soon: 'Coming soon', checker: 'Checker',
    welcome: 'Marma ↔ Bangla ↔ English. Opens in any browser. After the first visit it also works without internet.',
    offline: 'No internet — the app still works',
    dataMissing: 'Data files not found. Check that the "data" folder was uploaded to GitHub.',
    marma: 'Marma', bn: 'Bangla', en: 'English',
    stats: (s, w) => `Marma sentences: ${s} · Marma words: ${w}`,
    from: 'Translate from', typeHere: 'Type here or press 🎤…', doTranslate: 'Translate',
    suggestions: 'Did you mean one of these? Tap one:',
    checked: '✔ Checked by Marma speakers', mine: 'Added on this phone — not checked yet',
    notChecked: 'Not checked yet', guess: '⚠ Computer guess — may be wrong',
    guessExplain: 'Made by matching word by word. It may not be a correct sentence.',
    similar: '≈ Not an exact match — showing the closest sentence we know',
    youMeant: 'Sentence we know:',
    inListNoMarma: 'This sentence is in our list, but nobody has added its Marma yet.',
    notFound: 'We do not know this one yet.', notFoundHelp: 'If you know Marma, please add it to help the app grow.',
    addThis: 'Add this',
    noMarmaYet: 'Marma not added yet', addMarma: '＋ Add Marma', play: '▶ Listen', speak: '🔊 Speak',
    noVoiceYet: 'No voice recorded yet',
    all: 'All', cat_greet: 'Greetings', cat_help: 'Help', cat_health: 'Health', cat_market: 'Market',
    cat_travel: 'Travel', cat_family: 'Family', cat_other: 'Other',
    phraseNote: 'This list has Bangla and English sentences. Only Marma speakers fill in the Marma part.',
    search: 'Search in Marma, Bangla or English…', words: 'Words', sentences: 'Sentences',
    dictEmpty: 'The dictionary has no Marma words yet.',
    dictEmptyHelp: 'Words appear here after Marma speakers add them and a checker approves them. We never make up Marma words.',
    addWord: '＋ Add a word', noResults: 'Nothing found.',
    addTitle: 'Add a Marma word or sentence', kind: 'What are you adding?', kindSentence: 'Sentence', kindWord: 'One word',
    marmaText: 'Marma (write in Marma)', bnMeaning: 'Bangla meaning', enMeaning: 'English meaning (if you know)',
    category: 'Topic', yourName: 'Your name (optional)',
    nameNote: 'Your name stays on this phone. It is only sent if you choose.',
    record: '🎤 Record your voice', stop: '⏹ Stop', recording: 'Recording…', reRecord: '🎤 Record again',
    noMic: 'Cannot record. Please allow the microphone.',
    save: '💾 Save', saved: 'Saved ✔', needMarma: 'Please write the Marma and its Bangla or English meaning.',
    mySentences: 'My words and sentences', none: 'Nothing yet.', del: '🗑 Delete', confirmDel: 'Delete this?',
    send: '📤 Send to checker',
    sendNote: 'This makes one file. Send it to a checker by WhatsApp, email or Bluetooth. After checking, it will reach everyone\'s app.',
    shareName: 'Put my name in the file', fileReady: 'File is ready ✔',
    forCheckers: '✅ Page for checkers',
    talkTitle: 'Talk', bnSpeaker: 'Bangla speaker', mmSpeaker: 'Marma speaker',
    pressSpeak: '🎤 Speak in Bangla', listening: 'Listening… speak now',
    heard: 'Heard:', orPick: 'Or choose a sentence below',
    pickMarma: 'Tap your Marma sentence below. The phone will say it in Bangla.',
    talkHelp: 'Computers cannot understand spoken Marma yet, so the Marma speaker chooses from the list.',
    talkNoData: 'No Marma sentences have been added yet. First add Marma sentences on the "Add" page, then you can talk here.',
    micNeedsNet: 'Voice recognition needs internet. Without internet, choose a sentence instead.',
    noSR: 'This browser cannot recognise voice. Use Chrome on Android, or type instead.',
    srError: 'Could not understand. Please try again, or type.',
    noBnVoice: 'This phone has no Bangla voice. Add Bangla in the phone\'s Settings → Text-to-speech.',
    privacyMic: '🎤 When you press the mic, your voice is sent to Google to turn it into text.',
    checkTitle: 'Page for checkers',
    checkIntro: 'Open the files people sent you. Look at each Marma text and listen to each voice carefully. Approve only what is correct. Then press the two buttons at the bottom and upload both files into the data folder on GitHub.',
    openFiles: '📂 Open sent files', reviewerName: 'Your name (checker)',
    waiting: 'Waiting for checking', approved: 'Approved (on this phone)', approve: '✔ Correct', reject: '✖ Remove',
    imported: (n) => `${n} new items arrived`, badFile: 'This file is not from this app.',
    exportData: 'After approving, download both files', exportDone: 'phrases.json and dictionary.json downloaded. Now upload them into the data folder on GitHub.',
    needReviewer: 'Please write the checker\'s name first.', nothingApproved: 'Nothing approved yet.',
    from_: 'Sent by:', anon: 'no name',
    learnSoon: 'Learn Marma — coming soon',
    learnSoonText: 'Small fun lessons. They will be made only from checked Marma sentences, so this comes once sentences are collected.',
    honesty: 'This app never makes up Marma words. All Marma text and voices come from Marma speakers.',
    back: '← Back'
  }
};
const CATS = ['greet', 'help', 'health', 'market', 'travel', 'family', 'other'];
const SPEECH_LANG = { bn: 'bn-BD', en: 'en-US' };

/* ================= Settings saved on the phone ================= */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
let lang = store.get('lang', 'bn');
const t = (k, ...a) => { const v = (T[lang] && T[lang][k]) ?? T.en[k] ?? k; return typeof v === 'function' ? v(...a) : v; };

/* ================= Small helpers ================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s || '').toLowerCase().normalize('NFC')
  .replace(/[.,!?;:"'()\[\]।৷…“”‘’\-–—_၊။]/g, ' ').replace(/___/g, ' ').replace(/\s+/g, ' ').trim();
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 3200);
}
// How alike two texts are (0 = nothing alike, 1 = the same). Used to find the closest known sentence.
function similarity(a, b) {
  a = norm(a); b = norm(b);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const grams = (s) => { const g = new Map(); const x = ' ' + s + ' '; for (let i = 0; i < x.length - 1; i++) { const k = x.slice(i, i + 2); g.set(k, (g.get(k) || 0) + 1); } return g; };
  const A = grams(a), B = grams(b); let both = 0, total = 0;
  for (const [k, n] of A) { both += Math.min(n, B.get(k) || 0); total += n; }
  for (const n of B.values()) total += n;
  return (2 * both) / total;
}

/* ================= Storage on the phone (IndexedDB) ================= */
const DB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('marma-app', 2);
      r.onupgradeneeded = () => {
        for (const name of ['mine', 'inbox', 'approved']) if (!r.result.objectStoreNames.contains(name)) r.result.createObjectStore(name, { keyPath: 'id' });
      };
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async run(storeName, mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tr = db.transaction(storeName, mode); const req = fn(tr.objectStore(storeName));
      tr.oncomplete = () => res(req ? req.result : undefined); tr.onerror = () => rej(tr.error);
    });
  },
  all(s) { return this.run(s, 'readonly', (st) => st.getAll()).catch(() => []); },
  put(s, item) { return this.run(s, 'readwrite', (st) => st.put(item)); },
  del(s, id) { return this.run(s, 'readwrite', (st) => st.delete(id)); }
};

/* ================= All data together ================= */
let PHRASES = [], WORDS = [], MINE = [], APPROVED = [], DATA_OK = true;
async function loadData() {
  DATA_OK = true;
  try { PHRASES = (await (await fetch('data/phrases.json')).json()).phrases || []; } catch (e) { PHRASES = []; DATA_OK = false; }
  try { WORDS = (await (await fetch('data/dictionary.json')).json()).words || []; } catch (e) { WORDS = []; DATA_OK = false; }
  await loadLocal();
}
async function loadLocal() { MINE = await DB.all('mine'); APPROVED = await DB.all('approved'); }

// Every known entry, each marked with how trustworthy it is: 'checked', 'unchecked' or 'mine'
function allEntries() {
  const out = [], seen = new Set();
  const add = (e, kind, type) => {
    const key = [norm(e.marma), norm(e.bn), norm(e.en)].join('|');
    if (seen.has(key)) return; seen.add(key);
    out.push({ ...e, kind, type: e.type || type });
  };
  PHRASES.forEach((p) => add(p, p.marma ? (p.status === 'checked' ? 'checked' : 'unchecked') : 'empty', 'sentence'));
  WORDS.forEach((w) => add(w, w.checked_by ? 'checked' : 'unchecked', 'word'));
  APPROVED.forEach((a) => add(a, 'checked', a.type || 'sentence'));
  MINE.forEach((m) => add(m, 'mine', m.type || 'sentence'));
  return out;
}
const withMarma = () => allEntries().filter((e) => e.marma);
const audioSrc = (e) => e.audio || (e.audioBlob ? URL.createObjectURL(e.audioBlob) : '');

function badge(kind) {
  if (kind === 'checked') return `<span class="badge ok">${t('checked')}</span>`;
  if (kind === 'mine') return `<span class="badge warn">${t('mine')}</span>`;
  return `<span class="badge warn">${t('notChecked')}</span>`;
}

/* ================= Voice: listen (speech-to-text) and speak (text-to-speech) ================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function listen(code) {
  return new Promise((resolve, reject) => {
    if (!SR) return reject('nosr');
    if (!navigator.onLine) return reject('offline');
    const r = new SR(); r.lang = code; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (e) => resolve(e.results[0][0].transcript);
    r.onerror = (e) => reject(e.error || 'error');
    r.onend = () => reject('noresult');
    r.start();
  });
}
function micErrorText(err) { return err === 'nosr' ? t('noSR') : err === 'offline' ? t('micNeedsNet') : t('srError'); }

function speak(text, which) {
  if (!('speechSynthesis' in window)) { toast(t('noBnVoice')); return; }
  const code = SPEECH_LANG[which];
  const u = new SpeechSynthesisUtterance(text); u.lang = code; u.rate = 0.9;
  const voice = speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(which));
  if (voice) u.voice = voice; else if (which === 'bn') toast(t('noBnVoice'));
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
if ('speechSynthesis' in window) speechSynthesis.getVoices(); // starts loading the voice list early

function playEntry(e) {
  const src = audioSrc(e);
  if (src) new Audio(src).play().catch(() => {}); else toast(t('noVoiceYet'));
}
// Reads aloud whatever language the result is in: Marma = recorded human voice, Bangla/English = phone voice
function sayResult(e, which) { if (which === 'marma') playEntry(e); else speak(e[which], which); }

/* ================= Finding the right translation ================= */
function findMatches(query, from) {
  const q = norm(query); if (!q) return [];
  return allEntries().filter((e) => e[from])
    .map((e) => { const n = norm(e[from]); return { e, score: n === q ? 1 : Math.max(similarity(q, n), n.includes(q) && q.length >= 2 ? 0.7 : 0) }; })
    .filter((m) => m.score >= 0.45)
    .sort((a, b) => b.score - a.score || (b.e.marma ? 1 : 0) - (a.e.marma ? 1 : 0));
}

/* ================= Screens ================= */
const views = {};

views.home = () => {
  const mm = withMarma();
  return `
  <p class="muted">${t('welcome')}</p>
  ${DATA_OK ? '' : `<div class="note warn">${t('dataMissing')}</div>`}
  <div class="tiles">
    <a class="tile" href="#translate"><span class="emoji">🔁</span>${t('translate')}</a>
    <a class="tile" href="#talk"><span class="emoji">🗣️</span>${t('talk')}</a>
    <a class="tile" href="#phrasebook"><span class="emoji">📖</span>${t('phrasebook')}</a>
    <a class="tile" href="#dictionary"><span class="emoji">🔤</span>${t('dictionary')}</a>
    <a class="tile soon" href="#learn"><span class="emoji">🎓</span>${t('learn')}<small>${t('soon')}</small></a>
    <a class="tile" href="#add"><span class="emoji">➕</span>${t('add')}</a>
  </div>
  <p class="muted" style="text-align:center;margin-top:12px">${t('stats', mm.filter((e) => e.type !== 'word').length, mm.filter((e) => e.type === 'word').length)}</p>
  <div class="note">${t('honesty')}</div>`;
};

/* ---------- Translate ---------- */
views.translate = () => {
  const dirs = [['bn', 'marma'], ['en', 'marma'], ['marma', 'bn'], ['marma', 'en']];
  const cur = store.get('dir', 'bn>marma');
  const from = cur.split('>')[0];
  return `
  <h2>🔁 ${t('translate')}</h2>
  <label for="dir">${t('from')}</label>
  <select id="dir">${dirs.map(([a, b]) => `<option value="${a}>${b}" ${cur === a + '>' + b ? 'selected' : ''}>${t(a)} → ${t(b)}</option>`).join('')}</select>
  <label for="src">${t('typeHere').replace(/ বা .*| or .*/, '')}</label>
  <textarea id="src" placeholder="${t('typeHere')}"></textarea>
  <div class="btn-row">
    ${from !== 'marma' ? `<button class="btn secondary" id="micTr" aria-label="mic">🎤</button>` : ''}
    <button class="btn" id="goTr" style="flex:1">${t('doTranslate')}</button>
  </div>
  ${from !== 'marma' ? `<p class="muted" style="font-size:.8rem">${t('privacyMic')}</p>` : ''}
  <div id="sugg"></div>
  <div id="trOut" aria-live="polite"></div>`;
};

function showSuggestions() {
  const [from] = $('#dir').value.split('>');
  const q = $('#src').value;
  const list = norm(q).length >= 2 ? findMatches(q, from).slice(0, 5) : [];
  $('#sugg').innerHTML = list.length ? `<p class="muted" style="margin:6px 0">${t('suggestions')}</p>` +
    list.map((m, i) => `<button class="chip sug" data-i="${i}" style="display:block;width:100%;text-align:left;margin:6px 0;white-space:normal">${esc(m.e[from])}</button>`).join('') : '';
  $$('.sug').forEach((b) => b.onclick = () => { $('#src').value = list[+b.dataset.i].e[from]; $('#sugg').innerHTML = ''; doTranslate(); });
}

function resultCard(e, to, from, note) {
  return `<div class="card">
    ${note ? `<p class="muted" style="margin:0 0 6px">${t('youMeant')} <b>${esc(e[from])}</b></p>` : ''}
    <div class="result ${to === 'marma' ? 'marma' : ''}">${esc(e[to])}</div>
    <div class="btn-row"><button class="btn small secondary sayBtn">${to === 'marma' ? t('play') : t('speak')}</button></div>
    ${badge(e.kind)} ${note ? `<br><span class="badge warn">${t('similar')}</span>` : ''}
  </div>`;
}

function doTranslate() {
  const [from, to] = $('#dir').value.split('>');
  store.set('dir', from + '>' + to);
  const raw = $('#src').value, q = norm(raw), out = $('#trOut');
  $('#sugg').innerHTML = '';
  if (!q) { out.innerHTML = ''; return; }
  const matches = findMatches(raw, from);
  const best = matches.find((m) => m.e[to]);
  const exactNoMarma = matches.find((m) => m.score === 1 && !m.e[to]);
  let shown = null;
  if (best && best.score === 1) {
    out.innerHTML = resultCard(best.e, to, from, false); shown = best.e;
  } else if (exactNoMarma) {
    out.innerHTML = `<div class="note warn">${t('inListNoMarma')}</div>
      <a class="btn secondary" href="#add" id="addFromTr">${t('addMarma')}</a>`;
    $('#addFromTr').onclick = () => sessionStorage.setItem('prefill', JSON.stringify({ bn: exactNoMarma.e.bn, en: exactNoMarma.e.en, cat: exactNoMarma.e.cat }));
    return;
  } else if (best && best.score >= 0.6) {
    out.innerHTML = resultCard(best.e, to, from, true); shown = best.e;
  } else {
    // Word-by-word guess from checked dictionary words only — clearly marked as a computer guess
    const words = q.split(' ');
    const dict = new Map(allEntries().filter((e) => e.type === 'word' && e.kind === 'checked' && e[from] && e[to]).map((w) => [norm(w[from]), w[to]]));
    const parts = words.map((w) => dict.get(w));
    if (dict.size && parts.some(Boolean)) {
      out.innerHTML = `<div class="card"><div class="result">${parts.map((p, i) => p ? esc(p) : `<span class="missing">[${esc(words[i])}?]</span>`).join(' ')}</div>
        <span class="badge warn">${t('guess')}</span><p class="muted" style="margin-top:8px">${t('guessExplain')}</p></div>`;
      return;
    }
    out.innerHTML = `<div class="note warn"><b>${t('notFound')}</b><br>${t('notFoundHelp')}</div>
      <a class="btn secondary" href="#add" id="addFromTr">${t('addThis')}</a>`;
    $('#addFromTr').onclick = () => sessionStorage.setItem('prefill', JSON.stringify({ [from]: raw.trim() }));
    return;
  }
  const sb = $('.sayBtn', out); if (sb) sb.onclick = () => sayResult(shown, to);
}

/* ---------- Talk (conversation) ---------- */
views.talk = () => {
  const mm = withMarma().filter((e) => e.bn);
  return `
  <h2>🗣️ ${t('talkTitle')}</h2>
  ${mm.length ? '' : `<div class="note warn">${t('talkNoData')}</div><a class="btn secondary" href="#add">${t('addMarma')}</a>`}
  <div class="card" style="border-color:var(--brand)">
    <h3 style="margin-top:0">🇧🇩 ${t('bnSpeaker')}</h3>
    <button class="btn full" id="talkMic">${t('pressSpeak')}</button>
    <p class="muted" style="font-size:.8rem;margin-top:6px">${t('privacyMic')}</p>
    <div id="talkBnOut" aria-live="polite"></div>
  </div>
  <div class="card" style="border-color:var(--accent)">
    <h3 style="margin-top:0">🗣️ ${t('mmSpeaker')}</h3>
    <p>${t('pickMarma')}</p>
    <p class="muted" style="font-size:.85rem">${t('talkHelp')}</p>
    <input type="search" id="talkFilter" placeholder="${t('search')}" aria-label="${t('search')}">
    <div id="talkMmList"></div>
  </div>`;
};

function renderTalkList() {
  const q = norm($('#talkFilter').value);
  const list = withMarma().filter((e) => e.bn && (!q || [e.marma, e.bn, e.en].some((x) => norm(x).includes(q))));
  $('#talkMmList').innerHTML = list.map((e, i) => `
    <button class="chip mmPick" data-i="${i}" style="display:block;width:100%;text-align:left;margin:8px 0;white-space:normal;border-radius:14px;padding:10px 14px">
      <span class="marma" style="font-size:1.15rem;font-weight:700">${esc(e.marma)}</span></button>`).join('') || `<p class="muted">${t('noResults')}</p>`;
  $$('.mmPick').forEach((b) => b.onclick = () => {
    const e = list[+b.dataset.i];
    $('#talkBnOut').innerHTML = `<div class="note"><div class="result">${esc(e.bn)}</div>${badge(e.kind)}</div>`;
    speak(e.bn, 'bn');
    $('#talkBnOut').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

async function talkListen() {
  const btn = $('#talkMic'), out = $('#talkBnOut');
  btn.disabled = true; btn.textContent = t('listening');
  try {
    const heard = await listen(SPEECH_LANG.bn);
    const best = findMatches(heard, 'bn').find((m) => m.e.marma);
    if (best && best.score >= 0.6) {
      out.innerHTML = `<p class="muted" style="margin-top:10px">${t('heard')} “${esc(heard)}”</p>${resultCard(best.e, 'marma', 'bn', best.score < 1)}`;
      $('.sayBtn', out).onclick = () => playEntry(best.e);
      if (audioSrc(best.e)) playEntry(best.e);
    } else {
      out.innerHTML = `<p class="muted" style="margin-top:10px">${t('heard')} “${esc(heard)}”</p><div class="note warn"><b>${t('notFound')}</b> ${t('orPick')}</div>`;
    }
  } catch (err) {
    if (err !== 'noresult' && err !== 'aborted') toast(micErrorText(err));
  } finally { btn.disabled = false; btn.textContent = t('pressSpeak'); }
}

/* ---------- Phrasebook ---------- */
let phraseCat = 'all';
views.phrasebook = () => {
  const list = allEntries().filter((e) => e.type !== 'word');
  return `
  <h2>📖 ${t('phrasebook')}</h2>
  <div class="note">${t('phraseNote')}</div>
  <div class="chips">${['all', ...CATS.filter((c) => list.some((p) => p.cat === c))].map((c) =>
    `<button class="chip ${phraseCat === c ? 'on' : ''}" data-cat="${c}">${c === 'all' ? t('all') : t('cat_' + c)}</button>`).join('')}</div>
  <div id="phraseList">${list.filter((p) => phraseCat === 'all' || p.cat === phraseCat).map(phraseCard).join('')}</div>`;
};
let CARD_ENTRIES = [];
function phraseCard(p) {
  const i = CARD_ENTRIES.push(p) - 1;
  const first = lang === 'bn' ? p.bn : p.en, second = lang === 'bn' ? p.en : p.bn;
  return `<div class="card">
    ${first ? `<div class="line"><b>${esc(first)}</b></div>` : ''}
    ${second ? `<div class="line muted">${esc(second)}</div>` : ''}
    <div class="line">${p.marma ? `<span class="marma">${esc(p.marma)}</span>` : `<span class="missing">${t('noMarmaYet')}</span>`}</div>
    <div class="btn-row">
      ${p.marma ? `<button class="btn small secondary playCard" data-i="${i}">${t('play')}</button> ${badge(p.kind)}`
               : `<a class="btn small secondary addMarma" href="#add" data-bn="${esc(p.bn)}" data-en="${esc(p.en)}" data-cat="${esc(p.cat)}">${t('addMarma')}</a>`}
    </div></div>`;
}

/* ---------- Dictionary ---------- */
let dictFilter = 'all';
views.dictionary = () => `
  <h2>🔤 ${t('dictionary')}</h2>
  <input type="search" id="dq" placeholder="${t('search')}" aria-label="${t('search')}">
  <div class="chips" style="margin-top:10px">${[['all', t('all')], ['word', t('words')], ['sentence', t('sentences')]].map(([k, l]) =>
    `<button class="chip dchip ${dictFilter === k ? 'on' : ''}" data-k="${k}">${l}</button>`).join('')}</div>
  <div id="dList"></div>
  <a class="btn secondary full" href="#add" id="dAdd" style="margin-top:10px">${t('addWord')}</a>`;

function renderDict() {
  const q = norm($('#dq').value);
  const all = withMarma().filter((e) => dictFilter === 'all' || (dictFilter === 'word' ? e.type === 'word' : e.type !== 'word'));
  const list = all.filter((e) => !q || [e.marma, e.bn, e.en].some((x) => norm(x).includes(q)))
    .sort((a, b) => String(a.marma).localeCompare(String(b.marma))).slice(0, 300);
  CARD_ENTRIES = [];
  if (!withMarma().length) { $('#dList').innerHTML = `<div class="note"><b>${t('dictEmpty')}</b><br>${t('dictEmptyHelp')}</div>`; return; }
  $('#dList').innerHTML = list.map((e) => { const i = CARD_ENTRIES.push(e) - 1; return `<div class="card">
    <span class="marma">${esc(e.marma)}</span> <span class="muted" style="font-size:.8rem">(${e.type === 'word' ? t('words') : t('sentences')})</span>
    ${e.bn ? `<div class="line">${t('bn')}: ${esc(e.bn)}</div>` : ''}${e.en ? `<div class="line muted">${t('en')}: ${esc(e.en)}</div>` : ''}
    <div class="btn-row"><button class="btn small secondary playCard" data-i="${i}">${t('play')}</button> ${badge(e.kind)}</div></div>`; }).join('')
    || `<p class="muted">${t('noResults')}</p>`;
  wirePlayCards();
}

/* ---------- Add ---------- */
views.add = () => `
  <h2>➕ ${t('addTitle')}</h2>
  <label for="fKind">${t('kind')}</label>
  <select id="fKind"><option value="sentence">${t('kindSentence')}</option><option value="word">${t('kindWord')}</option></select>
  <label for="fMarma">${t('marmaText')} *</label><textarea id="fMarma" class="marma"></textarea>
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
  <div id="sendBox"></div>
  <a class="btn secondary full" href="#check" style="margin-top:20px">${t('forCheckers')}</a>`;

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
      const a = $('#recPreview'); if (!a) return; a.src = URL.createObjectURL(recBlob); a.hidden = false;
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
  await DB.put('mine', { id: 'm' + Date.now(), type: $('#fKind').value, marma, bn, en, cat: $('#fCat').value, audioBlob: recBlob, created: new Date().toISOString() });
  recBlob = null; await loadLocal(); toast(t('saved')); render();
}

function renderMine() {
  const mine = [...MINE].sort((a, b) => b.created.localeCompare(a.created));
  $('#mineList').innerHTML = mine.length ? mine.map((m) => `<div class="card">
      <span class="marma">${esc(m.marma)}</span>
      <div class="line">${esc(m.bn)}</div><div class="line muted">${esc(m.en)}</div>
      ${badge('mine')}
      <div class="btn-row">${m.audioBlob ? `<button class="btn small secondary playMine" data-id="${m.id}">${t('play')}</button>` : ''}
      <button class="btn small danger delMine" data-id="${m.id}">${t('del')}</button></div></div>`).join('')
    : `<p class="muted">${t('none')}</p>`;
  $('#sendBox').innerHTML = mine.length ? `<div class="note">${t('sendNote')}</div>
      <label class="check"><input type="checkbox" id="shareName"> ${t('shareName')}</label>
      <div class="btn-row"><button class="btn full" id="sendBtn">${t('send')}</button></div>` : '';
  $$('.playMine').forEach((b) => b.onclick = () => playEntry(mine.find((x) => x.id === b.dataset.id)));
  $$('.delMine').forEach((b) => b.onclick = async () => {
    if (confirm(t('confirmDel'))) { await DB.del('mine', b.dataset.id); await loadLocal(); renderMine(); }
  });
  if ($('#sendBtn')) $('#sendBtn').onclick = () => exportMine(mine);
}

const blobToDataURL = (b) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); });
async function shareOrDownload(name, text, type = 'application/json') {
  const file = new File([text], name, { type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; a.click();
}
async function exportMine(mine) {
  const items = [];
  for (const m of mine) items.push({ type: m.type || 'sentence', marma: m.marma, bn: m.bn, en: m.en, cat: m.cat, created: m.created, audio: m.audioBlob ? await blobToDataURL(m.audioBlob) : '' });
  const payload = { app: 'marma-translator', format: 1, exported: new Date().toISOString(),
    contributor: $('#shareName').checked ? store.get('myName', '') : '', items };
  await shareOrDownload('marma-sentences-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(payload));
  toast(t('fileReady'));
}

/* ---------- Checker page ---------- */
views.check = () => `
  <h2>✅ ${t('checkTitle')}</h2>
  <div class="note">${t('checkIntro')}</div>
  <label for="revName">${t('reviewerName')}</label><input type="text" id="revName" value="${esc(store.get('reviewer', ''))}">
  <label class="btn secondary full" style="margin-top:14px;font-weight:700">${t('openFiles')}
    <input type="file" id="inFiles" accept=".json,application/json" multiple hidden></label>
  <h3>${t('waiting')}</h3><div id="inboxList"></div>
  <h3>${t('approved')}</h3><div id="apprList"></div>
  <p class="muted" style="margin-top:14px">${t('exportData')}:</p>
  <div class="btn-row"><button class="btn" id="exportPhrases" style="flex:1">⬇ phrases.json</button>
  <button class="btn" id="exportWords" style="flex:1">⬇ dictionary.json</button></div>`;

async function renderCheck() {
  const inbox = await DB.all('inbox');
  $('#inboxList').innerHTML = inbox.map((m) => `<div class="card">
      <span class="badge warn">${m.type === 'word' ? t('words') : t('sentences')}</span>
      <div class="marma" style="margin-top:6px">${esc(m.marma)}</div>
      <div class="line">${t('bn')}: ${esc(m.bn)}</div><div class="line muted">${t('en')}: ${esc(m.en)}</div>
      <div class="line muted" style="font-size:.85rem">${t('from_')} ${esc(m.contributor || t('anon'))}</div>
      ${m.audio ? `<audio controls src="${esc(m.audio)}" style="width:100%;margin-top:6px"></audio>` : `<p class="muted">${t('noVoiceYet')}</p>`}
      <div class="btn-row"><button class="btn small okBtn" data-id="${m.id}">${t('approve')}</button>
      <button class="btn small danger noBtn" data-id="${m.id}">${t('reject')}</button></div></div>`).join('') || `<p class="muted">${t('none')}</p>`;
  $('#apprList').innerHTML = APPROVED.map((m) => `<div class="card"><span class="marma">${esc(m.marma)}</span>
      <div class="line">${esc(m.bn)}</div><div class="line muted">${esc(m.en)}</div>${badge('checked')}
      <div class="btn-row"><button class="btn small danger unBtn" data-id="${m.id}">${t('del')}</button></div></div>`).join('') || `<p class="muted">${t('none')}</p>`;
  $$('.okBtn').forEach((b) => b.onclick = async () => {
    const reviewer = $('#revName').value.trim(); if (!reviewer) { toast(t('needReviewer')); $('#revName').focus(); return; }
    store.set('reviewer', reviewer);
    const m = inbox.find((x) => x.id === b.dataset.id);
    await DB.put('approved', { ...m, checked_by: reviewer, status: 'checked' }); await DB.del('inbox', m.id);
    await loadLocal(); renderCheck();
  });
  $$('.noBtn').forEach((b) => b.onclick = async () => { if (confirm(t('confirmDel'))) { await DB.del('inbox', b.dataset.id); renderCheck(); } });
  $$('.unBtn').forEach((b) => b.onclick = async () => { if (confirm(t('confirmDel'))) { await DB.del('approved', b.dataset.id); await loadLocal(); renderCheck(); } });
}

async function importFiles(files) {
  let n = 0;
  for (const f of files) {
    try {
      const data = JSON.parse(await f.text());
      if (data.app !== 'marma-translator' || !Array.isArray(data.items)) { toast(t('badFile')); continue; }
      for (const it of data.items) {
        if (!it.marma) continue;
        const id = 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        await DB.put('inbox', { id, type: it.type === 'word' ? 'word' : 'sentence', marma: String(it.marma), bn: String(it.bn || ''), en: String(it.en || ''),
          cat: CATS.includes(it.cat) ? it.cat : 'other', audio: /^data:audio\//.test(it.audio || '') ? it.audio : '', contributor: String(data.contributor || '') });
        n++;
      }
    } catch (e) { toast(t('badFile')); }
  }
  toast(t('imported', n)); renderCheck();
}

// Builds new phrases.json and dictionary.json = what is on the website now + what was approved here.
// Contributor names are NOT put into these public files (privacy). Only the checker's name is.
async function exportData(which) {
  if (!APPROVED.length) { toast(t('nothingApproved')); return; }
  const phrases = PHRASES.map((p) => ({ ...p })), words = WORDS.map((w) => ({ ...w }));
  const same = (a, b) => norm(a.marma) === norm(b.marma) && (norm(a.bn) === norm(b.bn) || norm(a.en) === norm(b.en));
  for (const a of APPROVED) {
    const clean = { marma: a.marma, bn: a.bn, en: a.en, audio: a.audio || '', source: 'Marma speaker (community)', checked_by: a.checked_by };
    if (a.type === 'word') {
      if (!words.some((w) => same(w, a))) words.push({ id: 'w' + (words.length + 1).toString().padStart(4, '0'), ...clean });
      continue;
    }
    if (phrases.some((p) => same(p, a))) continue;
    const slot = phrases.find((p) => !p.marma && ((a.bn && norm(p.bn) === norm(a.bn)) || (a.en && norm(p.en) === norm(a.en))));
    if (slot) Object.assign(slot, clean, { status: 'checked' });
    else phrases.push({ id: 'c' + (phrases.length + 1).toString().padStart(4, '0'), cat: a.cat || 'other', ...clean, status: 'checked' });
  }
  const readme = (kind) => `${kind}. Only Marma text given by Marma speakers and approved by a checker. Never invent Marma words.`;
  const download = (name, obj) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 1)], { type: 'application/json' })); a.download = name; a.click(); };
  if (which === 'phrases') download('phrases.json', { _readme: readme('Phrasebook'), phrases });
  else download('dictionary.json', { _readme: readme('Marma dictionary'), words });
  toast(t('exportDone'));
}

views.learn = () => `<h2>🎓 ${t('learnSoon')}</h2><div class="note">${t('learnSoonText')}</div><a class="btn secondary" href="#home">${t('back')}</a>`;

/* ================= Page switching ================= */
function render() {
  const name = (location.hash || '#home').slice(1);
  const view = views[name] || views.home;
  document.documentElement.lang = lang;
  $('#appTitle').textContent = t('appTitle');
  $('#langBtn').textContent = t('switchTo');
  $('#homeBtn').setAttribute('aria-label', t('home'));
  CARD_ENTRIES = [];
  $('#app').innerHTML = view();
  wire(name);
  paintOffline();
}
function wirePlayCards() { $$('.playCard').forEach((b) => b.onclick = () => playEntry(CARD_ENTRIES[+b.dataset.i])); }

function wire(name) {
  wirePlayCards();
  if (name === 'translate') {
    $('#goTr').onclick = doTranslate;
    $('#src').oninput = showSuggestions;
    $('#dir').onchange = () => { store.set('dir', $('#dir').value); render(); };
    if ($('#micTr')) $('#micTr').onclick = async () => {
      const [from] = $('#dir').value.split('>'); const btn = $('#micTr');
      btn.textContent = '…'; btn.disabled = true;
      try { $('#src').value = await listen(SPEECH_LANG[from]); doTranslate(); }
      catch (err) { if (err !== 'noresult' && err !== 'aborted') toast(micErrorText(err)); }
      finally { btn.textContent = '🎤'; btn.disabled = false; }
    };
  }
  if (name === 'talk') { $('#talkMic').onclick = talkListen; $('#talkFilter').oninput = renderTalkList; renderTalkList(); }
  if (name === 'phrasebook') {
    $$('.chips .chip').forEach((c) => c.onclick = () => { phraseCat = c.dataset.cat; render(); });
    $$('.addMarma').forEach((a) => a.onclick = () =>
      sessionStorage.setItem('prefill', JSON.stringify({ bn: a.dataset.bn, en: a.dataset.en, cat: a.dataset.cat })));
  }
  if (name === 'dictionary') {
    $('#dq').oninput = renderDict;
    $$('.dchip').forEach((c) => c.onclick = () => { dictFilter = c.dataset.k; $$('.dchip').forEach((x) => x.classList.toggle('on', x === c)); renderDict(); });
    $('#dAdd').onclick = () => sessionStorage.setItem('prefill', JSON.stringify({ type: 'word' }));
    renderDict();
  }
  if (name === 'add') {
    const pre = JSON.parse(sessionStorage.getItem('prefill') || '{}'); sessionStorage.removeItem('prefill');
    if (pre.type) $('#fKind').value = pre.type;
    if (pre.marma) $('#fMarma').value = pre.marma;
    if (pre.bn) $('#fBn').value = pre.bn;
    if (pre.en) $('#fEn').value = pre.en;
    if (pre.cat) $('#fCat').value = pre.cat;
    $('#recBtn').onclick = toggleRecord; $('#saveBtn').onclick = saveMine; renderMine();
  }
  if (name === 'check') {
    $('#inFiles').onchange = (e) => importFiles([...e.target.files]);
    $('#exportPhrases').onclick = () => exportData('phrases');
    $('#exportWords').onclick = () => exportData('words');
    renderCheck();
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

loadData().then(() => { paintThemeBtn(); render(); });
