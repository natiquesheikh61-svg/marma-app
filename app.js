/* Marma Translator – Part 3: connected to Supabase, works online AND offline.
   Rule of this app: it NEVER invents Marma words. Every Marma word comes from a Marma speaker
   and is approved by a checker. Anything the computer guesses is clearly marked as a guess.

   How data moves:
   - Approved words live in Supabase (table "entries"). Each phone keeps a copy (IndexedDB),
     so the app works without internet. When internet comes, it downloads only what changed.
   - New words people add go into an "outbox" on the phone. When internet comes, they are sent
     to Supabase (table "submissions") with their voice/photo. Nobody else sees them until a
     checker approves them on the Checker page. Then every phone gets them on its next update. */
'use strict';

/* ================= Words for the menus (Bangla + English) ================= */
const T = {
  bn: {
    appTitle: 'মারমা অনুবাদক', switchTo: 'English', home: 'হোম',
    translate: 'অনুবাদ', talk: 'কথা বলুন', phrasebook: 'দরকারি বাক্য', dictionary: 'অভিধান',
    learn: 'মারমা শিখুন', add: 'যোগ করুন', soon: 'শীঘ্রই আসছে',
    welcome: 'মারমা ↔ বাংলা ↔ ইংরেজি। যেকোনো ব্রাউজারে খুলুন। একবার খোলার পর ইন্টারনেট ছাড়াও চলে।',
    offline: 'ইন্টারনেট নেই — জমানো শব্দ দিয়ে অ্যাপ চলছে',
    marma: 'মারমা', bn: 'বাংলা', en: 'ইংরেজি',
    stats: (s, w) => `মারমা বাক্য: ${s} · মারমা শব্দ: ${w}`,
    syncOk: (w) => `✔ ডেটাবেসের সাথে যুক্ত · শেষ হালনাগাদ ${w}`, syncNever: 'এখনও হালনাগাদ হয়নি',
    syncing: '⏳ নতুন শব্দ আনা হচ্ছে…', syncFail: '⚠ ডেটাবেসে পৌঁছানো যায়নি। জমানো শব্দ দেখানো হচ্ছে।',
    notConnected: 'ডেটাবেস যুক্ত নয় (config.js খালি)। শব্দ শুধু এই ফোনে থাকবে।',
    refresh: '🔄 এখনই হালনাগাদ', outboxCount: (n) => `📤 ${n}টি পাঠানোর অপেক্ষায় (ইন্টারনেট এলে যাবে)`,
    saveOffline: '⬇ কণ্ঠ ও ছবি অফলাইনের জন্য সংরক্ষণ', savingOffline: (a, b) => `সংরক্ষণ হচ্ছে ${a}/${b}…`, savedOffline: 'সব কণ্ঠ ও ছবি সংরক্ষিত ✔',
    justNow: 'এইমাত্র', minAgo: (m) => `${m} মিনিট আগে`, hrAgo: (h) => `${h} ঘণ্টা আগে`, dayAgo: (d) => `${d} দিন আগে`,
    from: 'কোন ভাষা থেকে', typeHere: 'এখানে লিখুন বা 🎤 চাপুন…', typeLabel: 'এখানে লিখুন', doTranslate: 'অনুবাদ করুন',
    suggestions: 'এগুলোর মধ্যে কোনটি? চাপ দিন:',
    checked: '✔ মারমা ভাষাভাষীরা যাচাই করেছেন', mineWait: '📤 এই ফোনে — ইন্টারনেট এলে পাঠানো হবে',
    mineSent: '⏳ পাঠানো হয়েছে — যাচাইয়ের অপেক্ষায়',
    guess: '⚠ কম্পিউটারের অনুমান — ভুল হতে পারে',
    guessExplain: 'শব্দ ধরে ধরে মিলিয়ে বানানো। বাক্য হিসেবে ঠিক না-ও হতে পারে।',
    similar: '≈ হুবহু মেলেনি — সবচেয়ে কাছের বাক্যটি দেখানো হলো', youMeant: 'আমাদের জানা বাক্য:',
    inListNoMarma: 'এই বাক্যটি তালিকায় আছে, কিন্তু এর মারমা এখনও কেউ যোগ করেননি।',
    notFound: 'এটি এখনও আমাদের জানা নেই।', notFoundHelp: 'আপনি মারমা জানলে এটি যোগ করে অ্যাপটিকে সাহায্য করুন।',
    addThis: 'এটি যোগ করুন', noMarmaYet: 'মারমা এখনও যোগ হয়নি', addMarma: '＋ মারমা যোগ করুন',
    play: '▶ শুনুন', speak: '🔊 শুনুন', noVoiceYet: 'এখনও কারও কণ্ঠ রেকর্ড হয়নি',
    report: '⚑ ভুল জানান', reportAsk: 'কী ভুল আছে? সংক্ষেপে লিখুন:', reportThanks: 'ধন্যবাদ! যাচাইকারীরা দেখবেন।',
    all: 'সব', phraseNote: 'বাংলা ও ইংরেজি বাক্যের তালিকা। মারমা অংশ শুধু মারমা ভাষাভাষীরা পূরণ করবেন।',
    search: 'মারমা, বাংলা বা ইংরেজিতে খুঁজুন…', noResults: 'কিছু পাওয়া যায়নি।',
    dictEmpty: 'অভিধানে এখনও কোনো মারমা শব্দ নেই।',
    dictEmptyHelp: 'মারমা ভাষাভাষীরা শব্দ যোগ করলে এবং যাচাইকারী অনুমোদন দিলে এখানে আসবে। আমরা নিজে থেকে কোনো মারমা শব্দ বানাই না।',
    addWord: '＋ শব্দ যোগ করুন', removeEntry: '🗑 সরিয়ে দিন (যাচাইকারী)', removed: 'সরানো হয়েছে',
    kinds: { word: 'শব্দ', phrase: 'বাক্যাংশ', sentence: 'বাক্য', question: 'প্রশ্ন', proverb: 'প্রবাদ', idiom: 'বাগধারা',
      number: 'সংখ্যা', name: 'নাম (স্থান/মানুষ)', song_line: 'গান/ছড়ার লাইন', other: 'অন্যান্য' },
    pos: { '': '—', noun: 'বিশেষ্য', verb: 'ক্রিয়া', adjective: 'বিশেষণ', adverb: 'ক্রিয়া-বিশেষণ', pronoun: 'সর্বনাম', number: 'সংখ্যা', other: 'অন্যান্য' },
    genders: { '': '—', female: 'নারী', male: 'পুরুষ', other: 'অন্যান্য' },
    ages: { '': '—', child: 'শিশু', young: 'তরুণ', adult: 'প্রাপ্তবয়স্ক', elder: 'বয়স্ক' },
    addTitle: 'মারমা শব্দ বা বাক্য যোগ করুন', kind: 'কী যোগ করবেন?',
    marmaText: 'মারমা (মারমা হরফে)', marmaBn: 'মারমা — বাংলা হরফে লিখলে', pron: 'উচ্চারণ (ইংরেজি হরফে, জানলে)',
    bnMeaning: 'বাংলা অর্থ', enMeaning: 'ইংরেজি অর্থ (জানলে)', needOne: 'মারমা হরফে বা বাংলা হরফে — অন্তত একটি লিখুন',
    category: 'বিষয়', moreDetails: '➕ আরও তথ্য (ইচ্ছা হলে)', posLabel: 'শব্দের ধরন',
    exMarma: 'উদাহরণ বাক্য (মারমা)', exBn: 'উদাহরণের বাংলা', exEn: 'উদাহরণের ইংরেজি', notes: 'অন্য কথা', dialect: 'এলাকা / উপভাষা',
    photo: '📷 ছবি (ইচ্ছা হলে)', photoHelp: 'যেমন ফল, পশু, জিনিসের ছবি — শেখার জন্য কাজে লাগে।',
    voiceTitle: 'কণ্ঠ', record: '🎤 নিজের কণ্ঠে রেকর্ড করুন', stop: '⏹ থামান', recording: 'রেকর্ড হচ্ছে…', reRecord: '🎤 আবার রেকর্ড',
    noMic: 'রেকর্ড করা যাচ্ছে না। মাইক্রোফোনের অনুমতি দিন।',
    aboutYou: 'আপনার সম্পর্কে (ইচ্ছা হলে)', yourName: 'আপনার নাম',
    nameNote: 'নাম শুধু যাচাইকারীরা দেখবেন। সবাই দেখবে না।', gender: 'লিঙ্গ', age: 'বয়স',
    consent: 'আমার কণ্ঠ দিয়ে কম্পিউটারকে মারমা বলতে শেখানো যাবে — আমি রাজি।',
    save: '💾 সংরক্ষণ ও পাঠান', saved: 'সংরক্ষণ হয়েছে ✔', sentNow: 'পাঠানো হয়েছে ✔ যাচাইকারী দেখবেন।',
    savedOffline2: 'ফোনে সংরক্ষণ হয়েছে। ইন্টারনেট এলে নিজে থেকে পাঠানো হবে।',
    needMarma: 'মারমা লেখা এবং বাংলা বা ইংরেজি অর্থ লিখুন।',
    mySentences: 'আমার যোগ করা', none: 'এখনও কিছু নেই।', del: '🗑 মুছুন', confirmDel: 'এটি মুছে ফেলবেন?',
    forCheckers: '✅ যাচাইকারীদের পাতা',
    talkTitle: 'কথা বলুন', bnSpeaker: 'বাংলা ভাষী', mmSpeaker: 'মারমা ভাষী',
    pressSpeak: '🎤 বাংলায় বলুন', listening: 'শুনছি… এখন বলুন', heard: 'শোনা গেছে:', orPick: 'অথবা নিচে থেকে একটি বাক্য বেছে নিন',
    pickMarma: 'নিচ থেকে আপনার মারমা বাক্যটি চাপুন। ফোন বাংলায় বলে দেবে।',
    talkHelp: 'কম্পিউটার এখনও মারমা কথা বুঝতে পারে না। তাই মারমা ভাষী তালিকা থেকে বাক্য বেছে নেবেন।',
    talkNoData: 'এখনও কোনো মারমা বাক্য নেই। আগে "যোগ করুন" পাতায় মারমা বাক্য যোগ করুন।',
    micNeedsNet: 'কণ্ঠ চেনার জন্য ইন্টারনেট লাগে। ইন্টারনেট না থাকলে বাক্য বেছে নিন।',
    noSR: 'এই ব্রাউজারে কণ্ঠ চেনা যায় না। Android-এ Chrome ব্যবহার করুন, বা লিখে দিন।',
    srError: 'কণ্ঠ বোঝা যায়নি। আবার চেষ্টা করুন, বা লিখে দিন।',
    noBnVoice: 'এই ফোনে বাংলা কণ্ঠ নেই। ফোনের Settings → Text-to-speech-এ বাংলা যোগ করুন।',
    privacyMic: '🎤 চাপলে আপনার কণ্ঠ Google-এর কাছে যায় লেখা বানাতে।',
    checkTitle: 'যাচাইকারীদের পাতা', needNet: 'এই পাতার জন্য ইন্টারনেট লাগবে।',
    login: 'লগইন', email: 'ইমেইল', password: 'পাসওয়ার্ড', logout: 'লগআউট', loginFail: 'লগইন হয়নি। ইমেইল ও পাসওয়ার্ড দেখুন।',
    notReviewer: 'এই অ্যাকাউন্টটি যাচাইকারী হিসেবে যোগ করা হয়নি।', hello: (n) => `স্বাগতম, ${n}`,
    tabWaiting: 'অপেক্ষায়', tabReports: 'ভুলের খবর', tabImport: 'তালিকা আমদানি',
    checkIntro: 'প্রতিটি মারমা লেখা ও কণ্ঠ মন দিয়ে দেখুন। দরকার হলে ঠিক করে দিন। সঠিক হলে "ঠিক আছে" চাপুন — তখনই সবার অ্যাপে যাবে।',
    approve: '✔ ঠিক আছে', reject: '✖ বাদ দিন', approvedOk: 'অনুমোদিত ✔ সবার অ্যাপে যাবে।', rejectedOk: 'বাদ দেওয়া হয়েছে',
    rejectWhy: 'কেন বাদ? (ইচ্ছা হলে)', sentBy: 'পাঠিয়েছেন:', anon: 'নাম নেই', consentYes: 'কণ্ঠ দিয়ে শেখানোর অনুমতি: হ্যাঁ', consentNo: 'কণ্ঠ দিয়ে শেখানোর অনুমতি: না',
    close: '✔ সমাধান হয়েছে', reportOn: 'যে শব্দের ভুল:',
    importIntro: 'অনেক শব্দ একসাথে যোগ করুন (CSV ফাইল — Google Sheets বা Excel থেকে "CSV" হিসেবে ডাউনলোড)। শুধু মারমা ভাষাভাষীদের যাচাই করা তালিকা আমদানি করুন।',
    template: '⬇ খালি নমুনা ফাইল', chooseCsv: '📂 CSV ফাইল বেছে নিন', importSource: 'উৎস (যেমন: খাতা ১, পৃষ্ঠা ৩–৮)',
    importReady: (a, b) => `${a}টি সারি প্রস্তুত, ${b}টি বাদ (মারমা বা অর্থ নেই)`, importGo: '⬆ আমদানি করুন', importDone: (n) => `${n}টি যোগ হয়েছে ✔`,
    needSource: 'উৎস লিখুন।', error: 'সমস্যা হয়েছে:',
    learnSoon: 'মারমা শিখুন — শীঘ্রই আসছে',
    learnSoonText: 'ছোট ছোট মজার পাঠ। পাঠগুলো শুধু যাচাই করা মারমা বাক্য দিয়ে বানানো হবে।',
    honesty: 'এই অ্যাপ নিজে থেকে কোনো মারমা শব্দ বানায় না। সব মারমা লেখা ও কণ্ঠ মারমা ভাষাভাষীদের দেওয়া।',
    back: '← ফিরে যান'
  },
  en: {
    appTitle: 'Marma Translator', switchTo: 'বাংলা', home: 'Home',
    translate: 'Translate', talk: 'Talk', phrasebook: 'Phrasebook', dictionary: 'Dictionary',
    learn: 'Learn Marma', add: 'Add', soon: 'Coming soon',
    welcome: 'Marma ↔ Bangla ↔ English. Opens in any browser. After the first visit it also works without internet.',
    offline: 'No internet — using saved words',
    marma: 'Marma', bn: 'Bangla', en: 'English',
    stats: (s, w) => `Marma sentences: ${s} · Marma words: ${w}`,
    syncOk: (w) => `✔ Connected to database · last update ${w}`, syncNever: 'not updated yet',
    syncing: '⏳ Getting new words…', syncFail: '⚠ Could not reach the database. Showing saved words.',
    notConnected: 'Database not connected (config.js is empty). Words stay on this phone only.',
    refresh: '🔄 Update now', outboxCount: (n) => `📤 ${n} waiting to send (will go when internet comes)`,
    saveOffline: '⬇ Save voices & pictures for offline', savingOffline: (a, b) => `Saving ${a}/${b}…`, savedOffline: 'All voices and pictures saved ✔',
    justNow: 'just now', minAgo: (m) => `${m} min ago`, hrAgo: (h) => `${h} h ago`, dayAgo: (d) => `${d} days ago`,
    from: 'Translate from', typeHere: 'Type here or press 🎤…', typeLabel: 'Type here', doTranslate: 'Translate',
    suggestions: 'Did you mean one of these? Tap one:',
    checked: '✔ Checked by Marma speakers', mineWait: '📤 On this phone — will be sent when internet comes',
    mineSent: '⏳ Sent — waiting for a checker',
    guess: '⚠ Computer guess — may be wrong',
    guessExplain: 'Made by matching word by word. It may not be a correct sentence.',
    similar: '≈ Not an exact match — showing the closest sentence we know', youMeant: 'Sentence we know:',
    inListNoMarma: 'This sentence is in our list, but nobody has added its Marma yet.',
    notFound: 'We do not know this one yet.', notFoundHelp: 'If you know Marma, please add it to help the app grow.',
    addThis: 'Add this', noMarmaYet: 'Marma not added yet', addMarma: '＋ Add Marma',
    play: '▶ Listen', speak: '🔊 Speak', noVoiceYet: 'No voice recorded yet',
    report: '⚑ Report mistake', reportAsk: 'What is wrong? Write briefly:', reportThanks: 'Thank you! The checkers will look.',
    all: 'All', phraseNote: 'A list of Bangla and English sentences. Only Marma speakers fill in the Marma part.',
    search: 'Search in Marma, Bangla or English…', noResults: 'Nothing found.',
    dictEmpty: 'The dictionary has no Marma words yet.',
    dictEmptyHelp: 'Words appear here after Marma speakers add them and a checker approves them. We never make up Marma words.',
    addWord: '＋ Add a word', removeEntry: '🗑 Remove (checker)', removed: 'Removed',
    kinds: { word: 'Word', phrase: 'Phrase', sentence: 'Sentence', question: 'Question', proverb: 'Proverb', idiom: 'Idiom',
      number: 'Number', name: 'Name (place/person)', song_line: 'Song / rhyme line', other: 'Other' },
    pos: { '': '—', noun: 'Noun', verb: 'Verb', adjective: 'Adjective', adverb: 'Adverb', pronoun: 'Pronoun', number: 'Number', other: 'Other' },
    genders: { '': '—', female: 'Female', male: 'Male', other: 'Other' },
    ages: { '': '—', child: 'Child', young: 'Young', adult: 'Adult', elder: 'Elder' },
    addTitle: 'Add a Marma word or sentence', kind: 'What are you adding?',
    marmaText: 'Marma (in Marma letters)', marmaBn: 'Marma — written in Bangla letters', pron: 'Pronunciation (English letters, if you know)',
    bnMeaning: 'Bangla meaning', enMeaning: 'English meaning (if you know)', needOne: 'Write it in Marma letters or Bangla letters — at least one',
    category: 'Topic', moreDetails: '➕ More details (optional)', posLabel: 'Type of word',
    exMarma: 'Example sentence (Marma)', exBn: 'Example in Bangla', exEn: 'Example in English', notes: 'Other notes', dialect: 'Area / dialect',
    photo: '📷 Picture (optional)', photoHelp: 'For example a fruit, animal or object — helps with learning.',
    voiceTitle: 'Voice', record: '🎤 Record your voice', stop: '⏹ Stop', recording: 'Recording…', reRecord: '🎤 Record again',
    noMic: 'Cannot record. Please allow the microphone.',
    aboutYou: 'About you (optional)', yourName: 'Your name',
    nameNote: 'Only checkers see your name. It is not shown to everyone.', gender: 'Gender', age: 'Age',
    consent: 'My voice may be used to teach the computer to speak Marma — I agree.',
    save: '💾 Save & send', saved: 'Saved ✔', sentNow: 'Sent ✔ A checker will look at it.',
    savedOffline2: 'Saved on this phone. It will be sent by itself when internet comes.',
    needMarma: 'Please write the Marma and its Bangla or English meaning.',
    mySentences: 'My additions', none: 'Nothing yet.', del: '🗑 Delete', confirmDel: 'Delete this?',
    forCheckers: '✅ Page for checkers',
    talkTitle: 'Talk', bnSpeaker: 'Bangla speaker', mmSpeaker: 'Marma speaker',
    pressSpeak: '🎤 Speak in Bangla', listening: 'Listening… speak now', heard: 'Heard:', orPick: 'Or choose a sentence below',
    pickMarma: 'Tap your Marma sentence below. The phone will say it in Bangla.',
    talkHelp: 'Computers cannot understand spoken Marma yet, so the Marma speaker chooses from the list.',
    talkNoData: 'No Marma sentences yet. First add Marma sentences on the "Add" page.',
    micNeedsNet: 'Voice recognition needs internet. Without internet, choose a sentence instead.',
    noSR: 'This browser cannot recognise voice. Use Chrome on Android, or type instead.',
    srError: 'Could not understand. Please try again, or type.',
    noBnVoice: 'This phone has no Bangla voice. Add Bangla in the phone\'s Settings → Text-to-speech.',
    privacyMic: '🎤 When you press the mic, your voice is sent to Google to turn it into text.',
    checkTitle: 'Page for checkers', needNet: 'This page needs internet.',
    login: 'Log in', email: 'Email', password: 'Password', logout: 'Log out', loginFail: 'Could not log in. Check email and password.',
    notReviewer: 'This account has not been added as a checker.', hello: (n) => `Welcome, ${n}`,
    tabWaiting: 'Waiting', tabReports: 'Mistake reports', tabImport: 'Import list',
    checkIntro: 'Look at each Marma text and listen to each voice carefully. Correct it if needed. Press "Correct" only when it is right — it then goes to everyone\'s app.',
    approve: '✔ Correct', reject: '✖ Remove', approvedOk: 'Approved ✔ It will reach everyone.', rejectedOk: 'Removed',
    rejectWhy: 'Why remove? (optional)', sentBy: 'Sent by:', anon: 'no name', consentYes: 'Voice may teach the computer: yes', consentNo: 'Voice may teach the computer: no',
    close: '✔ Solved', reportOn: 'Word reported:',
    importIntro: 'Add many words at once (a CSV file — download from Google Sheets or Excel as "CSV"). Only import lists checked by Marma speakers.',
    template: '⬇ Empty sample file', chooseCsv: '📂 Choose CSV file', importSource: 'Source (e.g. Notebook 1, pages 3–8)',
    importReady: (a, b) => `${a} rows ready, ${b} skipped (no Marma or no meaning)`, importGo: '⬆ Import', importDone: (n) => `${n} added ✔`,
    needSource: 'Please write the source.', error: 'Problem:',
    learnSoon: 'Learn Marma — coming soon',
    learnSoonText: 'Small fun lessons. They will be made only from checked Marma sentences.',
    honesty: 'This app never makes up Marma words. All Marma text and voices come from Marma speakers.',
    back: '← Back'
  }
};
const KINDS = ['word', 'phrase', 'sentence', 'question', 'proverb', 'idiom', 'number', 'name', 'song_line', 'other'];
const SPEECH_LANG = { bn: 'bn-BD', en: 'en-US' };

/* ================= Settings saved on the phone ================= */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
let lang = store.get('lang', 'bn');
const t = (k, ...a) => { const v = (T[lang] && T[lang][k]) ?? T.en[k] ?? k; return typeof v === 'function' ? v(...a) : v; };

/* ================= Small helpers ================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s || '').toLowerCase().normalize('NFC')
  .replace(/[.,!?;:"'()\[\]।৷…“”‘’\-–—_၊။]/g, ' ').replace(/\s+/g, ' ').trim();
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }));
const deviceId = store.get('deviceId', '') || (() => { const d = uuid(); store.set('deviceId', d); return d; })();
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 3500);
}
function ago(iso) {
  if (!iso) return t('syncNever');
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return m < 1 ? t('justNow') : m < 60 ? t('minAgo', m) : m < 1440 ? t('hrAgo', Math.round(m / 60)) : t('dayAgo', Math.round(m / 1440));
}
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
const options = (obj, cur) => Object.entries(obj).map(([v, l]) => `<option value="${v}" ${v === (cur || '') ? 'selected' : ''}>${esc(l)}</option>`).join('');
const extOf = (type) => (/webm/.test(type) ? 'webm' : /ogg/.test(type) ? 'ogg' : /mp4|aac|m4a/.test(type) ? 'm4a' : /mpeg|mp3/.test(type) ? 'mp3' : /wav/.test(type) ? 'wav' : /png/.test(type) ? 'png' : /webp/.test(type) ? 'webp' : 'jpg');

/* ================= Supabase connection (plain web requests, no extra library) ================= */
const CFG = { url: String((window.MARMA_CONFIG || {}).SUPABASE_URL || '').replace(/\/+$/, ''), key: String((window.MARMA_CONFIG || {}).SUPABASE_KEY || '') };
const Auth = {
  session: JSON.parse(store.get('sbSession', 'null')),
  reviewer: JSON.parse(store.get('sbReviewer', 'null')),
  save() { store.set('sbSession', JSON.stringify(this.session)); store.set('sbReviewer', JSON.stringify(this.reviewer)); },
  async token(body, grant) {
    const r = await fetch(`${CFG.url}/auth/v1/token?grant_type=${grant}`, { method: 'POST', headers: { apikey: CFG.key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    const s = await r.json();
    this.session = { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at || Math.floor(Date.now() / 1000) + (s.expires_in || 3600), user: { id: s.user && s.user.id, email: s.user && s.user.email } };
    this.save();
  },
  async login(email, password) {
    await this.token({ email, password }, 'password');
    const rows = await API.rest(`reviewers?select=display_name,is_admin&user_id=eq.${this.session.user.id}`);
    this.reviewer = rows && rows[0] ? rows[0] : null; this.save();
  },
  async fresh() {
    if (!this.session || this.session.expires_at * 1000 - Date.now() > 60000) return;
    try { await this.token({ refresh_token: this.session.refresh_token }, 'refresh_token'); }
    catch (e) { this.logout(); }
  },
  logout() {
    if (this.session) fetch(`${CFG.url}/auth/v1/logout`, { method: 'POST', headers: { apikey: CFG.key, Authorization: 'Bearer ' + this.session.access_token } }).catch(() => {});
    this.session = null; this.reviewer = null; this.save();
  }
};
const API = {
  on: () => !!(CFG.url && CFG.key),
  headers(extra = {}) { const h = { apikey: CFG.key, ...extra }; if (Auth.session) h.Authorization = 'Bearer ' + Auth.session.access_token; return h; },
  async rest(path, opts = {}) {
    await Auth.fresh();
    const r = await fetch(`${CFG.url}/rest/v1/${path}`, { ...opts, headers: this.headers({ 'Content-Type': 'application/json', ...(opts.headers || {}) }) });
    const text = await r.text();
    if (!r.ok) { const e = new Error(text || r.statusText); e.status = r.status; throw e; }
    return text ? JSON.parse(text) : null;
  },
  insert(table, rows) { return this.rest(table, { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(rows) }); },
  patch(table, filter, data) { return this.rest(`${table}?${filter}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(data) }); },
  rpc(fn, args) { return this.rest(`rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) }); },
  async upload(bucket, path, blob) {
    await Auth.fresh();
    const r = await fetch(`${CFG.url}/storage/v1/object/${bucket}/${path}`, { method: 'POST',
      headers: this.headers({ 'Content-Type': (blob.type || 'application/octet-stream').split(';')[0], 'x-upsert': 'false' }), body: blob });
    if (!r.ok) { const txt = await r.text(); if (/exist|duplicate/i.test(txt)) return path; throw new Error(txt); }
    return path;
  },
  async download(bucket, path) {
    await Auth.fresh();
    const r = await fetch(`${CFG.url}/storage/v1/object/authenticated/${bucket}/${path}`, { headers: this.headers() });
    if (!r.ok) throw new Error(await r.text());
    return r.blob();
  },
  async remove(bucket, paths) {
    if (!paths.length) return;
    await fetch(`${CFG.url}/storage/v1/object/${bucket}`, { method: 'DELETE', headers: this.headers({ 'Content-Type': 'application/json' }), body: JSON.stringify({ prefixes: paths }) }).catch(() => {});
  },
  publicUrl: (path) => path ? `${CFG.url}/storage/v1/object/public/media/${path}` : ''
};

/* ================= Storage on the phone (IndexedDB) ================= */
const DB = {
  db: null, STORES: ['mine', 'entries', 'prompts', 'categories'],
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('marma-app', 3);
      r.onupgradeneeded = () => { for (const n of this.STORES) if (!r.result.objectStoreNames.contains(n)) r.result.createObjectStore(n, { keyPath: 'id' }); };
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async run(name, mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tr = db.transaction(name, mode); const st = tr.objectStore(name); const req = fn(st);
      tr.oncomplete = () => res(req && 'result' in req ? req.result : undefined); tr.onerror = () => rej(tr.error);
    });
  },
  all(n) { return this.run(n, 'readonly', (s) => s.getAll()).catch(() => []); },
  put(n, item) { return this.run(n, 'readwrite', (s) => s.put(item)); },
  del(n, id) { return this.run(n, 'readwrite', (s) => s.delete(id)); },
  putMany(n, items, clearFirst = false) { return this.run(n, 'readwrite', (s) => { if (clearFirst) s.clear(); items.forEach((i) => s.put(i)); return null; }); },
  delMany(n, ids) { return this.run(n, 'readwrite', (s) => { ids.forEach((i) => s.delete(i)); return null; }); }
};

/* ================= Data in memory ================= */
let ENTRIES = [], PROMPTS = [], CATEGORIES = [], MINE = [];
let SYNC = { state: 'idle', at: store.get('lastSyncAt', '') };

async function loadLocal() {
  [ENTRIES, PROMPTS, CATEGORIES, MINE] = await Promise.all(['entries', 'prompts', 'categories', 'mine'].map((n) => DB.all(n)));
  // Tidy the outbox: give words saved by the older app version a proper ID, and remove sent words once approved
  const isUuid = (x) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
  const approvedKeys = new Set(ENTRIES.map((e) => norm(e.marma) + '|' + norm(e.bn || e.en)));
  for (const m of MINE) {
    if (!isUuid(m.id)) { await DB.del('mine', m.id); m.id = uuid(); m.type = m.type || 'sentence'; m.sent = false; m.created = m.created || new Date().toISOString(); await DB.put('mine', m); }
    else if (m.sent && approvedKeys.has(norm(m.marma) + '|' + norm(m.bn || m.en))) { await DB.del('mine', m.id); m.gone = true; }
  }
  MINE = MINE.filter((m) => !m.gone);
  // First visit with no saved copy yet: use the starter lists that come with the app
  if (!CATEGORIES.length) { try { CATEGORIES = (await (await fetch('data/categories.json')).json()).categories; } catch (e) {} }
  if (!PROMPTS.length && !store.get('lastSync', '')) {
    try { PROMPTS = (await (await fetch('data/phrases.json')).json()).phrases.map((p) => ({ id: p.id, bn: p.bn, en: p.en, category_id: p.cat, is_active: true })); } catch (e) {}
  }
}

// Download what changed since last time (or everything, the first time)
async function syncDown() {
  if (!API.on() || !navigator.onLine) return;
  const since = store.get('lastSync', '1970-01-01T00:00:00Z');
  let newest = since;
  for (let page = 0; ; page++) {
    const rows = await API.rest(`entries?select=*&updated_at=gte.${encodeURIComponent(since)}&order=updated_at.asc,id.asc&limit=1000&offset=${page * 1000}`);
    await DB.putMany('entries', rows.filter((r) => !r.is_deleted));
    await DB.delMany('entries', rows.filter((r) => r.is_deleted).map((r) => r.id));
    for (const r of rows) if (r.updated_at > newest) newest = r.updated_at;
    if (rows.length < 1000) break;
  }
  const [prompts, cats] = await Promise.all([API.rest('prompts?select=*&is_active=eq.true&order=created_at.asc'), API.rest('categories?select=*&order=sort.asc')]);
  await DB.putMany('prompts', prompts, true);
  await DB.putMany('categories', cats, true);
  store.set('lastSync', newest);
}

// Send everything waiting in the outbox (new words with their voice/photo, and mistake reports)
async function syncUp() {
  if (!API.on() || !navigator.onLine) return;
  for (const m of MINE.filter((x) => !x.sent)) {
    try { await sendOne(m); } catch (e) { if (!navigator.onLine || !e.status) throw e; console.warn('could not send', m, e); }
  }
  const reports = JSON.parse(store.get('reportOutbox', '[]'));
  while (reports.length) {
    try { await API.insert('reports', [reports[0]]); } catch (e) { if (!e.status) throw e; console.warn('report dropped', e); }
    reports.shift(); store.set('reportOutbox', JSON.stringify(reports));
  }
}
async function sendOne(m) {
  {
    if (m.audioBlob && !m.audio_path) { m.audio_path = await API.upload('submissions', `audio/${m.id}.${extOf(m.audioBlob.type)}`, m.audioBlob); await DB.put('mine', m); }
    if (m.imageBlob && !m.image_path) { m.image_path = await API.upload('submissions', `image/${m.id}.${extOf(m.imageBlob.type)}`, m.imageBlob); await DB.put('mine', m); }
    const row = { id: m.id, kind: m.type, marma: m.marma, marma_bn_script: m.marma_bn_script || null, pronunciation: m.pronunciation || null,
      bn: m.bn || null, en: m.en || null, part_of_speech: m.part_of_speech || null, category_id: m.cat || null,
      example_marma: m.example_marma || null, example_bn: m.example_bn || null, example_en: m.example_en || null,
      notes: m.notes || null, dialect: m.dialect || null, audio_path: m.audio_path || null, image_path: m.image_path || null,
      contributor_name: m.contributor_name || null, speaker_gender: m.speaker_gender || null, age_group: m.age_group || null,
      consent_for_training: !!m.consent, device_id: deviceId };
    try { await API.insert('submissions', [row]); }
    catch (e) { if (e.status !== 409) throw e; } // 409 = already sent earlier
    m.sent = true; m.sentAt = new Date().toISOString(); await DB.put('mine', m);
  }
}

let syncing = null;
function sync(showToast = false) {
  if (!API.on()) return Promise.resolve();
  if (syncing) return syncing;
  SYNC.state = 'busy'; paintSync();
  syncing = (async () => {
    try {
      await loadLocal(); await syncUp(); await syncDown();
      SYNC = { state: 'ok', at: new Date().toISOString() }; store.set('lastSyncAt', SYNC.at);
    } catch (e) { console.warn('sync', e); SYNC.state = navigator.onLine ? 'fail' : 'idle'; }
    await loadLocal(); syncing = null;
    const name = route();
    if (['home', 'dictionary', 'phrasebook', 'add'].includes(name)) render(); else paintSync();
    if (showToast && SYNC.state === 'ok') toast('✔');
  })();
  return syncing;
}

/* ================= All entries together, with how much to trust each ================= */
const catName = (id) => { const c = CATEGORIES.find((x) => x.id === id); return c ? (lang === 'bn' ? c.name_bn : c.name_en) : ''; };
function allEntries() {
  const out = [], seen = new Set();
  const add = (e) => { const k = [norm(e.marma), norm(e.bn), norm(e.en)].join('|'); if (seen.has(k)) return; seen.add(k); out.push(e); };
  ENTRIES.forEach((e) => add({ ...e, type: e.kind, cat: e.category_id, trust: 'checked', audio: API.publicUrl(e.audio_path), image: API.publicUrl(e.image_path) }));
  MINE.forEach((m) => add({ ...m, trust: m.sent ? 'sent' : 'wait' }));
  const have = new Set(out.flatMap((e) => [norm(e.bn), norm(e.en)]).filter(Boolean));
  PROMPTS.forEach((p) => { if (!have.has(norm(p.bn)) && !have.has(norm(p.en))) add({ id: 'p-' + p.id, type: 'sentence', bn: p.bn, en: p.en, cat: p.category_id, marma: '', trust: 'empty' }); });
  return out;
}
const withMarma = () => allEntries().filter((e) => e.marma);
const audioSrc = (e) => e.audio || (e.audioBlob ? URL.createObjectURL(e.audioBlob) : '');
const imageSrc = (e) => e.image || (e.imageBlob ? URL.createObjectURL(e.imageBlob) : '');

function badge(e) {
  if (e.trust === 'checked') return `<span class="badge ok">${t('checked')}${e.checked_by ? ' · ' + esc(e.checked_by) : ''}</span>`;
  if (e.trust === 'sent') return `<span class="badge warn">${t('mineSent')}</span>`;
  return `<span class="badge warn">${t('mineWait')}</span>`;
}

/* ================= Voice ================= */
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
const micErrorText = (err) => err === 'nosr' ? t('noSR') : err === 'offline' ? t('micNeedsNet') : t('srError');
function speak(text, which) {
  if (!('speechSynthesis' in window)) { toast(t('noBnVoice')); return; }
  const u = new SpeechSynthesisUtterance(text); u.lang = SPEECH_LANG[which]; u.rate = 0.9;
  const voice = speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(which));
  if (voice) u.voice = voice; else if (which === 'bn') toast(t('noBnVoice'));
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
if ('speechSynthesis' in window) speechSynthesis.getVoices();
function playEntry(e) { const src = audioSrc(e); if (src) new Audio(src).play().catch(() => toast(t('noVoiceYet'))); else toast(t('noVoiceYet')); }
function sayResult(e, which) { if (which === 'marma') playEntry(e); else speak(e[which], which); }

function reportEntry(e) {
  const msg = prompt(t('reportAsk')); if (!msg || !msg.trim()) return;
  const q = JSON.parse(store.get('reportOutbox', '[]'));
  q.push({ entry_id: e.id, message: msg.trim().slice(0, 1000), device_id: deviceId });
  store.set('reportOutbox', JSON.stringify(q)); toast(t('reportThanks')); sync();
}
async function removeEntry(e) {
  if (!confirm(t('confirmDel'))) return;
  try { await API.patch('entries', `id=eq.${e.id}`, { is_deleted: true }); await DB.del('entries', e.id); await loadLocal(); toast(t('removed')); render(); }
  catch (err) { toast(t('error') + ' ' + err.message); }
}

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
let CARD_ENTRIES = [];
const cardIndex = (e) => CARD_ENTRIES.push(e) - 1;

function syncLine() {
  if (!API.on()) return `<div class="note warn">${t('notConnected')}</div>`;
  const waiting = MINE.filter((m) => !m.sent).length + JSON.parse(store.get('reportOutbox', '[]')).length;
  const status = SYNC.state === 'busy' ? t('syncing') : SYNC.state === 'fail' ? t('syncFail') : t('syncOk', ago(SYNC.at));
  return `<div class="note" id="syncNote"><div>${status}</div>${waiting ? `<div style="margin-top:4px">${t('outboxCount', waiting)}</div>` : ''}
    <div class="btn-row"><button class="btn small secondary" id="syncBtn">${t('refresh')}</button>
    <button class="btn small secondary" id="offlineMediaBtn">${t('saveOffline')}</button></div></div>`;
}
function paintSync() { const n = $('#syncNote'); if (n) { n.outerHTML = syncLine(); wireSync(); } }
function wireSync() {
  if ($('#syncBtn')) $('#syncBtn').onclick = () => sync(true);
  if ($('#offlineMediaBtn')) $('#offlineMediaBtn').onclick = saveMediaOffline;
}
async function saveMediaOffline() {
  const urls = ENTRIES.flatMap((e) => [API.publicUrl(e.audio_path), API.publicUrl(e.image_path)]).filter(Boolean);
  const btn = $('#offlineMediaBtn'); let done = 0;
  for (const u of urls) { try { await fetch(u); } catch (e) { try { await fetch(u, { mode: 'no-cors' }); } catch (e2) {} } done++; if (btn) btn.textContent = t('savingOffline', done, urls.length); }
  if (btn) btn.textContent = t('saveOffline'); toast(t('savedOffline'));
}

views.home = () => {
  const mm = withMarma();
  return `
  <p class="muted">${t('welcome')}</p>
  <div class="tiles">
    <a class="tile" href="#translate"><span class="emoji">🔁</span>${t('translate')}</a>
    <a class="tile" href="#talk"><span class="emoji">🗣️</span>${t('talk')}</a>
    <a class="tile" href="#phrasebook"><span class="emoji">📖</span>${t('phrasebook')}</a>
    <a class="tile" href="#dictionary"><span class="emoji">🔤</span>${t('dictionary')}</a>
    <a class="tile soon" href="#learn"><span class="emoji">🎓</span>${t('learn')}<small>${t('soon')}</small></a>
    <a class="tile" href="#add"><span class="emoji">➕</span>${t('add')}</a>
  </div>
  <p class="muted" style="text-align:center;margin-top:12px">${t('stats', mm.filter((e) => e.type !== 'word').length, mm.filter((e) => e.type === 'word').length)}</p>
  ${syncLine()}
  <div class="note">${t('honesty')}</div>`;
};

/* ---------- Translate ---------- */
views.translate = () => {
  const dirs = [['bn', 'marma'], ['en', 'marma'], ['marma', 'bn'], ['marma', 'en']];
  const cur = store.get('dir', 'bn>marma'), from = cur.split('>')[0];
  return `
  <h2>🔁 ${t('translate')}</h2>
  <label for="dir">${t('from')}</label>
  <select id="dir">${dirs.map(([a, b]) => `<option value="${a}>${b}" ${cur === a + '>' + b ? 'selected' : ''}>${t(a)} → ${t(b)}</option>`).join('')}</select>
  <label for="src">${t('typeLabel')}</label>
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
function resultCard(e, to, from, close) {
  const i = cardIndex(e), img = imageSrc(e);
  return `<div class="card">
    ${close ? `<p class="muted" style="margin:0 0 6px">${t('youMeant')} <b>${esc(e[from])}</b></p>` : ''}
    ${img ? `<img src="${esc(img)}" alt="" class="thumb">` : ''}
    <div class="result ${to === 'marma' ? 'marma' : ''}">${esc(e[to])}</div>
    ${to === 'marma' && e.marma_bn_script ? `<div class="line muted">${esc(e.marma_bn_script)}</div>` : ''}
    <div class="btn-row"><button class="btn small secondary sayBtn" data-i="${i}" data-to="${to}">${to === 'marma' ? t('play') : t('speak')}</button>
    ${e.trust === 'checked' ? `<button class="btn small secondary reportBtn" data-i="${i}">${t('report')}</button>` : ''}</div>
    ${badge(e)} ${close ? `<br><span class="badge warn">${t('similar')}</span>` : ''}
  </div>`;
}
function doTranslate() {
  const [from, to] = $('#dir').value.split('>');
  store.set('dir', from + '>' + to);
  const raw = $('#src').value, q = norm(raw), out = $('#trOut');
  $('#sugg').innerHTML = ''; CARD_ENTRIES = [];
  if (!q) { out.innerHTML = ''; return; }
  const matches = findMatches(raw, from);
  const best = matches.find((m) => m.e[to]);
  const exactNoMarma = matches.find((m) => m.score === 1 && !m.e[to]);
  if (best && best.score === 1) out.innerHTML = resultCard(best.e, to, from, false);
  else if (exactNoMarma) {
    out.innerHTML = `<div class="note warn">${t('inListNoMarma')}</div><a class="btn secondary" href="#add" id="addFromTr">${t('addMarma')}</a>`;
    $('#addFromTr').onclick = () => sessionStorage.setItem('prefill', JSON.stringify({ bn: exactNoMarma.e.bn, en: exactNoMarma.e.en, cat: exactNoMarma.e.cat, type: 'sentence' }));
    return;
  } else if (best && best.score >= 0.6) out.innerHTML = resultCard(best.e, to, from, true);
  else {
    const words = q.split(' ');
    const dict = new Map(allEntries().filter((e) => e.type === 'word' && e.trust === 'checked' && e[from] && e[to]).map((w) => [norm(w[from]), w[to]]));
    const parts = words.map((w) => dict.get(w));
    if (words.length > 1 && dict.size && parts.some(Boolean)) {
      out.innerHTML = `<div class="card"><div class="result">${parts.map((p, i) => p ? esc(p) : `<span class="missing">[${esc(words[i])}?]</span>`).join(' ')}</div>
        <span class="badge warn">${t('guess')}</span><p class="muted" style="margin-top:8px">${t('guessExplain')}</p></div>`;
      return;
    }
    out.innerHTML = `<div class="note warn"><b>${t('notFound')}</b><br>${t('notFoundHelp')}</div><a class="btn secondary" href="#add" id="addFromTr">${t('addThis')}</a>`;
    $('#addFromTr').onclick = () => sessionStorage.setItem('prefill', JSON.stringify({ [from]: raw.trim() }));
    return;
  }
  wireCards(out);
}

/* ---------- Talk ---------- */
views.talk = () => `
  <h2>🗣️ ${t('talkTitle')}</h2>
  ${withMarma().some((e) => e.bn) ? '' : `<div class="note warn">${t('talkNoData')}</div><a class="btn secondary" href="#add">${t('addMarma')}</a>`}
  <div class="card" style="border-color:var(--brand)">
    <h3 style="margin-top:0">🇧🇩 ${t('bnSpeaker')}</h3>
    <button class="btn full" id="talkMic">${t('pressSpeak')}</button>
    <p class="muted" style="font-size:.8rem;margin-top:6px">${t('privacyMic')}</p>
    <div id="talkBnOut" aria-live="polite"></div>
  </div>
  <div class="card" style="border-color:var(--accent)">
    <h3 style="margin-top:0">🗣️ ${t('mmSpeaker')}</h3>
    <p>${t('pickMarma')}</p><p class="muted" style="font-size:.85rem">${t('talkHelp')}</p>
    <input type="search" id="talkFilter" placeholder="${t('search')}" aria-label="${t('search')}">
    <div id="talkMmList"></div>
  </div>`;
function renderTalkList() {
  const q = norm($('#talkFilter').value);
  const list = withMarma().filter((e) => e.bn && (!q || [e.marma, e.marma_bn_script, e.bn, e.en].some((x) => norm(x).includes(q))));
  $('#talkMmList').innerHTML = list.map((e, i) => `
    <button class="chip mmPick" data-i="${i}" style="display:block;width:100%;text-align:left;margin:8px 0;white-space:normal;border-radius:14px;padding:10px 14px">
      <span class="marma" style="font-size:1.15rem;font-weight:700">${esc(e.marma)}</span>${e.marma_bn_script ? `<br><span class="muted">${esc(e.marma_bn_script)}</span>` : ''}</button>`).join('') || `<p class="muted">${t('noResults')}</p>`;
  $$('.mmPick').forEach((b) => b.onclick = () => {
    const e = list[+b.dataset.i];
    $('#talkBnOut').innerHTML = `<div class="note"><div class="result">${esc(e.bn)}</div>${badge(e)}</div>`;
    speak(e.bn, 'bn'); $('#talkBnOut').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
async function talkListen() {
  const btn = $('#talkMic'), out = $('#talkBnOut');
  btn.disabled = true; btn.textContent = t('listening');
  try {
    const heard = await listen(SPEECH_LANG.bn);
    const best = findMatches(heard, 'bn').find((m) => m.e.marma);
    CARD_ENTRIES = [];
    if (best && best.score >= 0.6) {
      out.innerHTML = `<p class="muted" style="margin-top:10px">${t('heard')} “${esc(heard)}”</p>${resultCard(best.e, 'marma', 'bn', best.score < 1)}`;
      wireCards(out); if (audioSrc(best.e)) playEntry(best.e);
    } else out.innerHTML = `<p class="muted" style="margin-top:10px">${t('heard')} “${esc(heard)}”</p><div class="note warn"><b>${t('notFound')}</b> ${t('orPick')}</div>`;
  } catch (err) { if (err !== 'noresult' && err !== 'aborted') toast(micErrorText(err)); }
  finally { btn.disabled = false; btn.textContent = t('pressSpeak'); }
}

/* ---------- Phrasebook ---------- */
let phraseCat = 'all';
views.phrasebook = () => {
  const list = allEntries().filter((e) => !['word', 'number', 'name'].includes(e.type));
  const cats = CATEGORIES.filter((c) => list.some((p) => p.cat === c.id));
  return `
  <h2>📖 ${t('phrasebook')}</h2>
  <div class="note">${t('phraseNote')}</div>
  <div class="chips">${[{ id: 'all' }, ...cats].map((c) =>
    `<button class="chip catChip ${phraseCat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.id === 'all' ? t('all') : esc(catName(c.id))}</button>`).join('')}</div>
  <div id="phraseList">${list.filter((p) => phraseCat === 'all' || p.cat === phraseCat).map(phraseCard).join('')}</div>`;
};
function phraseCard(p) {
  const i = cardIndex(p);
  const first = lang === 'bn' ? p.bn : p.en, second = lang === 'bn' ? p.en : p.bn;
  return `<div class="card">
    ${first ? `<div class="line"><b>${esc(first)}</b></div>` : ''}${second ? `<div class="line muted">${esc(second)}</div>` : ''}
    <div class="line">${p.marma ? `<span class="marma">${esc(p.marma)}</span>${p.marma_bn_script ? ` <span class="muted">(${esc(p.marma_bn_script)})</span>` : ''}` : `<span class="missing">${t('noMarmaYet')}</span>`}</div>
    <div class="btn-row">
      ${p.marma ? `<button class="btn small secondary playCard" data-i="${i}">${t('play')}</button> ${badge(p)}`
               : `<a class="btn small secondary addMarma" href="#add" data-i="${i}">${t('addMarma')}</a>`}
    </div></div>`;
}

/* ---------- Dictionary ---------- */
let dictFilter = 'all';
views.dictionary = () => {
  const present = KINDS.filter((k) => withMarma().some((e) => e.type === k));
  return `
  <h2>🔤 ${t('dictionary')}</h2>
  <input type="search" id="dq" placeholder="${t('search')}" aria-label="${t('search')}">
  <div class="chips" style="margin-top:10px">${['all', ...present].map((k) =>
    `<button class="chip dchip ${dictFilter === k ? 'on' : ''}" data-k="${k}">${k === 'all' ? t('all') : t('kinds')[k]}</button>`).join('')}</div>
  <div id="dList"></div>
  <a class="btn secondary full" href="#add" id="dAdd" style="margin-top:10px">${t('addWord')}</a>`;
};
function renderDict() {
  const q = norm($('#dq').value);
  if (!withMarma().length) { $('#dList').innerHTML = `<div class="note"><b>${t('dictEmpty')}</b><br>${t('dictEmptyHelp')}</div>`; return; }
  const list = withMarma().filter((e) => dictFilter === 'all' || e.type === dictFilter)
    .filter((e) => !q || [e.marma, e.marma_bn_script, e.pronunciation, e.bn, e.en].some((x) => norm(x).includes(q)))
    .sort((a, b) => String(a.marma).localeCompare(String(b.marma))).slice(0, 300);
  CARD_ENTRIES = [];
  $('#dList').innerHTML = list.map((e) => { const i = cardIndex(e), img = imageSrc(e); return `<div class="card">
    ${img ? `<img src="${esc(img)}" alt="" class="thumb" loading="lazy">` : ''}
    <span class="marma">${esc(e.marma)}</span> <span class="muted" style="font-size:.8rem">(${esc(t('kinds')[e.type] || e.type)}${e.part_of_speech ? ' · ' + esc(t('pos')[e.part_of_speech] || '') : ''})</span>
    ${e.marma_bn_script ? `<div class="line muted">${esc(e.marma_bn_script)}</div>` : ''}
    ${e.pronunciation ? `<div class="line muted">/${esc(e.pronunciation)}/</div>` : ''}
    ${e.bn ? `<div class="line">${t('bn')}: ${esc(e.bn)}</div>` : ''}${e.en ? `<div class="line muted">${t('en')}: ${esc(e.en)}</div>` : ''}
    ${e.example_marma ? `<div class="line" style="margin-top:6px">📝 <span class="marma">${esc(e.example_marma)}</span>${e.example_bn ? ' — ' + esc(e.example_bn) : ''}</div>` : ''}
    ${e.dialect ? `<div class="line muted" style="font-size:.85rem">📍 ${esc(e.dialect)}</div>` : ''}
    <div class="btn-row"><button class="btn small secondary playCard" data-i="${i}">${t('play')}</button>
    ${e.trust === 'checked' ? `<button class="btn small secondary reportBtn" data-i="${i}">${t('report')}</button>` : ''}
    ${e.trust === 'checked' && Auth.reviewer && navigator.onLine ? `<button class="btn small danger removeBtn" data-i="${i}">${t('removeEntry')}</button>` : ''}</div>
    ${badge(e)}</div>`; }).join('') || `<p class="muted">${t('noResults')}</p>`;
  wireCards($('#dList'));
}

/* ---------- Add ---------- */
views.add = () => `
  <h2>➕ ${t('addTitle')}</h2>
  <label for="fKind">${t('kind')}</label><select id="fKind">${options(t('kinds'), 'word')}</select>
  <label for="fMarma">${t('marmaText')}</label><textarea id="fMarma" class="marma" style="min-height:80px"></textarea>
  <label for="fMarmaBn">${t('marmaBn')}</label><input type="text" id="fMarmaBn">
  <p class="muted" style="font-size:.85rem">${t('needOne')}</p>
  <label for="fBn">${t('bnMeaning')} *</label><input type="text" id="fBn">
  <label for="fEn">${t('enMeaning')}</label><input type="text" id="fEn">
  <label for="fCat">${t('category')}</label><select id="fCat">${CATEGORIES.map((c) => `<option value="${esc(c.id)}">${esc(catName(c.id))}</option>`).join('')}</select>
  <details class="card"><summary style="font-weight:700;cursor:pointer;min-height:40px">${t('moreDetails')}</summary>
    <label for="fPron">${t('pron')}</label><input type="text" id="fPron">
    <label for="fPos">${t('posLabel')}</label><select id="fPos">${options(t('pos'), '')}</select>
    <label for="fExM">${t('exMarma')}</label><input type="text" id="fExM" class="marma">
    <label for="fExBn">${t('exBn')}</label><input type="text" id="fExBn">
    <label for="fExEn">${t('exEn')}</label><input type="text" id="fExEn">
    <label for="fDialect">${t('dialect')}</label><input type="text" id="fDialect">
    <label for="fNotes">${t('notes')}</label><textarea id="fNotes"></textarea>
  </details>
  <h3>${t('voiceTitle')}</h3>
  <div class="btn-row"><button class="btn secondary" id="recBtn">${t('record')}</button><span id="recState"></span></div>
  <audio id="recPreview" controls hidden style="width:100%"></audio>
  <label for="fPhoto">${t('photo')}</label>
  <input type="file" id="fPhoto" accept="image/*" style="min-height:48px">
  <p class="muted" style="font-size:.85rem">${t('photoHelp')}</p><img id="photoPreview" class="thumb" hidden alt="">
  <details class="card"><summary style="font-weight:700;cursor:pointer;min-height:40px">${t('aboutYou')}</summary>
    <label for="fName">${t('yourName')}</label><input type="text" id="fName" value="${esc(store.get('myName', ''))}">
    <p class="muted" style="font-size:.85rem">${t('nameNote')}</p>
    <label for="fGender">${t('gender')}</label><select id="fGender">${options(t('genders'), store.get('myGender', ''))}</select>
    <label for="fAge">${t('age')}</label><select id="fAge">${options(t('ages'), store.get('myAge', ''))}</select>
  </details>
  <label class="check"><input type="checkbox" id="fConsent" ${store.get('myConsent', '') === '1' ? 'checked' : ''}> ${t('consent')}</label>
  <div class="btn-row"><button class="btn full" id="saveBtn">${t('save')}</button></div>
  <h3>${t('mySentences')}</h3>
  <div id="mineList"></div>
  <a class="btn secondary full" href="#check" style="margin-top:20px">${t('forCheckers')}</a>`;

let recorder = null, recChunks = [], recBlob = null, photoBlob = null;
async function toggleRecord() {
  const btn = $('#recBtn'), state = $('#recState');
  if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recChunks = []; recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => e.data.size && recChunks.push(e.data);
    recorder.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop());
      recBlob = new Blob(recChunks, { type: (recorder.mimeType || 'audio/webm').split(';')[0] });
      const a = $('#recPreview'); if (!a) return; a.src = URL.createObjectURL(recBlob); a.hidden = false;
      btn.textContent = t('reRecord'); state.innerHTML = '';
    };
    recorder.start();
    btn.textContent = t('stop'); state.innerHTML = `<span class="rec-dot"></span> ${t('recording')}`;
    setTimeout(() => recorder && recorder.state === 'recording' && recorder.stop(), 30000);
  } catch (e) { toast(t('noMic')); }
}
// Makes photos small (max 1024 px) so they upload fast on slow networks and cheap phones
function shrinkImage(file) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1024 / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => res(b || file), 'image/jpeg', 0.75);
    };
    img.onerror = () => res(file); img.src = URL.createObjectURL(file);
  });
}
async function saveMine() {
  const v = (id) => ($('#' + id).value || '').trim();
  let marma = v('fMarma'); const marmaBn = v('fMarmaBn'), bn = v('fBn'), en = v('fEn');
  if (!marma) marma = marmaBn; // written only in Bangla letters
  if (!marma || (!bn && !en)) { toast(t('needMarma')); return; }
  store.set('myName', v('fName')); store.set('myGender', v('fGender')); store.set('myAge', v('fAge')); store.set('myConsent', $('#fConsent').checked ? '1' : '');
  await DB.put('mine', { id: uuid(), type: v('fKind'), marma, marma_bn_script: marmaBn, pronunciation: v('fPron'), bn, en, cat: v('fCat'),
    part_of_speech: v('fPos'), example_marma: v('fExM'), example_bn: v('fExBn'), example_en: v('fExEn'), dialect: v('fDialect'), notes: v('fNotes'),
    audioBlob: recBlob, imageBlob: photoBlob, contributor_name: v('fName'), speaker_gender: v('fGender'), age_group: v('fAge'),
    consent: $('#fConsent').checked, sent: false, created: new Date().toISOString() });
  recBlob = null; photoBlob = null;
  await loadLocal(); render();
  if (API.on() && navigator.onLine) { await sync(); toast(MINE.some((m) => !m.sent) ? t('savedOffline2') : t('sentNow')); }
  else toast(API.on() ? t('savedOffline2') : t('saved'));
}
function renderMine() {
  const mine = [...MINE].sort((a, b) => b.created.localeCompare(a.created));
  CARD_ENTRIES = [];
  $('#mineList').innerHTML = mine.length ? mine.map((m) => { const i = cardIndex({ ...m, trust: m.sent ? 'sent' : 'wait' }); return `<div class="card">
      <span class="marma">${esc(m.marma)}</span> <span class="muted" style="font-size:.8rem">(${esc(t('kinds')[m.type] || '')})</span>
      <div class="line">${esc(m.bn)}</div><div class="line muted">${esc(m.en)}</div>
      ${badge(CARD_ENTRIES[i])}
      <div class="btn-row">${m.audioBlob ? `<button class="btn small secondary playCard" data-i="${i}">${t('play')}</button>` : ''}
      ${!m.sent || !API.on() ? `<button class="btn small danger delMine" data-id="${m.id}">${t('del')}</button>` : ''}</div></div>`; }).join('')
    : `<p class="muted">${t('none')}</p>`;
  wireCards($('#mineList'));
  $$('.delMine').forEach((b) => b.onclick = async () => { if (confirm(t('confirmDel'))) { await DB.del('mine', b.dataset.id); await loadLocal(); renderMine(); } });
}

/* ---------- Checker page ---------- */
let checkTab = 'waiting', importRows = [];
views.check = () => {
  if (!API.on()) return `<h2>✅ ${t('checkTitle')}</h2><div class="note warn">${t('notConnected')}</div>`;
  if (!navigator.onLine) return `<h2>✅ ${t('checkTitle')}</h2><div class="note warn">${t('needNet')}</div>`;
  if (!Auth.session) return `
    <h2>✅ ${t('checkTitle')}</h2>
    <label for="lEmail">${t('email')}</label><input type="text" id="lEmail" inputmode="email" autocomplete="username">
    <label for="lPass">${t('password')}</label><input type="password" id="lPass" autocomplete="current-password" style="width:100%;min-height:56px;font-size:1.05rem;padding:12px 14px;border:2px solid var(--border);border-radius:14px;background:var(--card);color:var(--text)">
    <div class="btn-row"><button class="btn full" id="loginBtn">${t('login')}</button></div>`;
  if (!Auth.reviewer) return `<h2>✅ ${t('checkTitle')}</h2><div class="note warn">${t('notReviewer')}</div><button class="btn secondary" id="logoutBtn">${t('logout')}</button>`;
  return `
    <h2>✅ ${t('checkTitle')}</h2>
    <div class="btn-row" style="align-items:center"><span style="flex:1">${t('hello', esc(Auth.reviewer.display_name))}</span><button class="btn small secondary" id="logoutBtn">${t('logout')}</button></div>
    <div class="chips">${[['waiting', t('tabWaiting')], ['reports', t('tabReports')], ['import', t('tabImport')]].map(([k, l]) =>
      `<button class="chip tabChip ${checkTab === k ? 'on' : ''}" data-k="${k}">${l}</button>`).join('')}</div>
    <div id="checkBody"><p class="muted">⏳</p></div>`;
};

async function renderWaiting() {
  const body = $('#checkBody');
  let subs;
  try { subs = await API.rest('submissions?select=*&status=eq.pending&order=created_at.asc&limit=50'); }
  catch (e) { body.innerHTML = `<div class="note warn">${t('error')} ${esc(e.message)}</div>`; return; }
  body.innerHTML = `<div class="note">${t('checkIntro')}</div>` + (subs.map((s) => `
    <div class="card" data-id="${s.id}">
      <div class="sMedia" data-audio="${esc(s.audio_path || '')}" data-image="${esc(s.image_path || '')}">${s.audio_path || s.image_path ? '⏳' : `<p class="muted">${t('noVoiceYet')}</p>`}</div>
      <label>${t('kind')}</label><select class="sKind">${options(t('kinds'), s.kind)}</select>
      <label>${t('marmaText')}</label><textarea class="sMarma marma" style="min-height:70px">${esc(s.marma)}</textarea>
      ${s.marma_bn_script ? `<p class="muted">${t('marmaBn')}: ${esc(s.marma_bn_script)}</p>` : ''}
      <label>${t('bnMeaning')}</label><input type="text" class="sBn" value="${esc(s.bn || '')}">
      <label>${t('enMeaning')}</label><input type="text" class="sEn" value="${esc(s.en || '')}">
      <label>${t('category')}</label><select class="sCat">${CATEGORIES.map((c) => `<option value="${esc(c.id)}" ${c.id === s.category_id ? 'selected' : ''}>${esc(catName(c.id))}</option>`).join('')}</select>
      ${[s.pronunciation && `/${esc(s.pronunciation)}/`, s.example_marma && `📝 ${esc(s.example_marma)} — ${esc(s.example_bn || s.example_en || '')}`, s.dialect && `📍 ${esc(s.dialect)}`, s.notes && `💬 ${esc(s.notes)}`].filter(Boolean).map((x) => `<p class="muted" style="margin:6px 0">${x}</p>`).join('')}
      <p class="muted" style="font-size:.85rem;margin-top:8px">${t('sentBy')} ${esc(s.contributor_name || t('anon'))}${s.speaker_gender ? ' · ' + esc(t('genders')[s.speaker_gender]) : ''}${s.age_group ? ' · ' + esc(t('ages')[s.age_group]) : ''} · ${new Date(s.created_at).toLocaleDateString()}<br>${s.consent_for_training ? t('consentYes') : t('consentNo')}</p>
      <div class="btn-row"><button class="btn small okBtn">${t('approve')}</button><button class="btn small danger noBtn">${t('reject')}</button></div>
    </div>`).join('') || `<p class="muted">${t('none')}</p>`);
  // Load private voice/photo files (only checkers are allowed to)
  $$('.sMedia', body).forEach(async (box) => {
    const parts = [];
    try {
      if (box.dataset.audio) parts.push(`<audio controls src="${URL.createObjectURL(await API.download('submissions', box.dataset.audio))}" style="width:100%"></audio>`);
      if (box.dataset.image) parts.push(`<img class="thumb" alt="" src="${URL.createObjectURL(await API.download('submissions', box.dataset.image))}">`);
    } catch (e) { parts.push(`<p class="muted">${t('error')} ${esc(e.message)}</p>`); }
    if (parts.length) box.innerHTML = parts.join('');
  });
  $$('.okBtn', body).forEach((b) => b.onclick = () => approve(b.closest('.card'), subs.find((s) => s.id === b.closest('.card').dataset.id), b));
  $$('.noBtn', body).forEach((b) => b.onclick = () => reject(b.closest('.card'), subs.find((s) => s.id === b.closest('.card').dataset.id)));
}

async function approve(card, s, btn) {
  btn.disabled = true; btn.textContent = '⏳';
  try {
    const copy = async (path) => { if (!path) return null; const blob = await API.download('submissions', path); return API.upload('media', path, blob); };
    const audio = await copy(s.audio_path), image = await copy(s.image_path);
    await API.rpc('approve_submission', { p_id: s.id, p_audio_path: audio, p_image_path: image,
      p_kind: $('.sKind', card).value, p_marma: $('.sMarma', card).value.trim(), p_bn: $('.sBn', card).value.trim(), p_en: $('.sEn', card).value.trim(), p_category: $('.sCat', card).value });
    await API.remove('submissions', [s.audio_path, s.image_path].filter(Boolean));
    card.remove(); toast(t('approvedOk')); sync();
  } catch (e) { btn.disabled = false; btn.textContent = t('approve'); toast(t('error') + ' ' + e.message); }
}
async function reject(card, s) {
  const why = prompt(t('rejectWhy'));
  if (why === null) return;
  try {
    await API.patch('submissions', `id=eq.${s.id}`, { status: 'rejected', reviewer_note: why || null, reviewed_by: Auth.session.user.id, reviewed_at: new Date().toISOString() });
    await API.remove('submissions', [s.audio_path, s.image_path].filter(Boolean));
    card.remove(); toast(t('rejectedOk'));
  } catch (e) { toast(t('error') + ' ' + e.message); }
}

async function renderReports() {
  const body = $('#checkBody');
  let reps;
  try { reps = await API.rest('reports?select=*,entries(id,marma,bn,en)&status=eq.open&order=created_at.asc&limit=100'); }
  catch (e) { body.innerHTML = `<div class="note warn">${t('error')} ${esc(e.message)}</div>`; return; }
  body.innerHTML = reps.map((r) => `<div class="card" data-id="${r.id}">
      <p class="muted" style="margin:0">${t('reportOn')}</p>
      <div class="marma">${esc(r.entries && r.entries.marma)}</div><div class="line">${esc(r.entries && (r.entries.bn || r.entries.en))}</div>
      <div class="note warn">💬 ${esc(r.message)}</div>
      <div class="btn-row"><button class="btn small closeRep">${t('close')}</button>
      <button class="btn small danger delEntry" data-entry="${esc(r.entry_id)}">${t('removeEntry')}</button></div></div>`).join('') || `<p class="muted">${t('none')}</p>`;
  $$('.closeRep', body).forEach((b) => b.onclick = async () => {
    try { await API.patch('reports', `id=eq.${b.closest('.card').dataset.id}`, { status: 'closed' }); b.closest('.card').remove(); } catch (e) { toast(t('error') + ' ' + e.message); }
  });
  $$('.delEntry', body).forEach((b) => b.onclick = async () => {
    if (!confirm(t('confirmDel'))) return;
    try {
      await API.patch('entries', `id=eq.${b.dataset.entry}`, { is_deleted: true });
      await API.patch('reports', `id=eq.${b.closest('.card').dataset.id}`, { status: 'closed' });
      b.closest('.card').remove(); toast(t('removed')); sync();
    } catch (e) { toast(t('error') + ' ' + e.message); }
  });
}

// ---- Import many words from a CSV file (made in Google Sheets or Excel) ----
const CSV_COLUMNS = ['kind', 'marma', 'marma_bn_script', 'pronunciation', 'bn', 'en', 'category', 'part_of_speech', 'example_marma', 'example_bn', 'example_en', 'dialect', 'notes'];
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}
function renderImport() {
  $('#checkBody').innerHTML = `
    <div class="note">${t('importIntro')}</div>
    <div class="btn-row"><button class="btn small secondary" id="tplBtn">${t('template')}</button></div>
    <label for="impSource">${t('importSource')}</label><input type="text" id="impSource">
    <label class="btn secondary full" style="margin-top:14px">${t('chooseCsv')}<input type="file" id="impFile" accept=".csv,text/csv" hidden></label>
    <div id="impPreview"></div>`;
  $('#tplBtn').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + CSV_COLUMNS.join(',') + '\n'], { type: 'text/csv' }));
    a.download = 'marma-words-template.csv'; a.click();
  };
  $('#impFile').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const rows = parseCSV(await f.text()); const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
    const col = (r, name) => { const i = head.indexOf(name); return i < 0 ? '' : String(r[i] || '').trim(); };
    const catIds = new Set(CATEGORIES.map((c) => c.id)), POS = Object.keys(T.en.pos).filter(Boolean);
    importRows = []; let skipped = 0;
    for (const r of rows) {
      const marma = col(r, 'marma') || col(r, 'marma_bn_script'), bn = col(r, 'bn'), en = col(r, 'en');
      if (!marma || (!bn && !en)) { skipped++; continue; }
      const kind = col(r, 'kind'), cat = col(r, 'category'), pos = col(r, 'part_of_speech');
      importRows.push({ kind: KINDS.includes(kind) ? kind : 'word', marma, marma_bn_script: col(r, 'marma_bn_script') || null, pronunciation: col(r, 'pronunciation') || null,
        bn: bn || null, en: en || null, category_id: catIds.has(cat) ? cat : 'other', part_of_speech: POS.includes(pos) ? pos : null,
        example_marma: col(r, 'example_marma') || null, example_bn: col(r, 'example_bn') || null, example_en: col(r, 'example_en') || null,
        dialect: col(r, 'dialect') || null, notes: col(r, 'notes') || null });
    }
    $('#impPreview').innerHTML = `<div class="note">${t('importReady', importRows.length, skipped)}</div>
      ${importRows.slice(0, 5).map((r) => `<div class="card"><span class="marma">${esc(r.marma)}</span> — ${esc(r.bn || r.en)}</div>`).join('')}
      ${importRows.length ? `<button class="btn full" id="impGo">${t('importGo')}</button>` : ''}`;
    if ($('#impGo')) $('#impGo').onclick = doImport;
  };
}
async function doImport() {
  const source = $('#impSource').value.trim(); if (!source) { toast(t('needSource')); $('#impSource').focus(); return; }
  const btn = $('#impGo'); btn.disabled = true;
  try {
    for (let i = 0; i < importRows.length; i += 200) {
      btn.textContent = `⏳ ${i}/${importRows.length}`;
      await API.insert('entries', importRows.slice(i, i + 200).map((r) => ({ ...r, source, checked_by: Auth.reviewer.display_name })));
    }
    toast(t('importDone', importRows.length)); importRows = []; $('#impPreview').innerHTML = ''; sync();
  } catch (e) { btn.disabled = false; btn.textContent = t('importGo'); toast(t('error') + ' ' + e.message); }
}

views.learn = () => `<h2>🎓 ${t('learnSoon')}</h2><div class="note">${t('learnSoonText')}</div><a class="btn secondary" href="#home">${t('back')}</a>`;

/* ================= Page switching ================= */
const route = () => (location.hash || '#home').slice(1);
function render() {
  const name = route();
  const view = views[name] || views.home;
  document.documentElement.lang = lang;
  $('#appTitle').textContent = t('appTitle');
  $('#langBtn').textContent = t('switchTo');
  $('#homeBtn').setAttribute('aria-label', t('home'));
  CARD_ENTRIES = [];
  const keepScroll = render.last === name ? window.scrollY : 0;
  $('#app').innerHTML = view();
  wire(name);
  paintOffline();
  if (render.last !== name) { $('#app').focus({ preventScroll: true }); window.scrollTo(0, 0); } else window.scrollTo(0, keepScroll);
  render.last = name;
}
function wireCards(root = document) {
  $$('.playCard', root).forEach((b) => b.onclick = () => playEntry(CARD_ENTRIES[+b.dataset.i]));
  $$('.sayBtn', root).forEach((b) => b.onclick = () => sayResult(CARD_ENTRIES[+b.dataset.i], b.dataset.to));
  $$('.reportBtn', root).forEach((b) => b.onclick = () => reportEntry(CARD_ENTRIES[+b.dataset.i]));
  $$('.removeBtn', root).forEach((b) => b.onclick = () => removeEntry(CARD_ENTRIES[+b.dataset.i]));
}
function wire(name) {
  wireCards(); wireSync();
  if (name === 'translate') {
    $('#goTr').onclick = doTranslate; $('#src').oninput = showSuggestions;
    $('#dir').onchange = () => { store.set('dir', $('#dir').value); render.last = ''; render(); };
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
    $$('.catChip').forEach((c) => c.onclick = () => { phraseCat = c.dataset.cat; render(); });
    $$('.addMarma').forEach((a) => a.onclick = () => { const p = CARD_ENTRIES[+a.dataset.i];
      sessionStorage.setItem('prefill', JSON.stringify({ bn: p.bn, en: p.en, cat: p.cat, type: 'sentence' })); });
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
    if (pre.cat && CATEGORIES.some((c) => c.id === pre.cat)) $('#fCat').value = pre.cat;
    $('#recBtn').onclick = toggleRecord; $('#saveBtn').onclick = saveMine;
    $('#fPhoto').onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      photoBlob = await shrinkImage(f); const p = $('#photoPreview'); p.src = URL.createObjectURL(photoBlob); p.hidden = false;
    };
    renderMine();
  }
  if (name === 'check') {
    if ($('#loginBtn')) $('#loginBtn').onclick = async () => {
      const b = $('#loginBtn'); b.disabled = true;
      try { await Auth.login($('#lEmail').value.trim(), $('#lPass').value); render(); }
      catch (e) { Auth.logout(); b.disabled = false; toast(t('loginFail')); }
    };
    if ($('#logoutBtn')) $('#logoutBtn').onclick = () => { Auth.logout(); render(); };
    $$('.tabChip').forEach((c) => c.onclick = () => { checkTab = c.dataset.k; render(); });
    if ($('#checkBody')) (checkTab === 'reports' ? renderReports : checkTab === 'import' ? renderImport : renderWaiting)();
  }
}

/* ================= Top bar, theme, offline notice ================= */
function isDark() { const th = document.documentElement.dataset.theme; return th ? th === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
function paintThemeBtn() { $('#themeBtn').textContent = isDark() ? '☀️' : '🌙'; }
$('#themeBtn').onclick = () => { const th = isDark() ? 'light' : 'dark'; document.documentElement.dataset.theme = th; store.set('theme', th); paintThemeBtn(); };
$('#langBtn').onclick = () => { lang = lang === 'bn' ? 'en' : 'bn'; store.set('lang', lang); render(); };
$('#homeBtn').onclick = () => { location.hash = '#home'; };
function paintOffline() { const bar = $('#offlineBar'); bar.hidden = navigator.onLine; bar.textContent = t('offline'); }
window.addEventListener('online', () => { paintOffline(); sync(); });
window.addEventListener('offline', () => { paintOffline(); if (route() === 'check') render(); });
window.addEventListener('hashchange', render);
document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
setInterval(() => sync(), 10 * 60 * 1000); // check for new words every 10 minutes

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

loadLocal().then(() => { paintThemeBtn(); render(); sync(); });
