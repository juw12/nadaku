const FLAG_ID = '<svg class="flag-id" viewBox="0 0 3 2" width="1.3em" height="0.87em" aria-hidden="true" style="vertical-align:-0.1em;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.15)"><rect width="3" height="1" fill="#CE1126"/><rect y="1" width="3" height="1" fill="#fff"/></svg>';
/* Nadaku — offline-first Mandarin trainer for Indonesian learners (HSK 3.0, levels 1-6).
   Vanilla JS, no build step, no server, no account. */
"use strict";

// ---------- Constants ----------
const STORE_KEY = "nadaku.v2";
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const NEW_PER_SESSION = 5;
const REVIEW_LIMIT = 30;
const TONE_ROUNDS = 10;
const TEST_QUESTIONS = 10;
const LIST_PAGE = 60;

// ---------- Vocabulary ----------
// WORDS rows: [hanzi, pinyin, level, indonesian, english, audioPlan]
// audioPlan: 1 = recorded word file; otherwise "syl|syl~" (syllable recordings, ~ = neutral/light)
const VOCAB = WORDS.map(([hanzi, pinyin, level, id, en, audio], i) => ({ i, hanzi, pinyin, level, id, en, audio }));
const BY_HANZI = new Map(VOCAB.map((w) => [w.hanzi, w]));
const LEVELS = [1, 2, 3, 4, 5, 6];

// ---------- i18n ----------
const STRINGS = {
  id: {
    home: "Beranda", vocab: "Kosakata", tones: "Nada", write: "Tulis", talk: "Bicara", exam: "Ujian",
    greeting: "Ayo belajar hari ini!", dailyGoal: "Target harian", streak: "hari beruntun",
    memoryTitle: "Meteran Memori", memoryNow: "kata yang kamu ingat sekarang",
    memoryDesc: "Perkiraan kata yang benar-benar masih kamu ingat (model FSRS), bukan sekadar jumlah kata.",
    in7: "Tanpa review, 7 hari lagi tinggal", learned: "Dipelajari", due: "Perlu review", strong: "Kuat",
    week: "Aktivitas 7 hari", start: "Mulai", reviewNow: "Review sekarang", learnNew: "Pelajari 5 kata baru",
    reviewDesc: "kartu menunggu", newDesc: "audio penutur asli + contoh", toneDesc: "Dengar & ucapkan 4 nada",
    talkDesc: "Roleplay, jalan offline", weakTone: "Nada terlemahmu", practice: "Latihan", next: "Lanjut",
    show: "Tunjukkan jawaban", again: "Lagi", hard: "Sulit", good: "Bisa", easy: "Mudah", done: "Selesai!",
    backHome: "Kembali ke beranda", allWords: "Semua kata", notLearned: "baru", noDue: "Tidak ada kata untuk diulang hari ini.", retake: "Ulangi ujian", back: "Kembali",
    listen: "Dengarkan", whichTone: "Nada berapa yang kamu dengar?", hint: "Petunjuk", correct: "Benar!",
    wrong: "Belum tepat", tone1: "Nada 1", tone2: "Nada 2", tone3: "Nada 3", tone4: "Nada 4",
    toneNames: ["", "datar tinggi", "naik", "turun-naik", "turun tajam"],
    hearMode: "Dengar", speakMode: "Ucapkan", speakTip: "Tekan dan tahan tombol mikrofon, ucapkan suku kata ini, lalu lepas. Analisis nada berjalan di perangkatmu (offline).",
    hold: "Tahan untuk bicara", youSaidTone: "Nada yang terdeteksi", noVoice: "Suara tidak terdeteksi, coba lebih keras/dekat.",
    micBlocked: "Mikrofon tidak tersedia. Buka lewat start.bat atau situs https.",
    writeTip: "Tulis goresan sesuai urutan. Goresan yang benar akan terkunci.",
    watch: "Lihat urutan", trace: "Latih", recall: "Uji ingatan", strokes: "goresan", strokeOk: "Goresan benar",
    strokeMiss: "Coba lagi, perhatikan arah & posisi", writeDone: "Karakter selesai",
    talkTip: "Pilih jawaban, dan latih ucapan dengan Tahan & tirukan, semuanya offline.",
    youSaid: "Kamu bilang", speak: "Ucapkan", best: "Terbaik",
    examTip: "10 soal campuran: arti, hanzi, pinyin, nada, dan mendengar.", startExam: "Mulai ujian",
    result: "Hasil", addMissed: "Tambahkan kata yang salah ke review", added: "Ditambahkan ke review",
    settings: "Pengaturan", language: "Bahasa", level: "Level HSK", voice: "Audio", voiceOk: "Rekaman penutur asli (offline)",
    exportData: "Ekspor progres", importData: "Impor progres", reset: "Reset progres", resetConfirm: "Hapus semua progres?",
    offline: "100% offline, progres tersimpan di perangkatmu.", meaningQ: "Apa arti kata ini?", hanziQ: "Pilih hanzi yang tepat",
    pinyinQ: "Hanzi mana yang dibaca", listenQ: "Hanzi mana yang kamu dengar?", toneQ: "Nada berapa karakter ini?",
    ofTen: "dari 10", readiness: "Kesiapan level", sessionNew: "Kata baru", quizTime: "Kuis cepat, pilih artinya",
    xpEarned: "XP didapat", perfect: "Semua benar.", keepGoing: "Terus berlatih.", micNo: "Pengenalan suara tidak didukung di browser ini",
    listening: "Mendengarkan…", notHeard: "Tidak terdengar jelas, coba lagi", minutes: "m", hours: "j", days: "h",
    search: "Cari hanzi, pinyin, atau arti…", more: "Tampilkan lebih banyak", stats: "Statistik & kalibrasi",
    calibration: "Kalibrasi Meteran Memori", calibDesc: "Prediksi ingatan vs. hasil review sebenarnya. Garis diagonal = sempurna.",
    calibEmpty: "Butuh minimal 20 review untuk kalibrasi.", reviews: "review", predicted: "prediksi", actual: "aktual",
    studyData: "Ekspor data studi (CSV)", toneData: "Ekspor latihan nada (CSV)", chooseLevel: "Pilih level kamu", levelWords: "kata",
    welcome: "Selamat datang di Nadaku", welcomeSub: "Belajar Mandarin dengan audio penutur asli, nada, dan urutan goresan, offline.",
    keys: "Pintasan: Spasi = tunjukkan, 1–4 = nilai/pilih, R = putar ulang",
    noAudio: "Rekaman untuk kata ini belum terpasang (jalankan finish_audio.bat).",
    shadowHold: "Tahan & tirukan", shadowMine: "Suaramu", shadowTip: "Dengarkan, lalu tahan tombol rekam dan tirukan kalimatnya (offline).",
    shadowGood: "Bagus, panjang ucapan pas", shadowShort: "Terlalu singkat, ucapkan seluruh kalimat", shadowLong: "Terlalu panjang, coba lebih lancar",
    onlineSpeech: "Pengenalan suara online (Chrome, butuh internet)",
    indoTitle: "Khusus lidah Indonesia", indoDesc: "Kata serapan Hokkien yang sudah kamu kenal + jebakan pinyin",
    loanTitle: "Kata yang sudah kamu tahu", loanDesc: "Kata-kata ini masuk ke bahasa Indonesia dari bahasa Hokkien. Di sebelahnya: kata Mandarin yang dipakai sekarang.",
    trapTitle: "Jebakan pinyin", trapDesc: "Huruf pinyin yang paling sering salah dibaca penutur bahasa Indonesia. Ketuk kata untuk mendengar penutur asli.",
    source: "Sumber", theme: "Tema", themeAuto: "Otomatis", themeLight: "Terang", themeDark: "Gelap",
    personalTitle: "Jadwal pribadimu", personalDesc: "Setelah 50 review, Nadaku menyesuaikan jadwal dengan daya ingatmu sendiri (estimasi kemungkinan maksimum dari riwayat reviewmu).",
    personalNeed: "review lagi sampai jadwal pribadi aktif", personalScale: "Daya ingatmu", personalVs: "× model standar",
    personalFit: "Kecocokan prediksi (log-loss)", badges: "Lencana", newBadge: "Lencana baru!", wordsBadge: "kata",
    toneAccuracy: "Akurasi Tone Mirror pada rekaman penutur asli",
  },
  en: {
    home: "Home", vocab: "Words", tones: "Tones", write: "Write", talk: "Talk", exam: "Exam",
    greeting: "Let's learn today!", dailyGoal: "Daily goal", streak: "day streak",
    memoryTitle: "Memory Meter", memoryNow: "words you remember right now",
    memoryDesc: "Estimated words you actually still remember (FSRS model), not just a word count.",
    in7: "Without review, in 7 days you'd keep", learned: "Learned", due: "Due", strong: "Strong",
    week: "Last 7 days", start: "Start", reviewNow: "Review now", learnNew: "Learn 5 new words",
    reviewDesc: "cards waiting", newDesc: "native audio + examples", toneDesc: "Hear & say the 4 tones",
    talkDesc: "Roleplay, works offline", weakTone: "Your weakest tone", practice: "Practice", next: "Next",
    show: "Show answer", again: "Again", hard: "Hard", good: "Good", easy: "Easy", done: "Done!",
    backHome: "Back to home", allWords: "All words", notLearned: "new", noDue: "Nothing due today.", retake: "Retake exam", back: "Back",
    listen: "Listen", whichTone: "Which tone did you hear?", hint: "Hint", correct: "Correct!",
    wrong: "Not quite", tone1: "Tone 1", tone2: "Tone 2", tone3: "Tone 3", tone4: "Tone 4",
    toneNames: ["", "high flat", "rising", "dip", "falling"],
    hearMode: "Hear", speakMode: "Speak", speakTip: "Press and hold the mic button, say this syllable, then release. Pitch analysis runs on your device (offline).",
    hold: "Hold to speak", youSaidTone: "Detected tone", noVoice: "No voice detected, try louder/closer.",
    micBlocked: "Microphone unavailable. Open via start.bat or an https site.",
    writeTip: "Write the strokes in order. Correct strokes lock in.",
    watch: "Watch order", trace: "Trace", recall: "Recall", strokes: "strokes", strokeOk: "Correct stroke",
    strokeMiss: "Try again, check direction & position", writeDone: "Character complete",
    talkTip: "Pick a reply and practise speaking with Hold & repeat, all offline.",
    youSaid: "You said", speak: "Speak", best: "Best",
    examTip: "10 mixed questions: meaning, hanzi, pinyin, tones and listening.", startExam: "Start exam",
    result: "Result", addMissed: "Add missed words to review", added: "Added to review",
    settings: "Settings", language: "Language", level: "HSK level", voice: "Audio", voiceOk: "Native-speaker recordings (offline)",
    exportData: "Export progress", importData: "Import progress", reset: "Reset progress", resetConfirm: "Delete all progress?",
    offline: "100% offline, progress is stored on your device.", meaningQ: "What does this mean?", hanziQ: "Pick the right hanzi",
    pinyinQ: "Which hanzi is read", listenQ: "Which hanzi did you hear?", toneQ: "What tone is this character?",
    ofTen: "of 10", readiness: "Level readiness", sessionNew: "New word", quizTime: "Quick quiz, pick the meaning",
    xpEarned: "XP earned", perfect: "All correct.", keepGoing: "Keep practising.", micNo: "Speech recognition not supported in this browser",
    listening: "Listening…", notHeard: "Couldn't hear clearly, try again", minutes: "m", hours: "h", days: "d",
    search: "Search hanzi, pinyin or meaning…", more: "Show more", stats: "Stats & calibration",
    calibration: "Memory Meter calibration", calibDesc: "Predicted recall vs. actual review results. Diagonal = perfect.",
    calibEmpty: "Needs at least 20 reviews to calibrate.", reviews: "reviews", predicted: "predicted", actual: "actual",
    studyData: "Export study data (CSV)", toneData: "Export tone practice (CSV)", chooseLevel: "Choose your level", levelWords: "words",
    welcome: "Welcome to Nadaku", welcomeSub: "Learn Mandarin with native audio, tones and stroke order, offline.",
    keys: "Shortcuts: Space = show, 1–4 = rate/choose, R = replay",
    noAudio: "Recording for this word is not installed yet (run finish_audio.bat).",
    shadowHold: "Hold & repeat", shadowMine: "Your voice", shadowTip: "Listen, then hold the record button and repeat the line (offline).",
    shadowGood: "Good, length matches", shadowShort: "Too short, say the whole line", shadowLong: "Too long, try more fluently",
    onlineSpeech: "Online speech recognition (Chrome, needs internet)",
    indoTitle: "Made for Indonesian speakers", indoDesc: "Hokkien loanwords you already know + pinyin traps",
    loanTitle: "Words you already know", loanDesc: "These words came into Indonesian from Hokkien. Next to each: the Mandarin word used today.",
    trapTitle: "Pinyin traps", trapDesc: "Pinyin letters Indonesian speakers most often misread. Tap a word to hear a native speaker.",
    source: "Source", theme: "Theme", themeAuto: "Automatic", themeLight: "Light", themeDark: "Dark",
    personalTitle: "Your personal schedule", personalDesc: "After 50 reviews, Nadaku tunes the schedule to your own memory (maximum-likelihood estimate from your review history).",
    personalNeed: "more reviews until your personal schedule switches on", personalScale: "Your memory", personalVs: "× the standard model",
    personalFit: "Prediction fit (log-loss)", badges: "Badges", newBadge: "New badge!", wordsBadge: "words",
    toneAccuracy: "Tone Mirror accuracy on native-speaker recordings",
  },
};

// ---------- State ----------
function defaultState() {
  return {
    lang: "id",
    goal: 30,
    level: 1,
    onboarded: false,
    xp: 0,
    days: {},
    cards: {},
    log: [],
    tones: { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0] },
    mirror: { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0] },
    talkBest: {},
    examBest: {},
    onlineSpeech: false,
    theme: "auto",
    stabilityScale: 1,
    personal: null,
    badges: [],
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
  } catch (err) {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (err) {
    /* storage unavailable — keep working in memory */
  }
}

function t(key) {
  return STRINGS[state.lang][key] ?? key;
}

function gloss(word) {
  return state.lang === "id" ? word.id : word.en;
}

function glossOther(word) {
  return state.lang === "id" ? word.en : word.id;
}

function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function dateKey(time) {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addXP(amount) {
  state.xp += amount;
  const key = dateKey(Date.now());
  state.days[key] = (state.days[key] || 0) + amount;
  saveState();
  updateTopbar();
}

function streakDays(now = Date.now()) {
  let count = 0;
  let cursor = now;
  if (!state.days[dateKey(cursor)]) {
    cursor -= DAY;
  }
  while (state.days[dateKey(cursor)]) {
    count += 1;
    cursor -= DAY;
  }
  return count;
}

// ---------- Pinyin & tones ----------
const TONE_MARKS = {
  "ā": 1, "á": 2, "ǎ": 3, "à": 4, "ē": 1, "é": 2, "ě": 3, "è": 4,
  "ī": 1, "í": 2, "ǐ": 3, "ì": 4, "ō": 1, "ó": 2, "ǒ": 3, "ò": 4,
  "ū": 1, "ú": 2, "ǔ": 3, "ù": 4, "ǖ": 1, "ǘ": 2, "ǚ": 3, "ǜ": 4,
};
const PLAIN_VOWEL = {
  "ā": "a", "á": "a", "ǎ": "a", "à": "a", "ē": "e", "é": "e", "ě": "e", "è": "e",
  "ī": "i", "í": "i", "ǐ": "i", "ì": "i", "ō": "o", "ó": "o", "ǒ": "o", "ò": "o",
  "ū": "u", "ú": "u", "ǔ": "u", "ù": "u", "ǖ": "ü", "ǘ": "ü", "ǚ": "ü", "ǜ": "ü",
};

function toneOf(syllable) {
  for (const ch of syllable.normalize("NFC").toLowerCase()) {
    if (TONE_MARKS[ch]) {
      return TONE_MARKS[ch];
    }
  }
  return 5;
}

function stripTone(syllable) {
  return [...syllable.normalize("NFC")].map((ch) => PLAIN_VOWEL[ch.toLowerCase()] || ch).join("");
}

function syllablesOf(word) {
  return word.pinyin.split(/\s+/);
}

function zh(text) {
  return `<span lang="zh-CN">${text}</span>`;
}

function coloredHanzi(word) {
  const syllables = syllablesOf(word);
  return `<span lang="zh-CN">${[...word.hanzi]
    .map((ch, idx) => `<span class="t${toneOf(syllables[idx] || "")}">${ch}</span>`)
    .join("")}</span>`;
}

function coloredPinyin(word) {
  return syllablesOf(word)
    .map((syl) => `<span class="t${toneOf(syl)}">${syl}</span>`)
    .join(" ");
}

const TONE_PATHS = {
  1: "M8 10 L92 10",
  2: "M8 34 L92 8",
  3: "M8 16 Q45 46 92 8",
  4: "M8 6 L92 36",
};

function toneSvg(tone) {
  return `<svg viewBox="0 0 100 42" aria-hidden="true"><path d="${TONE_PATHS[tone]}" stroke="var(--t${tone})" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
}

const MONO_TONED = VOCAB.filter((w) => w.hanzi.length === 1 && toneOf(w.pinyin) <= 4);
const HEARABLE_MONO = MONO_TONED.filter((w) => w.audio);

// ---------- FSRS-4.5 scheduler (open-spaced-repetition, default parameters) ----------
const FSRS_W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const FSRS_DECAY = -0.5;
const FSRS_FACTOR = 19 / 81;
const TARGET_RETENTION = 0.9;

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

function fsrsRetrievability(elapsedDays, stability) {
  return Math.pow(1 + (FSRS_FACTOR * elapsedDays) / stability, FSRS_DECAY);
}

function fsrsInitDifficulty(grade) {
  return clamp(FSRS_W[4] - (grade - 3) * FSRS_W[5], 1, 10);
}

function fsrsNextDifficulty(difficulty, grade) {
  const shifted = difficulty - FSRS_W[6] * (grade - 3);
  return clamp(FSRS_W[7] * fsrsInitDifficulty(3) + (1 - FSRS_W[7]) * shifted, 1, 10);
}

function fsrsRecallStability(difficulty, stability, retrievability, grade) {
  const hardPenalty = grade === 2 ? FSRS_W[15] : 1;
  const easyBonus = grade === 4 ? FSRS_W[16] : 1;
  return stability * (1 + Math.exp(FSRS_W[8]) * (11 - difficulty) * Math.pow(stability, -FSRS_W[9])
    * (Math.exp(FSRS_W[10] * (1 - retrievability)) - 1) * hardPenalty * easyBonus);
}

function fsrsForgetStability(difficulty, stability, retrievability) {
  return FSRS_W[11] * Math.pow(difficulty, -FSRS_W[12]) * (Math.pow(stability + 1, FSRS_W[13]) - 1)
    * Math.exp(FSRS_W[14] * (1 - retrievability));
}

// Days until recall probability falls to the target retention.
function fsrsInterval(stability) {
  return (stability / FSRS_FACTOR) * (Math.pow(TARGET_RETENTION, 1 / FSRS_DECAY) - 1);
}

// grade: 1 again, 2 hard, 3 good, 4 easy. Pure: returns a new card.
function schedule(card, grade, now) {
  let next;
  if (!card || !card.reps) {
    next = { s: FSRS_W[grade - 1], d: fsrsInitDifficulty(grade), reps: 1, lapses: grade === 1 ? 1 : 0 };
  } else {
    const elapsed = Math.max(0, now - card.last) / DAY;
    const r = fsrsRetrievability(elapsed, card.s);
    const s = grade === 1 ? Math.min(card.s, fsrsForgetStability(card.d, card.s, r)) : fsrsRecallStability(card.d, card.s, r, grade);
    next = { s, d: fsrsNextDifficulty(card.d, grade), reps: card.reps + 1, lapses: card.lapses + (grade === 1 ? 1 : 0) };
  }
  next.last = now;
  next.due = grade === 1 ? now + 10 * MINUTE : now + Math.max(1, Math.round(fsrsInterval(next.s * personalScale()))) * DAY;
  return next;
}

// Personal memory scale: multiplies FSRS stability for this learner (1 = standard model), fitted from review history.
function personalScale() {
  return clamp(Number(state.stabilityScale) || 1, 0.25, 4);
}

function baseRetention(card, now) {
  if (!card || card.last === undefined || card.last === null) {
    return 0;
  }
  return fsrsRetrievability(Math.max(0, now - card.last) / DAY, card.s);
}

function retention(card, now) {
  if (!card || card.last === undefined || card.last === null) {
    return 0;
  }
  return fsrsRetrievability(Math.max(0, now - card.last) / DAY, card.s * personalScale());
}

// Maximum-likelihood fit of the personal stability scale k from logged standard-model predictions.
// With R = (1 + F*t/S)^-0.5, x = F*t/S = R^-2 - 1, and the personal prediction is (1 + x/k)^-0.5.
// Shrunk toward k = 1 with a prior worth PRIOR_REVIEWS reviews, so small logs cannot swing the schedule.
const PERSONAL_MIN_REVIEWS = 50;
const PRIOR_REVIEWS = 100;

function fitStabilityScale(log) {
  const points = [];
  for (const entry of log) {
    const base = entry[4] ?? entry[3];
    if (base > 0.001 && base < 0.999) {
      points.push([Math.pow(base, -2) - 1, entry[2] > 1 ? 1 : 0]);
    }
  }
  const n = points.length;
  const meanLogLoss = (k) => points.reduce((sum, [x, recalled]) => {
    const p = clamp(Math.pow(1 + x / k, FSRS_DECAY), 1e-6, 1 - 1e-6);
    return sum - (recalled ? Math.log(p) : Math.log(1 - p));
  }, 0) / Math.max(1, n);
  if (n < PERSONAL_MIN_REVIEWS) {
    return { n, k: 1, raw: 1, before: null, after: null };
  }
  let raw = 1;
  let bestLoss = Infinity;
  const steps = 240;
  for (let i = 0; i <= steps; i += 1) {
    const k = Math.exp(Math.log(0.25) + (i * (Math.log(4) - Math.log(0.25))) / steps);
    const loss = meanLogLoss(k);
    if (loss < bestLoss) {
      bestLoss = loss;
      raw = k;
    }
  }
  const k = Math.exp((n / (n + PRIOR_REVIEWS)) * Math.log(raw));
  return { n, k, raw, before: meanLogLoss(1), after: meanLogLoss(k) };
}

function updatePersonalization() {
  const fit = fitStabilityScale(state.log);
  state.personal = { n: fit.n, k: fit.k, before: fit.before, after: fit.after };
  state.stabilityScale = fit.k;
  saveState();
  return fit;
}

function memoryScore(now) {
  return Object.values(state.cards).reduce((sum, card) => sum + retention(card, now), 0);
}

function dueWords(now) {
  return Object.entries(state.cards)
    .filter(([, card]) => card.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([hanzi]) => BY_HANZI.get(hanzi))
    .filter(Boolean);
}

function formatInterval(card, now) {
  const ms = card.due - now;
  if (ms < 60 * MINUTE) {
    return `${Math.round(ms / MINUTE)}${t("minutes")}`;
  }
  if (ms < DAY) {
    return `${Math.round(ms / (60 * MINUTE))}${t("hours")}`;
  }
  return `${Math.round(ms / DAY)}${t("days")}`;
}

// Records predicted recall before each review, so calibration can be measured on real data.
function logReview(hanzi, card, grade, now) {
  const predicted = retention(card, now);
  const base = baseRetention(card, now);
  state.log.push([now, hanzi, grade, Math.round(predicted * 1000) / 1000, Math.round(base * 1000) / 1000]);
  if (state.log.length > 20000) {
    state.log.splice(0, state.log.length - 20000);
  }
}

// Reliability diagram data: bins of predicted recall vs observed recall.
function calibration(log) {
  const edges = [0, 0.5, 0.7, 0.8, 0.9, 0.95, 1.0001];
  const bins = edges.slice(0, -1).map((low, i) => ({ low, high: edges[i + 1], n: 0, predicted: 0, recalled: 0 }));
  let brier = 0;
  let count = 0;
  for (const [, , grade, predicted] of log) {
    if (predicted <= 0) {
      continue;
    }
    const outcome = grade > 1 ? 1 : 0;
    const bin = bins.find((b) => predicted >= b.low && predicted < b.high);
    bin.n += 1;
    bin.predicted += predicted;
    bin.recalled += outcome;
    brier += (predicted - outcome) ** 2;
    count += 1;
  }
  let weightedGap = 0;
  for (const bin of bins) {
    if (bin.n) {
      bin.predicted /= bin.n;
      bin.actual = bin.recalled / bin.n;
      weightedGap += bin.n * Math.abs(bin.predicted - bin.actual);
    }
  }
  return { bins, count, brier: count ? brier / count : null, ece: count ? weightedGap / count : null };
}

// ---------- Delight: celebrations, badges, theme ----------
const STREAK_BADGES = [3, 7, 14, 30, 100];
const WORD_BADGES = [10, 50, 100, 500, 1000, 2500, 5363];

function earnedBadges() {
  const streak = streakDays();
  const words = Object.keys(state.cards).length;
  return [
    ...STREAK_BADGES.filter((n) => streak >= n).map((n) => `streak-${n}`),
    ...WORD_BADGES.filter((n) => words >= n).map((n) => `words-${n}`),
  ];
}

function badgeLabel(id) {
  const [kind, n] = id.split("-");
  return kind === "streak" ? `${n} ${t("streak")}` : `${n} ${t("wordsBadge")}`;
}

function newBadges() {
  const known = new Set(state.badges || []);
  const fresh = earnedBadges().filter((id) => !known.has(id));
  state.badges = [...known, ...fresh];
  saveState();
  return fresh;
}

function reducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function celebrate() {
  const fresh = newBadges();
  if (fresh.length) {
    toast(`${t("newBadge")} ${fresh.map(badgeLabel).join(" · ")}`);
  }
  if (reducedMotion() || !document.body) {
    return fresh;
  }
  const layer = document.createElement("div");
  layer.className = "confetti";
  layer.setAttribute("aria-hidden", "true");
  const colors = ["var(--t1)", "var(--t2)", "var(--t3)", "var(--t4)", "var(--gold)"];
  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 2200);
  return fresh;
}

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === "dark" || state.theme === "light") {
    root.dataset.theme = state.theme;
  } else {
    delete root.dataset.theme;
  }
}

// ---------- Utilities ----------
function shuffle(list, rng = Math.random) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function sample(list, count, rng = Math.random, exclude = []) {
  return shuffle(list.filter((x) => !exclude.includes(x)), rng).slice(0, count);
}

function seededRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizeZh(text) {
  return (text || "").replace(/[\s，。！？、,.!?；;：:""''「」]/g, "");
}

function similarity(a, b) {
  const x = [...normalizeZh(a)];
  const y = [...normalizeZh(b)];
  if (!x.length || !y.length) {
    return 0;
  }
  const dp = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = 1; i <= x.length; i += 1) {
    for (let j = 1; j <= y.length; j += 1) {
      dp[i][j] = x[i - 1] === y[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return (2 * dp[x.length][y.length]) / (x.length + y.length);
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2400);
}

function announce(message) {
  const live = document.getElementById("live");
  live.textContent = "";
  setTimeout(() => {
    live.textContent = message;
  }, 30);
}

function wordsAtLevel(level) {
  return VOCAB.filter((w) => w.level === level);
}

// ---------- Audio: native recordings first, syllable recordings next, system TTS last ----------
let currentAudio = [];

function stopAudio() {
  for (const a of currentAudio) {
    a.pause();
  }
  currentAudio = [];
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}

// Turns an audio plan into a list of {src, light} clips. Plan parts are paths under audio/ ("s/ma1", "w/爱"), "~" = neutral tone.
function audioClips(plan, hanzi) {
  if (plan === 1) {
    return [{ src: `audio/w/${encodeURIComponent(hanzi)}.mp3`, light: false }];
  }
  if (!plan) {
    return [];
  }
  return plan.split("|").map((part) => {
    const light = part.endsWith("~");
    const [folder, name] = part.replace("~", "").split("/");
    return { src: `audio/${folder}/${encodeURIComponent(name)}.mp3`, light };
  });
}

function playClips(clips, onFail) {
  stopAudio();
  if (!clips.length) {
    onFail();
    return;
  }
  let index = 0;
  const playNext = () => {
    if (index >= clips.length) {
      return;
    }
    const clip = clips[index];
    index += 1;
    const audio = new Audio(clip.src);
    audio.volume = clip.light ? 0.55 : 1;
    if (clip.light) {
      audio.playbackRate = 1.25;
    }
    audio.onended = playNext;
    audio.onerror = () => {
      stopAudio();
      onFail();
    };
    currentAudio.push(audio);
    const promise = audio.play();
    if (promise && promise.catch) {
      promise.catch(() => {});
    }
  };
  playNext();
}

function speakTts(text, rate = 0.85) {
  if (!("speechSynthesis" in window)) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find((v) => /zh[-_]CN/i.test(v.lang)) || voices.find((v) => /^zh/i.test(v.lang));
  if (voice) {
    utterance.voice = voice;
  }
  speechSynthesis.speak(utterance);
}

function hasChineseVoice() {
  return "speechSynthesis" in window && speechSynthesis.getVoices().some((v) => /^zh/i.test(v.lang));
}

function playWord(word) {
  playClips(audioClips(word.audio, word.hanzi), () => {
    if (hasChineseVoice()) {
      speakTts(word.hanzi);
    } else {
      toast(t("noAudio"));
    }
  });
}

function playSyllable(base, tone, fallbackText) {
  const source = typeof SYLLABLE_SOURCES !== "undefined" ? SYLLABLE_SOURCES[`${base}${tone}`] : null;
  playClips(source ? audioClips(source, "") : [], () => speakTts(fallbackText || base));
}

// Sentences: system TTS sounds most natural when a Chinese voice exists; otherwise native syllable recordings.
function playSentence(text) {
  const plan = (typeof SENTENCE_AUDIO !== "undefined" ? SENTENCE_AUDIO[text] : null) || composedSentencePlan(text);
  const voices = "speechSynthesis" in window ? speechSynthesis.getVoices() : [];
  if (voices.some((v) => /^zh/i.test(v.lang))) {
    stopAudio();
    speakTts(text);
  } else {
    playClips(audioClips(plan, text), () => speakTts(text));
  }
}

function playAny(text) {
  const word = BY_HANZI.get(text);
  if (word) {
    playWord(word);
  } else {
    playSentence(text);
  }
}

// ---------- Pitch tracking & tone classification (offline, on-device) ----------
// Autocorrelation pitch detector on one frame (YIN-style normalised difference). Returns Hz or 0 if unvoiced.
function detectPitch(frame, sampleRate, minHz = 70, maxHz = 450) {
  const n = frame.length;
  let energy = 0;
  for (let i = 0; i < n; i += 1) {
    energy += frame[i] * frame[i];
  }
  if (Math.sqrt(energy / n) < 0.01) {
    return 0;
  }
  const minLag = Math.floor(sampleRate / maxHz);
  const maxLag = Math.min(Math.floor(sampleRate / minHz), Math.floor(n / 2));
  const diff = new Float32Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let sum = 0;
    for (let i = 0; i < n - maxLag; i += 1) {
      const d = frame[i] - frame[i + lag];
      sum += d * d;
    }
    diff[lag] = sum;
  }
  // cumulative mean normalised difference
  let running = 0;
  const cmnd = new Float32Array(maxLag + 1).fill(1);
  for (let lag = 1; lag <= maxLag; lag += 1) {
    running += lag >= minLag ? diff[lag] : 0;
    if (lag >= minLag && running > 0) {
      cmnd[lag] = (diff[lag] * (lag - minLag + 1)) / running;
    }
  }
  let best = -1;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    if (cmnd[lag] < 0.15) {
      while (lag + 1 <= maxLag && cmnd[lag + 1] < cmnd[lag]) {
        lag += 1;
      }
      best = lag;
      break;
    }
  }
  if (best < 0) {
    return 0;
  }
  // parabolic interpolation for sub-sample accuracy
  const a = cmnd[best - 1] ?? cmnd[best];
  const b = cmnd[best];
  const c = cmnd[best + 1] ?? cmnd[best];
  const shift = (a - c) / (2 * (a - 2 * b + c) || 1);
  return sampleRate / (best + (Number.isFinite(shift) ? shift : 0));
}

function pitchTrack(samples, sampleRate, frameSize = 1024, hop = 256) {
  const track = [];
  for (let start = 0; start + frameSize <= samples.length; start += hop) {
    track.push(detectPitch(samples.subarray(start, start + frameSize), sampleRate));
  }
  return track;
}

// Native-speaker tone templates: mean pitch contour (semitones, mean removed, 8 points after trimming 10% at each end)
// of 1,488 single-syllable recordings (audio-cmn / Shtooka). 2-fold cross-validated accuracy on those recordings: 91.1%
// (previous rule-based classifier: 85.3%). Reproduce with refine/eval_tone_mirror.py.
const TONE_TEMPLATE_POINTS = 8;
const TONE_TEMPLATE_TRIM = 0.1;
const TONE_TEMPLATES = {
  1: [-0.47, -0.13, 0.06, 0.08, 0.03, -0.02, 0.07, 0.38],
  2: [-1.72, -1.61, -1.37, -1.01, -0.35, 0.67, 2.05, 3.33],
  3: [1.63, 0.38, -0.88, -1.61, -1.66, -1.02, 0.60, 2.55],
  4: [1.83, 1.96, 1.75, 1.14, 0.12, -1.11, -2.35, -3.35],
};
const TONE_MIRROR_ACCURACY = 0.911;

// Classifies a pitch contour (Hz, 0 = unvoiced) into Mandarin tone 1-4 by nearest native-speaker template.
function classifyTone(track) {
  const voiced = track.filter((f) => f > 0);
  if (voiced.length < 6) {
    return { tone: 0, contour: [] };
  }
  const median = [...voiced].sort((a, b) => a - b)[Math.floor(voiced.length / 2)];
  const semis = voiced.map((f) => 12 * Math.log2(f / median));
  // smooth with a 5-point moving median to remove octave jumps
  const smooth = semis.map((_, i) => {
    const win = semis.slice(Math.max(0, i - 2), i + 3).sort((a, b) => a - b);
    return win[Math.floor(win.length / 2)];
  });
  const cut = Math.floor(smooth.length * TONE_TEMPLATE_TRIM);
  const core = smooth.length - 2 * cut >= 6 ? smooth.slice(cut, smooth.length - cut) : smooth;
  const vector = [];
  for (let i = 0; i < TONE_TEMPLATE_POINTS; i += 1) {
    const x = (i * (core.length - 1)) / (TONE_TEMPLATE_POINTS - 1);
    const low = Math.floor(x);
    const high = Math.min(core.length - 1, low + 1);
    vector.push(core[low] + (core[high] - core[low]) * (x - low));
  }
  const mean = vector.reduce((s, v) => s + v, 0) / vector.length;
  const centred = vector.map((v) => v - mean);
  let tone = 1;
  let bestDistance = Infinity;
  for (const [candidate, template] of Object.entries(TONE_TEMPLATES)) {
    const distance = template.reduce((s, v, i) => s + (centred[i] - v) ** 2, 0);
    if (distance < bestDistance) {
      bestDistance = distance;
      tone = Number(candidate);
    }
  }
  return { tone, contour: smooth };
}


// ---------- Shadowing helpers (offline) ----------
function encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view16 = new DataView(buffer);
  const writeText = (offset, text) => [...text].forEach((c, i) => view16.setUint8(offset + i, c.charCodeAt(0)));
  writeText(0, "RIFF");
  view16.setUint32(4, 36 + samples.length * 2, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view16.setUint32(16, 16, true);
  view16.setUint16(20, 1, true);
  view16.setUint16(22, 1, true);
  view16.setUint32(24, sampleRate, true);
  view16.setUint32(28, sampleRate * 2, true);
  view16.setUint16(32, 2, true);
  view16.setUint16(34, 16, true);
  writeText(36, "data");
  view16.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i += 1) {
    view16.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

// Seconds of voiced speech in a recording (pitch frames with a detected F0).
function voicedSeconds(samples, sampleRate, hop = 256) {
  const track = pitchTrack(samples, sampleRate, 1024, hop);
  return (track.filter((f) => f > 0).length * hop) / sampleRate;
}

function syllableCount(text) {
  return (text.match(/[\u4e00-\u9fff]/g) || []).length;
}

// ---------- Stroke data & stroke-order matching (Make Me a Hanzi data) ----------
const STROKES = new Map();
const strokeWaiters = new Map();

function registerStrokes(ch, data) {
  STROKES.set(ch, data);
  const waiters = strokeWaiters.get(ch) || [];
  waiters.forEach((resolve) => resolve(data));
  strokeWaiters.delete(ch);
}

function loadStrokes(ch) {
  if (STROKES.has(ch)) {
    return Promise.resolve(STROKES.get(ch));
  }
  return new Promise((resolve) => {
    const list = strokeWaiters.get(ch) || [];
    list.push(resolve);
    strokeWaiters.set(ch, list);
    if (list.length === 1) {
      const script = document.createElement("script");
      script.src = `strokes/${ch.codePointAt(0).toString(16)}.js`;
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    }
  });
}

function resample(points, count) {
  if (points.length < 2) {
    return Array.from({ length: count }, () => points[0] || [0, 0]);
  }
  const dists = [0];
  for (let i = 1; i < points.length; i += 1) {
    dists.push(dists[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  const total = dists[dists.length - 1] || 1;
  const out = [];
  let j = 1;
  for (let k = 0; k < count; k += 1) {
    const target = (total * k) / (count - 1);
    while (j < points.length - 1 && dists[j] < target) {
      j += 1;
    }
    const span = dists[j] - dists[j - 1] || 1;
    const f = clamp((target - dists[j - 1]) / span, 0, 1);
    out.push([points[j - 1][0] + f * (points[j][0] - points[j - 1][0]), points[j - 1][1] + f * (points[j][1] - points[j - 1][1])]);
  }
  return out;
}

function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return total;
}

// Does a drawn stroke (in 1024-unit glyph coordinates) match the expected stroke median?
function strokeMatches(drawn, median) {
  if (drawn.length < 2) {
    return false;
  }
  const a = resample(drawn, 24);
  const b = resample(median, 24);
  let avg = 0;
  for (const p of a) {
    let best = Infinity;
    for (const q of b) {
      best = Math.min(best, Math.hypot(p[0] - q[0], p[1] - q[1]));
    }
    avg += best;
  }
  avg /= a.length;
  const startGap = Math.hypot(a[0][0] - b[0][0], a[0][1] - b[0][1]);
  const endGap = Math.hypot(a[23][0] - b[23][0], a[23][1] - b[23][1]);
  const lengthRatio = (pathLength(a) + 1) / (pathLength(b) + 1);
  const medianLen = pathLength(b);
  const directionOk = medianLen < 120 || startGap + endGap < Math.hypot(a[0][0] - b[23][0], a[0][1] - b[23][1]) + Math.hypot(a[23][0] - b[0][0], a[23][1] - b[0][1]);
  return avg < 160 && startGap < 260 && endGap < 260 && lengthRatio > 0.35 && lengthRatio < 2.8 && directionOk;
}

// ---------- Quiz generation ----------
function generateQuiz(count, rng = Math.random, level = state.level, withListening = true) {
  const types = ["meaning", "hanzi", "pinyin", "tone"];
  if (withListening) {
    types.push("listen");
  }
  const pool = wordsAtLevel(level);
  const tonePool = MONO_TONED.filter((w) => w.level <= Math.max(level, 2));
  const questions = [];
  const used = new Set();
  let guard = 0;
  while (questions.length < count && guard < 5000) {
    guard += 1;
    const type = types[questions.length % types.length];
    const source = type === "tone" ? tonePool : pool;
    const word = source[Math.floor(rng() * source.length)];
    if (!word || used.has(word.hanzi)) {
      continue;
    }
    used.add(word.hanzi);
    if (type === "tone") {
      questions.push({ type, word, options: [1, 2, 3, 4], answer: toneOf(word.pinyin) });
      continue;
    }
    const distractors = [];
    let tries = 0;
    while (distractors.length < 3 && tries < 200) {
      tries += 1;
      const extra = pool[Math.floor(rng() * pool.length)];
      const clash = extra === word || distractors.includes(extra) || extra.id === word.id || extra.en === word.en
        || extra.hanzi === word.hanzi || extra.pinyin === word.pinyin;
      if (!clash) {
        distractors.push(extra);
      }
    }
    questions.push({ type, word, options: shuffle([word, ...distractors], rng), answer: word });
  }
  return shuffle(questions, rng);
}

// ---------- Router & shell ----------
const TABS = [
  ["home", "home"],
  ["vocab", "book"],
  ["tones", "tone"],
  ["write", "pen"],
  ["talk", "chat"],
  ["exam", "exam"],
];

const view = document.getElementById("view");
let keyHandler = null;

// ---------- Icons: one 24px line set (1.75 stroke), drawn for this app; no emoji anywhere in the UI ----------
const ICON_PATHS = {
  play: "M8 5.5v13l10-6.5z",
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  book: "M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3M9 7h6",
  tone: "M3 15c2.2-7 4.3-7 6 0s3.8 7 6 0 3.8-7 6 0",
  pen: "M4 20l4.2-1L19 8.2a2 2 0 0 0-2.8-2.8L5.4 16.2zM14.5 7l2.5 2.5",
  chat: "M4 5h16v11H10l-6 4z",
  exam: "M9 3h6v3H9zM7 4.5H5V21h14V4.5h-2M9 13l2 2 4-4",
  flame: "M12 3c.8 3.5 5 5.2 5 10a5 5 0 0 1-10 0c0-2.4 1.2-3.7 2.3-5 .3 1.6 1.1 2.6 2.2 3C12.9 8.6 11.6 5.8 12 3z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  settings: "M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4",
  sound: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11",
  mic: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3",
  review: "M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3.5V8h4.5M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20.5V16h-4.5",
  plus: "M12 5v14M5 12h14",
  chart: "M4 20V11M10 20V5M16 20v-7M3 20h18",
  offline: "M12 3v11M7.5 9.5 12 14l4.5-4.5M5 20h14",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l3.5-4.5",
  listen: "M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H4zM17 15h3v5h-3z",
  hint: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.4.8 2.4h6c0-1 .3-1.8.9-2.4A6 6 0 0 0 12 3z",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14",
  upload: "M12 20V8M7 12.5 12 8l5 4.5M5 4h14",
  download: "M12 4v11M7 10.5 12 15l5-4.5M5 20h14",
  restart: "M4 12a8 8 0 1 0 2.4-5.7L4 8.5M4 3.5v5h5",
  close: "M6 6l12 12M18 6 6 18",
  check: "M5 12.5l4.5 4.5L19 7",
  alert: "M12 3.5 21.5 20h-19zM12 10v4.5M12 17.2v.3",
  medal: "M8 3l4 6 4-6M12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  back: "M15 5l-7 7 7 7",
  arrow: "M5 12h14M13 6l6 6-6 6",
  wave: "M7 11V5.5a1.5 1.5 0 0 1 3 0V10M10 9.5V4.5a1.5 1.5 0 0 1 3 0V10M13 9.5V5.5a1.5 1.5 0 0 1 3 0V12M16 10a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-12.6 4.2L4 14.6a1.5 1.5 0 0 1 2.4-1.8L7 13.5",
  bowl: "M3 11h18a9 9 0 0 1-18 0zM8 7c0-1.5 1-1.5 1-3M12 7c0-1.5 1-1.5 1-3M16 7c0-1.5 1-1.5 1-3",
  bag: "M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2",
  car: "M5 16V11l2-5h10l2 5v5M3 16h18v3h-3v-1H6v1H3zM5 11h14M7.5 13.5h1M15.5 13.5h1",
};

function icon(name, size = 20) {
  const d = ICON_PATHS[name];
  if (!d) {
    return "";
  }
  return `<svg class="i i-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}

function renderTabbar(active) {
  document.getElementById("tabbar").innerHTML = TABS.map(
    ([key, iconName]) => `<a href="#${key}" class="${key === active ? "active" : ""}" ${key === active ? 'aria-current="page"' : ""}><span class="ic">${icon(iconName, 22)}</span><span class="tab-label">${t(key)}</span></a>`
  ).join("");
}

function updateTopbar() {
  document.getElementById("top-streak").innerHTML = `${icon("flame", 16)}<span>${streakDays()}</span>`;
  document.getElementById("top-streak").setAttribute("aria-label", `${streakDays()} ${t("streak")}`);
  document.getElementById("top-xp").innerHTML = `${icon("star", 16)}<span>${state.xp} XP</span>`;
  document.getElementById("top-xp").setAttribute("aria-label", `${state.xp} XP`);
  document.documentElement.lang = state.lang;
}

function route() {
  const [name, arg] = (location.hash.slice(1) || "home").split("/");
  const screens = {
    home: renderHome,
    vocab: renderVocab,
    learn: renderLearnSession,
    review: renderReviewSession,
    tones: renderTones,
    write: renderWrite,
    talk: renderTalk,
    exam: renderExam,
    me: renderSettings,
    stats: renderStats,
    indo: renderIndo,
  };
  let screen = screens[name] || renderHome;
  if (!state.onboarded && name !== "me") {
    screen = renderOnboarding;
  }
  const tab = { learn: "vocab", review: "vocab", me: "home", stats: "home", indo: "home" }[name] || name;
  renderTabbar(screens[name] ? tab : "home");
  updateTopbar();
  stopAudio();
  keyHandler = null;
  document.body.classList.remove("exam-focus");
  view.innerHTML = "";
  window.scrollTo(0, 0);
  screen(arg);
  const heading = view.querySelector("h1");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
  }
}

document.addEventListener("keydown", (event) => {
  if (keyHandler && !event.target.matches("input, textarea, select")) {
    keyHandler(event);
  }
});

function bind(selector, handler) {
  view.querySelectorAll(selector).forEach((el) => el.addEventListener("click", (e) => handler(el, e)));
}

function bindSay() {
  bind("[data-say]", (el) => playAny(el.dataset.say));
}

// ---------- Onboarding (level choice) ----------
function renderOnboarding() {
  view.innerHTML = `
    <div class="card hero" style="flex-direction:column;align-items:flex-start">
      <div class="big" style="font-size:26px">${t("welcome")}</div>
      <div class="label">${t("welcomeSub")}</div>
    </div>
    ${mascotSay("cheer", mascotLine("welcome"))}
    <div class="row" role="group" aria-label="${t("language")}">
      <button class="btn ${state.lang === "id" ? "" : "ghost"} small" data-lang="id">Bahasa Indonesia</button>
      <button class="btn ${state.lang === "en" ? "" : "ghost"} small" data-lang="en">English</button>
    </div>
    <h1>${t("chooseLevel")}</h1>
    <div class="grid3">
      ${LEVELS.map((lv) => `<button class="card tile level-tile" data-level="${lv}"><b>HSK ${lv}</b><span>${wordsAtLevel(lv).length} ${t("levelWords")}</span></button>`).join("")}
    </div>`;
  bind("[data-lang]", (el) => {
    state.lang = el.dataset.lang;
    saveState();
    route();
  });
  bind("[data-level]", (el) => {
    state.level = Number(el.dataset.level);
    state.onboarded = true;
    saveState();
    location.hash = "home";
    route();
  });
}


// ---------- Nada, the mascot: a speech bubble whose mouth is a tone curve ----------
const MASCOT_MOUTHS = {
  happy: '<path d="M22 38 Q32 48 42 38" fill="none" stroke="#3a1a10" stroke-width="3.2" stroke-linecap="round"/>',
  cheer: '<path d="M21 36 Q32 52 43 36 Z" fill="#3a1a10"/><path d="M26 41 Q32 46 38 41" fill="none" stroke="#ff9d8a" stroke-width="3" stroke-linecap="round"/>',
  think: '<path d="M23 41 L41 41" fill="none" stroke="#3a1a10" stroke-width="3.2" stroke-linecap="round"/><circle cx="50" cy="12" r="2.4" fill="#fff"/><circle cx="56" cy="6" r="1.6" fill="#fff"/>',
  encourage: '<path d="M22 43 Q30 43 42 35" fill="none" stroke="#3a1a10" stroke-width="3.2" stroke-linecap="round"/>',
};
const MASCOT_LINES = {
  id: {
    done: ["Mantap! Otakmu baru saja menabung kata.", "Hebat, besok tinggal ulang sebentar.", "Satu sesi lagi beres. Jiayou! 加油!", "Keren! Nada bangga sama kamu."],
    perfect: ["Sempurna! 太棒了!", "Semua benar, luar biasa!"],
    tryAgain: ["Tidak apa-apa, salah itu bagian dari belajar.", "Hampir! Kata yang salah akan muncul lagi lebih cepat."],
    noDue: ["Semua kartu aman. Mau tambah kata baru?"],
    welcome: ["Halo! Aku Nada. Yuk mulai dari kata yang sudah kamu kenal: bakmi, bakpao…"],
  },
  en: {
    done: ["Nice! Your brain just banked some words.", "Great, tomorrow is a quick top-up.", "Another session done. Jiayou! 加油!", "Awesome! Nada is proud of you."],
    perfect: ["Perfect! 太棒了!", "All correct, amazing!"],
    tryAgain: ["That's fine, mistakes are how you learn.", "Close! Missed words come back sooner."],
    noDue: ["All cards are safe. Want some new words?"],
    welcome: ["Hi! I'm Nada. Let's start from words you already know: bakmi, bakpao…"],
  },
};

function mascotLine(kind) {
  const lines = (MASCOT_LINES[state.lang] || MASCOT_LINES.id)[kind] || [];
  return lines.length ? lines[Math.floor(Math.random() * lines.length)] : "";
}

function mascotSvg(mood = "happy", size = 72) {
  // Nada, drawn as the app's seal: a vermilion chop stamp with the character 调 (tone). No cartoon face.
  return `<svg class="mascot mascot-${mood}" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
    <rect x="4" y="4" width="56" height="56" rx="6" fill="var(--seal, #a8321f)"/>
    <rect x="9" y="9" width="46" height="46" rx="3" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>
    <text x="32" y="44" text-anchor="middle" font-size="32" fill="#fff" font-family="Kaiti SC, STKaiti, KaiTi, serif">调</text>
  </svg>`;
}

function mascotSay(mood, text, size = 64) {
  return `<div class="mascot-say">${mascotSvg(mood, size)}<div class="say-bubble">${esc(text)}</div></div>`;
}

// ---------- Home ----------
function renderHome() {
  const now = Date.now();
  const todayXp = state.days[dateKey(now)] || 0;
  const goalPct = Math.min(1, todayXp / state.goal);
  const learnedCount = Object.keys(state.cards).length;
  const due = dueWords(now).length;
  const memory = memoryScore(now);
  const memory7 = memoryScore(now + 7 * DAY);
  const strong = Object.values(state.cards).filter((c) => retention(c, now) >= 0.9).length;
  const circumference = 2 * Math.PI * 34;
  const levelWords = wordsAtLevel(state.level);
  const levelLearned = levelWords.filter((w) => state.cards[w.hanzi]).length;

  const forecast = [];
  for (let d = 0; d <= 14; d += 1) {
    forecast.push(memoryScore(now + d * DAY));
  }
  const maxY = Math.max(1, learnedCount);
  const points = forecast.map((v, d) => `${(d / 14) * 300},${90 - (v / maxY) * 80}`).join(" ");

  const week = [];
  for (let d = 6; d >= 0; d -= 1) {
    const key = dateKey(now - d * DAY);
    week.push({ label: new Date(now - d * DAY).toLocaleDateString(state.lang === "id" ? "id-ID" : "en-US", { weekday: "short" }), xp: state.days[key] || 0 });
  }
  const weekMax = Math.max(state.goal, ...week.map((w) => w.xp));
  const weakest = weakestTone();

  view.innerHTML = `
    <div class="row page-head"><h1>${t("greeting")}</h1><span class="spacer"></span>
      <a href="#me" class="icon-btn" aria-label="${t("settings")}">${icon("settings")}</a></div>
    <div class="card hero">
      <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label="${t("dailyGoal")} ${Math.round(goalPct * 100)}%">
        <circle class="ring-track" cx="42" cy="42" r="34" stroke-width="8" fill="none"/>
        <circle class="ring-fill" cx="42" cy="42" r="34" stroke-width="8" fill="none" stroke-linecap="round"
          stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * (1 - goalPct)}" transform="rotate(-90 42 42)"/>
        <text class="ring-text" x="42" y="48" text-anchor="middle" font-size="17" font-weight="600">${Math.round(goalPct * 100)}%</text>
      </svg>
      <div>
        <div class="label">${t("dailyGoal")}</div>
        <div class="big">${todayXp}/${state.goal} XP</div>
        <div class="label">${streakDays()} ${t("streak")}</div>
      </div>
    </div>

    <div class="grid2">
      <a class="card tile primary" href="#review"><span class="ic">${icon("review", 22)}</span><b>${t("reviewNow")}</b><span>${due} ${t("reviewDesc")}</span></a>
      <a class="card tile" href="#learn"><span class="ic">${icon("plus", 22)}</span><b>${t("learnNew")}</b><span>${t("newDesc")}</span></a>
      <a class="card tile" href="#tones"><span class="ic">${icon("tone", 22)}</span><b>${t("tones")}</b><span>${weakest ? `${t("weakTone")}: ${weakest}` : t("toneDesc")}</span></a>
      <a class="card tile" href="#talk"><span class="ic">${icon("chat", 22)}</span><b>${t("talk")}</b><span>${t("talkDesc")}</span></a>
    </div>

    <a class="card row level-card" href="#me" style="text-decoration:none;color:inherit">
      <span class="pill blue">HSK ${state.level}</span>
      <div style="flex:1"><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${levelWords.length}" aria-valuenow="${levelLearned}" aria-label="HSK ${state.level}"><i style="width:${(levelLearned / levelWords.length) * 100}%;background:var(--t4)"></i></div></div>
      <span class="muted small-text">${levelLearned}/${levelWords.length}</span>
    </a>

    <div class="card">
      <div class="row"><b>${t("memoryTitle")}</b><span class="spacer"></span><span class="pill green">${t("strong")}: ${strong}</span></div>
      <div class="row" style="align-items:baseline;margin-top:6px"><span style="font-size:38px;font-weight:800">${memory.toFixed(0)}</span><span class="muted">&nbsp;/ ${learnedCount} ${t("memoryNow")}</span></div>
      <svg viewBox="0 0 300 95" width="100%" height="95" style="margin-top:4px" role="img" aria-label="${t("in7")} ${memory7.toFixed(0)}">
        <line x1="0" y1="10" x2="300" y2="10" stroke="var(--line)" stroke-dasharray="4 4"/>
        <polyline points="0,90 ${points} 300,90" fill="rgba(232,69,60,.10)" stroke="none"/>
        <polyline points="${points}" fill="none" stroke="var(--red)" stroke-width="3"/>
        <text x="0" y="8" font-size="9" fill="var(--muted)">${learnedCount}</text>
        <text x="300" y="94" font-size="9" fill="var(--muted)" text-anchor="end">+14${t("days")}</text>
      </svg>
      <p class="sub" style="margin:4px 0 0">${t("in7")} <b>${memory7.toFixed(0)}</b>. ${t("memoryDesc")} <a href="#stats">${t("stats")} →</a></p>
    </div>

    <div class="grid3">
      <div class="card stat"><b>${learnedCount}</b><span>${t("learned")}</span></div>
      <div class="card stat"><b class="${due ? "bad" : "ok"}">${due}</b><span>${t("due")}</span></div>
      <div class="card stat"><b>${VOCAB.length}</b><span>HSK 1–6</span></div>
    </div>

    <a class="card row indo-card" href="#indo">
      <span class="ic" aria-hidden="true">${FLAG_ID}</span>
      <div style="flex:1"><b>${t("indoTitle")}</b><div class="muted small-text">${t("indoDesc")}</div></div>
      <span aria-hidden="true">→</span>
    </a>

    

    <div class="card">
      <b>${t("week")}</b>
      <div class="bars" role="img" aria-label="${week.map((w) => `${w.label} ${w.xp} XP`).join(", ")}">
        ${week.map((w) => `<div class="bar"><i style="height:${Math.max(3, (w.xp / weekMax) * 70)}px"></i>${w.label}</div>`).join("")}
      </div>
    </div>
    <p class="sub center offline-note">${icon("offline", 16)} ${t("offline")}</p>`;
}

function weakestTone() {
  let worst = null;
  let worstAcc = 2;
  for (const tone of [1, 2, 3, 4]) {
    const right = state.tones[tone][0] + state.mirror[tone][0];
    const total = state.tones[tone][1] + state.mirror[tone][1];
    if (total >= 3 && right / total < worstAcc) {
      worstAcc = right / total;
      worst = tone;
    }
  }
  return worst ? `${t("tone" + worst)} (${Math.round(worstAcc * 100)}%)` : null;
}

// ---------- Vocabulary hub (search + per-level list) ----------
function renderVocab() {
  const now = Date.now();
  const due = dueWords(now).length;
  let shown = LIST_PAGE;
  let query = "";
  let level = state.level;

  view.innerHTML = `
    <h1>${t("vocab")}</h1>
    <div class="grid2">
      <a class="card tile primary" href="#review"><span class="ic">${icon("review", 22)}</span><b>${t("reviewNow")}</b><span>${due} ${t("reviewDesc")}</span></a>
      <a class="card tile" href="#learn"><span class="ic">${icon("plus", 22)}</span><b>${t("learnNew")}</b><span>HSK ${state.level} · ${t("newDesc")}</span></a>
    </div>
    <div class="level-chips" role="tablist" aria-label="${t("level")}">
      ${LEVELS.map((lv) => `<button class="chip ${lv === level ? "on" : ""}" role="tab" aria-selected="${lv === level}" data-lv="${lv}">HSK ${lv}</button>`).join("")}
    </div>
    <label class="sr-only" for="q">${t("search")}</label>
    <input id="q" class="search" type="search" placeholder="${t("search")}" autocomplete="off">
    <div class="card" id="list" style="margin-top:10px"></div>`;

  const listEl = document.getElementById("list");

  function matches(word) {
    if (!query) {
      return word.level === level;
    }
    const q = query.toLowerCase();
    return word.hanzi.includes(query) || stripTone(word.pinyin).replace(/\s/g, "").toLowerCase().includes(q.replace(/\s/g, ""))
      || word.id.toLowerCase().includes(q) || word.en.toLowerCase().includes(q);
  }

  function renderList() {
    const items = VOCAB.filter(matches);
    listEl.innerHTML = items.slice(0, shown).map((w) => {
      const card = state.cards[w.hanzi];
      const r = retention(card, now);
      const color = r >= 0.9 ? "var(--ok)" : r >= 0.7 ? "var(--gold)" : "var(--bad)";
      return `<button class="list-item" data-say="${esc(w.hanzi)}" aria-label="${esc(w.hanzi)} ${esc(w.pinyin)}, ${esc(gloss(w))}">
        <div class="zh">${coloredHanzi(w)}</div>
        <div style="flex:1;text-align:left">
          <div>${coloredPinyin(w)} <span class="pill tiny">HSK ${w.level}</span></div>
          <div class="muted" style="font-size:13px">${esc(gloss(w))}</div>
          ${card ? `<div class="meter" style="margin-top:6px"><i style="width:${r * 100}%;background:${color}"></i></div>` : ""}
        </div>
        ${card ? `<span class="pill green">${Math.round(r * 100)}%</span>` : `<span class="pill">${t("notLearned")}</span>`}
      </button>`;
    }).join("") + (items.length > shown ? `<button class="btn ghost block" id="more">${t("more")} (${items.length - shown})</button>` : "");
    listEl.querySelectorAll("[data-say]").forEach((el) => el.addEventListener("click", () => playAny(el.dataset.say)));
    const more = document.getElementById("more");
    if (more) {
      more.onclick = () => {
        shown += LIST_PAGE;
        renderList();
      };
    }
  }

  bind("[data-lv]", (el) => {
    level = Number(el.dataset.lv);
    shown = LIST_PAGE;
    view.querySelectorAll("[data-lv]").forEach((b) => {
      b.classList.toggle("on", b === el);
      b.setAttribute("aria-selected", b === el);
    });
    renderList();
  });
  document.getElementById("q").addEventListener("input", (e) => {
    query = e.target.value.trim();
    shown = LIST_PAGE;
    renderList();
  });
  renderList();
}

// Example for a word: hand-written EXAMPLES first, then Tatoeba (CC BY 2.0 FR) sentences that use only HSK words
// at or below the word's level. Returns [hanzi, pinyin, indonesian, english, tatoebaId|null].
function exampleFor(word) {
  if (EXAMPLES[word.hanzi]) {
    const ex = EXAMPLES[word.hanzi];
    return [ex[0], ex[1], ex[2], ex[3], null];
  }
  const rows = typeof TATOEBA !== "undefined" ? TATOEBA[word.hanzi] : null;
  return rows && rows.length ? rows[0] : null;
}

function exampleTranslation(ex) {
  if (state.lang === "id") {
    if (!ex[2]) {
      return `${esc(ex[3])} <span class="pill tiny">EN</span>`;
    }
    return ex[6] ? `${esc(ex[2])} <span class="mt-tag" title="Terjemahan mesin, belum dicek manusia">MT</span>` : esc(ex[2]);
  }
  return esc(ex[3] || ex[2]);
}

let tatoebaTokens = null;
// Native audio for a Tatoeba sentence: chain the recorded/composed audio of its HSK words.
function composedSentencePlan(text) {
  if (typeof TATOEBA === "undefined") {
    return null;
  }
  if (!tatoebaTokens) {
    tatoebaTokens = new Map();
    Object.values(TATOEBA).forEach((rows) => rows.forEach((row) => tatoebaTokens.set(row[0], row[5])));
  }
  const tokens = tatoebaTokens.get(text);
  if (!tokens) {
    return null;
  }
  const parts = [];
  for (const token of tokens.split(" ")) {
    const word = BY_HANZI.get(token);
    if (!word || !word.audio) {
      return null;
    }
    parts.push(word.audio === 1 ? `w/${token}` : word.audio);
  }
  return parts.join("|");
}

function wordCardHtml(word, withExample = true) {
  const ex = exampleFor(word);
  return `
    <div class="hanzi-big" data-len="${[...word.hanzi].length}">${coloredHanzi(word)}</div>
    <div class="pinyin">${coloredPinyin(word)}</div>
    <div class="meaning">${esc(gloss(word))}<small>${esc(glossOther(word))}</small></div>
    <div class="center" style="margin-top:10px"><button class="btn ghost small" data-say="${esc(word.hanzi)}" aria-label="${t("listen")} ${esc(word.hanzi)}">${icon("sound", 18)} ${t("listen")}</button>
      <span class="pill tiny">HSK ${word.level}</span></div>
    ${withExample && ex ? `<button class="example" data-say="${esc(ex[0])}" aria-label="${t("listen")}: ${esc(ex[0])}"><div class="zh">${zh(ex[0])} <span class="say-ic">${icon("sound", 16)}</span></div><div class="py">${esc(ex[1])}</div><div>${exampleTranslation(ex)}</div></button>${ex[4] ? `<div class="tiny muted center" style="margin-top:4px">Tatoeba <a href="https://tatoeba.org/sentences/show/${ex[4]}" target="_blank" rel="noopener">#${ex[4]}</a> · CC BY 2.0 FR</div>` : ""}` : ""}`;
}

// ---------- Learn new words ----------
function renderLearnSession() {
  const fresh = wordsAtLevel(state.level).filter((w) => !state.cards[w.hanzi]).slice(0, NEW_PER_SESSION);
  if (!fresh.length) {
    view.innerHTML = `<div class="card center">${mascotSvg("cheer", 88)}<h1>HSK ${state.level}</h1><p>${t("perfect")}</p><a class="btn" href="#me">${t("level")} →</a></div>`;
    return;
  }
  let step = 0;
  const firstTry = new Map();
  const quizQueue = shuffle(fresh);
  let xpGained = 0;

  function showIntro() {
    const word = fresh[step];
    view.innerHTML = `
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${fresh.length * 2}" aria-valuenow="${step}"><div style="width:${(step / (fresh.length * 2)) * 100}%"></div></div>
      <h1 class="sub">${t("sessionNew")} ${step + 1}/${fresh.length}</h1>
      <div class="card">${wordCardHtml(word)}</div>
      <button class="btn block" id="next">${t("next")} →</button>`;
    playWord(word);
    bindSay();
    const next = () => {
      step += 1;
      if (step < fresh.length) {
        showIntro();
      } else {
        showQuiz();
      }
    };
    document.getElementById("next").onclick = next;
    document.getElementById("next").focus();
    keyHandler = (e) => {
      if (e.key.toLowerCase() === "r") {
        playWord(word);
      }
    };
  }

  function showQuiz() {
    if (!quizQueue.length) {
      finish();
      return;
    }
    const word = quizQueue[0];
    const pool = wordsAtLevel(word.level).filter((w) => w.id !== word.id && w.en !== word.en);
    const options = shuffle([word, ...sample(pool, 3)]);
    const answered = fresh.length - new Set(quizQueue).size;
    view.innerHTML = `
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${fresh.length * 2}" aria-valuenow="${fresh.length + answered}"><div style="width:${((fresh.length + answered) / (fresh.length * 2)) * 100}%"></div></div>
      <h1 class="sub">${t("quizTime")}</h1>
      <div class="card"><div class="hanzi-big" data-len="${[...word.hanzi].length}">${coloredHanzi(word)}</div><div class="pinyin">${coloredPinyin(word)}</div></div>
      <div class="options">${options.map((o, i) => `<button class="option" data-i="${i}"><span class="key" aria-hidden="true">${i + 1}</span> ${esc(gloss(o))}</button>`).join("")}</div>`;
    let locked = false;
    const pick = (i) => {
      if (locked) {
        return;
      }
      locked = true;
      const el = view.querySelectorAll(".option")[i];
      const ok = options[i] === word;
      el.classList.add(ok ? "correct" : "wrong");
      announce(ok ? t("correct") : `${t("wrong")}: ${gloss(word)}`);
      if (!firstTry.has(word.hanzi)) {
        firstTry.set(word.hanzi, ok);
      }
      quizQueue.shift();
      if (ok) {
        xpGained += 2;
        playWord(word);
      } else {
        view.querySelectorAll(".option")[options.indexOf(word)].classList.add("correct");
        quizQueue.push(word);
      }
      setTimeout(showQuiz, ok ? 700 : 1400);
    };
    bind(".option", (el) => pick(Number(el.dataset.i)));
    keyHandler = (e) => {
      if (/^[1-4]$/.test(e.key)) {
        pick(Number(e.key) - 1);
      }
    };
  }

  function finish() {
    const now = Date.now();
    for (const word of fresh) {
      state.cards[word.hanzi] = schedule(null, firstTry.get(word.hanzi) ? 3 : 1, now);
    }
    addXP(xpGained + 5);
    view.innerHTML = `
      <div class="card center pop">
        ${mascotSvg("cheer", 88)}
        <h1>${t("done")}</h1>
        <p class="sub">${esc(mascotLine("done"))}</p>
        <p>${t("xpEarned")}: <b>+${xpGained + 5}</b></p>
        <div class="row wrap" style="justify-content:center">${fresh.map((w) => `<span class="pill ${firstTry.get(w.hanzi) ? "green" : ""}" style="font-size:18px">${zh(w.hanzi)}</span>`).join("")}</div>
      </div>
      <a class="btn block" href="#home">${t("backHome")}</a>`;
    announce(t("done"));
    celebrate();
  }

  showIntro();
}

// ---------- Review (FSRS) ----------
function renderReviewSession() {
  const queue = dueWords(Date.now()).slice(0, REVIEW_LIMIT);
  const total = queue.length;
  let doneCount = 0;
  let xpGained = 0;
  if (!total) {
    view.innerHTML = `<div class="card center">${mascotSvg("happy", 80)}<p>${t("noDue")}</p><p class="sub">${esc(mascotLine("noDue"))}</p><a class="btn" href="#learn">${t("learnNew")}</a></div>`;
    return;
  }

  function showFront() {
    if (!queue.length) {
      addXP(xpGained);
      const fit = updatePersonalization();
      const personalLine = fit.n >= PERSONAL_MIN_REVIEWS
        ? `<p class="sub">${t("personalScale")}: <b>${fit.k.toFixed(2)}${t("personalVs")}</b></p>`
        : "";
      view.innerHTML = `<div class="card center pop">${mascotSvg("cheer", 88)}<h1>${t("done")}</h1><p class="sub">${esc(mascotLine("done"))}</p><p>${t("xpEarned")}: <b>+${xpGained}</b></p>${personalLine}</div><a class="btn block" href="#home">${t("backHome")}</a>`;
      announce(t("done"));
      celebrate();
      return;
    }
    const word = queue[0];
    view.innerHTML = `
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${doneCount}"><div style="width:${(doneCount / total) * 100}%"></div></div>
      <h1 class="sub">${doneCount}/${total}</h1>
      <div class="card" id="card"><div class="hanzi-big">${zh(word.hanzi)}</div></div>
      <button class="btn block dark" id="reveal">${t("show")} <span class="key" aria-hidden="true">␣</span></button>
      <p class="sub center">${t("keys")}</p>`;
    document.getElementById("reveal").onclick = () => showBack(word);
    document.getElementById("reveal").focus();
    keyHandler = (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        showBack(word);
      }
    };
  }

  function showBack(word) {
    const now = Date.now();
    const card = state.cards[word.hanzi];
    const previews = [1, 2, 3, 4].map((g) => formatInterval(schedule(card, g, now), now));
    document.getElementById("card").innerHTML = wordCardHtml(word);
    playWord(word);
    bindSay();
    document.getElementById("reveal").outerHTML = `
      <div class="rate" role="group" aria-label="${t("good")}?">
        ${["again", "hard", "good", "easy"].map((k, i) => `<button class="btn r${i + 1}" data-g="${i + 1}" aria-label="${t(k)}, ${previews[i]}">${t(k)}<small>${previews[i]}</small></button>`).join("")}
      </div>`;
    view.querySelector('[data-g="3"]').focus();
    const rate = (grade) => {
      logReview(word.hanzi, card, grade, Date.now());
      state.cards[word.hanzi] = schedule(card, grade, Date.now());
      saveState();
      queue.shift();
      if (grade === 1) {
        queue.push(word);
      } else {
        doneCount += 1;
        xpGained += grade >= 3 ? 2 : 1;
      }
      showFront();
    };
    bind("[data-g]", (el) => rate(Number(el.dataset.g)));
    keyHandler = (e) => {
      if (/^[1-4]$/.test(e.key)) {
        rate(Number(e.key));
      } else if (e.key.toLowerCase() === "r") {
        playWord(word);
      }
    };
  }

  showFront();
}

// ---------- Tones: hear (native syllables) + speak (on-device pitch mirror) ----------
function renderTones(mode = "hear") {
  const statsHtml = (stats) => `<div class="grid4">${[1, 2, 3, 4]
    .map((tone) => {
      const [r, n] = stats[tone];
      return `<div class="card stat" style="padding:8px"><b class="t${tone}">${n ? Math.round((r / n) * 100) + "%" : "–"}</b><span>${t("tone" + tone)}</span></div>`;
    })
    .join("")}</div>`;

  view.innerHTML = `
    <h1>${t("tones")}</h1>
    <div class="row" role="tablist" style="margin-bottom:10px">
      <a class="chip ${mode === "hear" ? "on" : ""}" role="tab" aria-selected="${mode === "hear"}" href="#tones/hear">${icon("listen", 16)} ${t("hearMode")}</a>
      <a class="chip ${mode === "speak" ? "on" : ""}" role="tab" aria-selected="${mode === "speak"}" href="#tones/speak">${icon("mic", 16)} ${t("speakMode")}</a>
    </div>
    <div id="tone-body"></div>`;
  const body = document.getElementById("tone-body");
  if (mode === "speak") {
    renderToneMirror(body, statsHtml);
  } else {
    renderToneHear(body, statsHtml);
  }
}

function syllableAudioName(word) {
  return stripTone(word.pinyin).toLowerCase().replace("ü", "v");
}

function renderToneHear(body, statsHtml) {
  let round = 0;
  let right = 0;
  let showHint = false;
  const pool = HEARABLE_MONO.filter((w) => w.level <= Math.max(2, state.level));
  const words = sample(pool, TONE_ROUNDS);

  function showRound() {
    if (round >= words.length) {
      addXP(right);
      body.innerHTML = `${statsHtml(state.tones)}
        <div class="card center">${mascotSvg(right === words.length ? "cheer" : "encourage", 80)}<h1>${right}/${words.length}</h1><p>${right === words.length ? t("perfect") : t("keepGoing")}</p><p class="sub">${esc(mascotLine(right === words.length ? "perfect" : "tryAgain"))}</p></div>
        <button class="btn block" id="again">${icon("restart", 18)} ${t("practice")}</button>`;
      document.getElementById("again").onclick = () => renderTones("hear");
      return;
    }
    const word = words[round];
    const base = syllableAudioName(word);
    const answer = toneOf(word.pinyin);
    body.innerHTML = `
      ${statsHtml(state.tones)}
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${words.length}" aria-valuenow="${round}"><div style="width:${(round / words.length) * 100}%"></div></div>
      <div class="card center">
        <p class="sub">${t("whichTone")}</p>
        <div style="font-size:40px;font-weight:700;margin:4px 0">${stripTone(word.pinyin)}</div>
        <div id="hint" class="muted" style="min-height:24px" aria-live="polite">${showHint ? `${zh(word.hanzi)} · ${esc(gloss(word))}` : ""}</div>
        <div class="row" style="justify-content:center;margin-top:8px">
          <button class="btn" id="play">${icon("sound", 18)} ${t("listen")} <span class="key" aria-hidden="true">R</span></button>
          <button class="btn ghost" id="hintBtn">${icon("hint", 18)} ${t("hint")}</button>
        </div>
        <div class="tone-btns" role="group" aria-label="${t("whichTone")}">
          ${[1, 2, 3, 4].map((tone) => `<button class="tone-btn" data-tone="${tone}" aria-label="${t("tone" + tone)}, ${t("toneNames")[tone]}">${toneSvg(tone)}<b class="t${tone}">${tone}</b><small class="muted">${t("toneNames")[tone]}</small></button>`).join("")}
        </div>
        <div id="feedback" style="min-height:60px;margin-top:12px"></div>
      </div>`;
    const play = () => playSyllable(base, answer, word.hanzi);
    play();
    document.getElementById("play").onclick = play;
    document.getElementById("hintBtn").onclick = () => {
      showHint = !showHint;
      document.getElementById("hint").innerHTML = showHint ? `${zh(word.hanzi)} · ${esc(gloss(word))}` : "";
    };
    let answered = false;
    const choose = (pick) => {
      if (answered) {
        return;
      }
      answered = true;
      const ok = pick === answer;
      state.tones[answer][1] += 1;
      if (ok) {
        state.tones[answer][0] += 1;
        right += 1;
      }
      saveState();
      body.querySelectorAll("[data-tone]").forEach((b) => {
        b.disabled = true;
        if (Number(b.dataset.tone) === answer) {
          b.classList.add("correct");
        } else if (Number(b.dataset.tone) === pick) {
          b.classList.add("wrong");
        }
      });
      document.getElementById("feedback").innerHTML = `
        <div class="${ok ? "ok" : "bad"}" style="font-weight:800">${ok ? t("correct") : t("wrong")}</div>
        <div style="font-size:28px">${coloredHanzi(word)} <span style="font-size:20px">${coloredPinyin(word)}</span></div>
        <div class="muted">${esc(gloss(word))}</div>
        <button class="btn block" id="next" style="margin-top:8px">${t("next")} →</button>`;
      announce(`${ok ? t("correct") : t("wrong")}. ${t("tone" + answer)}`);
      document.getElementById("next").onclick = () => {
        round += 1;
        showRound();
      };
      document.getElementById("next").focus();
    };
    body.querySelectorAll("[data-tone]").forEach((el) => el.addEventListener("click", () => choose(Number(el.dataset.tone))));
    keyHandler = (e) => {
      if (/^[1-4]$/.test(e.key)) {
        choose(Number(e.key));
      } else if (e.key.toLowerCase() === "r") {
        play();
      }
    };
  }

  showRound();
}


// Pilot data: every Tone Mirror attempt is kept on-device as [time, hanzi, syllable, target tone, detected tone (0 = none)].
const TONE_LOG_MAX = 3000;
function logToneAttempt(word, target, result) {
  state.toneLog = state.toneLog || [];
  state.toneLog.push([Date.now(), word.hanzi, syllableAudioName(word), target, result && result.tone ? result.tone : 0]);
  if (state.toneLog.length > TONE_LOG_MAX) {
    state.toneLog.splice(0, state.toneLog.length - TONE_LOG_MAX);
  }
  saveState();
}

function toneLogCsv(log) {
  const rows = ["timestamp,hanzi,syllable,target_tone,detected_tone,match"];
  for (const [time, hanzi, syllable, target, detected] of log || []) {
    rows.push(`${new Date(time).toISOString()},${hanzi},${syllable},${target},${detected},${detected === target ? 1 : 0}`);
  }
  return rows.join("\n");
}

function toneAccuracyNote() {
  return `<p class="small-text muted">${t("toneAccuracy")}: ${(TONE_MIRROR_ACCURACY * 100).toFixed(0)}%</p>`;
}

function renderToneMirror(body, statsHtml) {
  const pool = MONO_TONED.filter((w) => w.level <= Math.max(2, state.level));
  let word = pool[Math.floor(Math.random() * pool.length)];

  function draw() {
    const target = toneOf(word.pinyin);
    body.innerHTML = `
      ${statsHtml(state.mirror)}
      <div class="card center">
        <p class="sub">${t("speakTip")}</p>
        ${toneAccuracyNote()}
        <div class="hanzi-big" style="font-size:72px">${coloredHanzi(word)}</div>
        <div class="pinyin">${coloredPinyin(word)} · <span class="muted">${esc(gloss(word))}</span></div>
        <svg id="pitch" viewBox="0 0 300 120" width="100%" height="120" role="img" aria-label="${t("youSaidTone")}">
          <path d="${TONE_PATHS[target].replace(/(\d+) (\d+)/g, (m, x, y) => `${x * 3} ${y * 2.6 + 6}`)}" stroke="var(--t${target})" stroke-width="10" stroke-opacity=".25" fill="none" stroke-linecap="round"/>
        </svg>
        <div id="mirror-result" aria-live="polite" style="min-height:48px"></div>
        <div class="row" style="justify-content:center">
          <button class="btn ghost" id="native">${icon("sound", 18)} ${t("listen")}</button>
          <button class="btn dark" id="rec" aria-label="${t("hold")}">${icon("mic", 18)} ${t("hold")}</button>
          <button class="btn ghost" id="skip" aria-label="${t("next")}">→</button>
        </div>
      </div>`;
    const base = syllableAudioName(word);
    playSyllable(base, target, word.hanzi);
    document.getElementById("native").onclick = () => playSyllable(base, target, word.hanzi);
    document.getElementById("skip").onclick = () => {
      word = pool[Math.floor(Math.random() * pool.length)];
      draw();
    };
    const rec = document.getElementById("rec");
    let session = null;
    const start = async (e) => {
      e.preventDefault();
      if (session) {
        return;
      }
      session = await startRecording();
      if (!session) {
        document.getElementById("mirror-result").innerHTML = `<span class="bad">${t("micBlocked")}</span>`;
        return;
      }
      rec.classList.add("recording");
    };
    const stop = async () => {
      if (!session) {
        return;
      }
      const recording = session;
      session = null;
      rec.classList.remove("recording");
      const { samples, sampleRate } = await recording.stop();
      const result = classifyTone(pitchTrack(samples, sampleRate));
      logToneAttempt(word, target, result);
      showResult(result, target);
    };
    rec.addEventListener("pointerdown", start);
    rec.addEventListener("pointerup", stop);
    rec.addEventListener("pointerleave", stop);
    rec.addEventListener("keydown", (e) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        start(e);
      }
    });
    rec.addEventListener("keyup", (e) => {
      if (e.key === " " || e.key === "Enter") {
        stop();
      }
    });
  }

  function showResult(result, target) {
    const out = document.getElementById("mirror-result");
    if (!result.tone) {
      out.innerHTML = `<span class="bad">${t("noVoice")}</span>`;
      return;
    }
    const svg = document.getElementById("pitch");
    const c = result.contour;
    const lo = Math.min(...c, -4);
    const hi = Math.max(...c, 4);
    const pts = c.map((v, i) => `${(i / (c.length - 1)) * 300},${110 - ((v - lo) / (hi - lo)) * 100}`).join(" ");
    svg.insertAdjacentHTML("beforeend", `<polyline points="${pts}" fill="none" stroke="var(--ink)" stroke-width="3"/>`);
    const ok = result.tone === target;
    state.mirror[target][1] += 1;
    if (ok) {
      state.mirror[target][0] += 1;
      addXP(2);
    }
    saveState();
    out.innerHTML = `<b class="${ok ? "ok" : "bad"}">${ok ? t("correct") : t("wrong")}</b> · ${t("youSaidTone")}: <b class="t${result.tone}">${t("tone" + result.tone)}</b> (${t("toneNames")[result.tone]})`;
  }

  draw();
}

// Microphone capture via Web Audio (no network, no speech service).
async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return null;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true } });
  } catch (err) {
    return null;
  }
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const source = ctx.createMediaStreamSource(stream);
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const chunks = [];
  processor.onaudioprocess = (event) => {
    chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
  };
  source.connect(processor);
  processor.connect(ctx.destination);
  return {
    async stop() {
      processor.disconnect();
      source.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      const length = chunks.reduce((s, c) => s + c.length, 0);
      const samples = new Float32Array(length);
      let offset = 0;
      for (const c of chunks) {
        samples.set(c, offset);
        offset += c.length;
      }
      const sampleRate = ctx.sampleRate;
      await ctx.close();
      return { samples, sampleRate };
    },
  };
}

// ---------- Writing with stroke order ----------
function renderWrite(arg) {
  const pool = VOCAB.filter((w) => w.hanzi.length === 1 && w.level <= state.level);
  const learned = pool.filter((w) => state.cards[w.hanzi]);
  const source = learned.length >= 5 ? learned : pool;
  const word = (arg && BY_HANZI.get(decodeURIComponent(arg))) || source[Math.floor(Math.random() * source.length)];
  const ch = [...word.hanzi][0];
  let mode = "trace";

  view.innerHTML = `
    <h1>${t("write")}</h1>
    <p class="sub">${t("writeTip")}</p>
    <div class="card center">
      <div class="pinyin">${coloredPinyin(word)}</div>
      <div class="meaning">${esc(gloss(word))}</div>
      <div class="row" role="tablist" style="justify-content:center;margin:8px 0">
        <button class="chip" data-mode="watch">${icon("play", 14)} ${t("watch")}</button>
        <button class="chip on" data-mode="trace">${t("trace")}</button>
        <button class="chip" data-mode="recall">${t("recall")}</button>
      </div>
      <div class="write-box">
        <svg id="glyph" viewBox="0 0 1024 1024" width="280" height="280" role="img" aria-label="${esc(word.hanzi)}">
          <g transform="translate(0,900) scale(1,-1)" id="glyph-g"></g>
        </svg>
        <svg id="ink" viewBox="0 0 1024 1024" width="280" height="280" aria-hidden="true"></svg>
      </div>
      <div id="write-status" class="muted" aria-live="polite" style="min-height:24px"></div>
      <div class="row" style="justify-content:center">
        <button class="btn ghost small" data-say="${esc(word.hanzi)}" aria-label="${t("listen")}">${icon("sound", 18)}</button>
        <button class="btn ghost small" id="restart" aria-label="${t("practice")}">${icon("restart", 18)}</button>
      </div>
    </div>
    <button class="btn block dark" id="next">${t("next")} →</button>`;
  bindSay();

  document.getElementById("next").onclick = () => {
    location.hash = "write";
    route();
  };

  loadStrokes(ch).then((data) => {
    if (!data) {
      document.getElementById("write-status").textContent = "—";
      return;
    }
    const group = document.getElementById("glyph-g");
    const ink = document.getElementById("ink");
    let strokeIndex = 0;
    let misses = 0;
    let firstTry = 0;
    let missesThisStroke = 0;
    let animTimer = null;

    function paint() {
      group.innerHTML = data.s.map((d, i) => {
        const done = i < strokeIndex;
        const outline = mode === "trace" || mode === "watch";
        return `<path d="${d}" fill="${done ? "var(--ink)" : outline ? "#ece3dc" : "transparent"}" data-i="${i}"/>`;
      }).join("");
    }

    function status(text) {
      document.getElementById("write-status").textContent = text;
    }

    function reset() {
      clearInterval(animTimer);
      strokeIndex = 0;
      misses = 0;
      firstTry = 0;
      missesThisStroke = 0;
      ink.innerHTML = "";
      paint();
      status(`0/${data.s.length} ${t("strokes")}`);
      if (mode === "watch") {
        animTimer = setInterval(() => {
          strokeIndex += 1;
          paint();
          status(`${strokeIndex}/${data.s.length} ${t("strokes")}`);
          if (strokeIndex >= data.s.length) {
            clearInterval(animTimer);
          }
        }, 600);
      }
    }

    function hintStroke() {
      const path = group.querySelector(`[data-i="${strokeIndex}"]`);
      if (path) {
        path.setAttribute("fill", "var(--red)");
        setTimeout(() => paint(), 700);
      }
    }

    // Pointer drawing in glyph coordinates (1024 units, y flipped like the stroke data)
    let drawing = null;
    const toGlyph = (e) => {
      const rect = ink.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 1024;
      const y = ((e.clientY - rect.top) / rect.height) * 1024;
      return [x, 900 - y];
    };
    ink.addEventListener("pointerdown", (e) => {
      if (mode === "watch" || strokeIndex >= data.s.length) {
        return;
      }
      ink.setPointerCapture(e.pointerId);
      drawing = [toGlyph(e)];
    });
    ink.addEventListener("pointermove", (e) => {
      if (!drawing) {
        return;
      }
      drawing.push(toGlyph(e));
      ink.innerHTML = `<polyline points="${drawing.map(([x, y]) => `${x},${900 - y}`).join(" ")}" fill="none" stroke="var(--red)" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`;
    });
    ink.addEventListener("pointerup", () => {
      if (!drawing) {
        return;
      }
      const stroke = drawing;
      drawing = null;
      ink.innerHTML = "";
      submitStroke(stroke);
    });

    function submitStroke(stroke) {
      if (strokeMatches(stroke, data.m[strokeIndex])) {
        if (missesThisStroke === 0) {
          firstTry += 1;
        }
        strokeIndex += 1;
        missesThisStroke = 0;
        paint();
        if (strokeIndex >= data.s.length) {
          const score = Math.round((firstTry / data.s.length) * 100);
          status(`${t("writeDone")}: ${score}%`);
          announce(`${t("writeDone")} ${score}%`);
          addXP(Math.round(score / (mode === "recall" ? 12 : 25)));
          playWord(word);
        } else {
          status(`${t("strokeOk")} · ${strokeIndex}/${data.s.length}`);
        }
      } else {
        misses += 1;
        missesThisStroke += 1;
        status(t("strokeMiss"));
        if (missesThisStroke >= 2) {
          hintStroke();
        }
      }
    }

    view.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        mode = btn.dataset.mode;
        view.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("on", b === btn));
        reset();
      });
    });
    document.getElementById("restart").onclick = reset;
    window.__writeTest = { data, submitStroke, state: () => ({ strokeIndex, firstTry, misses }) };
    reset();
  });
}

// ---------- Roleplay ----------
function renderTalk(arg) {
  if (arg === undefined) {
    view.innerHTML = `
      <h1>${t("talk")}</h1>
      <p class="sub">${t("talkTip")}</p>
      ${SCENARIOS.map((s, i) => `
        <a class="card row" href="#talk/${i}" style="text-decoration:none;color:inherit">
          <span class="scene-ic">${icon(s.icon, 26)}</span>
          <div style="flex:1"><b>${state.lang === "id" ? s.id : s.en}</b><div class="muted" style="font-size:13px">${s.steps.length}× · ${zh(s.steps[0].bot[0])}</div></div>
          ${state.talkBest[s.key] !== undefined ? `<span class="pill green">${t("best")} ${state.talkBest[s.key]}%</span>` : `<span class="pill">${t("start")}</span>`}
        </a>`).join("")}`;
    return;
  }
  const scenario = SCENARIOS[Number(arg)] || SCENARIOS[0];
  let step = 0;
  let firstTryRight = 0;
  let missedThisStep = false;
  const history = [];

  function bubble(line, who) {
    const tr = state.lang === "id" ? line[2] : line[3];
    return `<button class="bubble ${who}" data-say="${esc(line[0])}"><div class="zh">${zh(line[0])}</div><div class="py">${line[1]}</div><div class="tr">${esc(tr)}</div></button>`;
  }

  function render() {
    const finished = step >= scenario.steps.length;
    const current = finished ? null : scenario.steps[step];
    view.innerHTML = `
      <div class="row"><a href="#talk" class="btn ghost small" aria-label="${t("back")}">${icon("back", 18)}</a><h1 style="margin:0">${state.lang === "id" ? scenario.id : scenario.en}</h1></div>
      <div class="progress"><div style="width:${(step / scenario.steps.length) * 100}%"></div></div>
      <div class="chat" aria-live="polite">
        ${history.join("")}
        ${finished ? bubble(scenario.end, "bot") : bubble(current.bot, "bot")}
      </div>
      <div id="replies" class="options"></div>`;
    bindSay();
    if (finished) {
      const pct = Math.round((firstTryRight / scenario.steps.length) * 100);
      state.talkBest[scenario.key] = Math.max(state.talkBest[scenario.key] || 0, pct);
      addXP(5 + firstTryRight * 2);
      playSentence(scenario.end[0]);
      document.getElementById("replies").innerHTML = `
        <div class="card center">${mascotSvg(pct === 100 ? "cheer" : "encourage", 80)}<h1>${pct}%</h1><p>${pct === 100 ? t("perfect") : t("keepGoing")}</p><p class="sub">${esc(mascotLine(pct === 100 ? "perfect" : "tryAgain"))}</p></div>
        <a class="btn block" href="#talk">${t("next")} →</a>`;
      return;
    }
    playSentence(current.bot[0]);
    const box = document.getElementById("replies");
    const canRecognize = state.onlineSpeech && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition) && navigator.onLine;
    box.insertAdjacentHTML("beforebegin", shadowHtml());
    bindShadow(current.bot[0]);
    box.innerHTML = `
      ${current.replies.map((r, i) => `<button class="option" data-reply="${i}"><span class="key" aria-hidden="true">${i + 1}</span><div style="font-size:19px">${zh(r.zh)}</div><div class="muted" style="font-size:12px">${r.py}</div></button>`).join("")}
      ${canRecognize ? `<button class="btn dark block" id="mic">${icon("mic", 18)} ${t("speak")}</button>` : ""}
      <div id="heard" class="muted center" aria-live="polite"></div>`;
    bind("[data-reply]", (el) => choose(Number(el.dataset.reply)));
    keyHandler = (e) => {
      if (/^[1-3]$/.test(e.key)) {
        choose(Number(e.key) - 1);
      }
    };
    const mic = document.getElementById("mic");
    if (mic) {
      mic.onclick = () => listenOnce((alternatives) => {
        let best = { idx: -1, sim: 0 };
        current.replies.forEach((r, idx) => {
          for (const alt of alternatives) {
            const sim = similarity(alt, r.zh);
            if (sim > best.sim) {
              best = { idx, sim };
            }
          }
        });
        document.getElementById("heard").textContent = `${t("youSaid")}: “${alternatives[0]}” (${Math.round(best.sim * 100)}%)`;
        if (best.sim >= 0.5) {
          choose(best.idx);
        } else {
          toast(t("notHeard"));
        }
      });
    }
  }

  function choose(idx) {
    const current = scenario.steps[step];
    const reply = current.replies[idx];
    const button = view.querySelector(`[data-reply="${idx}"]`);
    if (!reply || !button) {
      return;
    }
    if (!reply.ok) {
      missedThisStep = true;
      button.classList.add("wrong");
      if (!button.querySelector(".bad")) {
        button.insertAdjacentHTML("beforeend", `<div class="bad" style="font-size:13px">${icon("close", 14)} ${esc(state.lang === "id" ? reply.id : reply.en)}</div>`);
      }
      announce(`${t("wrong")}: ${state.lang === "id" ? reply.id : reply.en}`);
      return;
    }
    if (!missedThisStep) {
      firstTryRight += 1;
    }
    missedThisStep = false;
    history.push(bubble(current.bot, "bot"));
    history.push(bubble([reply.zh, reply.py, reply.id, reply.en], "me"));
    step += 1;
    render();
  }

  render();
}

function shadowHtml() {
  return `<div class="card shadow-box">
    <div class="row wrap" style="justify-content:center">
      <button class="btn dark small" id="shadow-rec" aria-label="${t("shadowHold")}">${icon("mic", 16)} ${t("shadowHold")}</button>
      <button class="btn ghost small" id="shadow-native" aria-label="${t("listen")}">${icon("sound", 16)} ${t("listen")}</button>
      <button class="btn ghost small" id="shadow-mine" disabled aria-label="${t("shadowMine")}">${icon("play", 14)} ${t("shadowMine")}</button>
    </div>
    <svg id="shadow-pitch" viewBox="0 0 300 60" width="100%" height="60" aria-hidden="true"></svg>
    <div id="shadow-result" class="muted center small-text" aria-live="polite">${t("shadowTip")}</div>
  </div>`;
}

function bindShadow(line) {
  const rec = document.getElementById("shadow-rec");
  const mine = document.getElementById("shadow-mine");
  let session = null;
  let url = null;
  document.getElementById("shadow-native").onclick = () => playSentence(line);
  const start = async (e) => {
    e.preventDefault();
    if (session) {
      return;
    }
    session = await startRecording();
    if (!session) {
      document.getElementById("shadow-result").textContent = t("micBlocked");
      return;
    }
    rec.classList.add("recording");
  };
  const stop = async () => {
    if (!session) {
      return;
    }
    const recording = session;
    session = null;
    rec.classList.remove("recording");
    const { samples, sampleRate } = await recording.stop();
    if (url) {
      URL.revokeObjectURL(url);
    }
    url = URL.createObjectURL(encodeWav(samples, sampleRate));
    mine.disabled = false;
    mine.onclick = () => {
      stopAudio();
      const audio = new Audio(url);
      currentAudio.push(audio);
      audio.play();
    };
    const voiced = voicedSeconds(samples, sampleRate);
    const expected = syllableCount(line) * 0.22;
    const ratio = voiced / Math.max(0.3, expected);
    const track = pitchTrack(samples, sampleRate).filter((f) => f > 0);
    if (track.length > 4) {
      const lo = Math.min(...track);
      const hi = Math.max(...track);
      const pts = track.map((f, i) => `${(i / (track.length - 1)) * 300},${55 - ((f - lo) / Math.max(1, hi - lo)) * 50}`).join(" ");
      document.getElementById("shadow-pitch").innerHTML = `<polyline points="${pts}" fill="none" stroke="var(--red)" stroke-width="2.5"/>`;
    }
    const verdict = voiced < 0.25 ? t("noVoice") : ratio < 0.5 ? t("shadowShort") : ratio > 2.2 ? t("shadowLong") : t("shadowGood");
    document.getElementById("shadow-result").textContent = `${verdict} (${voiced.toFixed(1)} s)`;
    if (voiced >= 0.25 && ratio >= 0.5 && ratio <= 2.2) {
      addXP(1);
    }
  };
  rec.addEventListener("pointerdown", start);
  rec.addEventListener("pointerup", stop);
  rec.addEventListener("pointerleave", stop);
  rec.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      start(e);
    }
  });
  rec.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") {
      stop();
    }
  });
}

function listenOnce(onText) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    toast(t("micNo"));
    return;
  }
  const rec = new Recognition();
  rec.lang = "zh-CN";
  rec.maxAlternatives = 3;
  rec.onresult = (event) => onText([...event.results[0]].map((alt) => alt.transcript));
  rec.onerror = () => toast(t("notHeard"));
  toast(t("listening"));
  rec.start();
}

// ---------- Exam tab: full HSK mock papers live in exam_ui.js; the 10-question vocabulary quiz stays here ----------
function renderExam(arg) {
  renderExamScreen(arg);
}

function renderQuickQuiz() {
  const best = state.quizBest ? state.quizBest[state.level] : undefined;
  view.innerHTML = `
    <a class="back-link" href="#exam">${icon("back", 16)} ${t("exam")}</a>
    <h1>${state.lang === "id" ? "Kuis kosakata" : "Vocabulary quiz"} · HSK ${state.level}</h1>
    <div class="card"><p>${t("examTip")}</p>
      ${best !== undefined ? `<p><span class="pill green">${t("best")}: ${best}/10</span></p>` : ""}
      <button class="btn block" id="go">${t("startExam")}</button></div>`;
  document.getElementById("go").onclick = runExam;
}

function runExam() {
  const questions = generateQuiz(TEST_QUESTIONS, Math.random, state.level, true);
  let index = 0;
  let score = 0;
  const missed = [];

  function promptHtml(q) {
    const w = q.word;
    switch (q.type) {
      case "meaning":
        return `<p class="sub">${t("meaningQ")}</p><div class="hanzi-big">${zh(w.hanzi)}</div>`;
      case "hanzi":
        return `<p class="sub">${t("hanziQ")}</p><div class="meaning" style="font-size:24px;font-weight:700">${esc(gloss(w))}</div>`;
      case "pinyin":
        return `<p class="sub">${t("pinyinQ")}</p><div class="pinyin" style="font-size:32px">${w.pinyin}</div>`;
      case "listen":
        return `<p class="sub">${t("listenQ")}</p><div class="center"><button class="btn" id="play">${icon("sound", 18)} ${t("listen")}</button></div>`;
      default:
        return `<p class="sub">${t("toneQ")}</p><div class="hanzi-big">${zh(w.hanzi)}</div><div class="pinyin">${stripTone(w.pinyin)}</div>`;
    }
  }

  function optionLabel(q, o) {
    if (q.type === "tone") {
      return `${t("tone" + o)} · ${t("toneNames")[o]}`;
    }
    return q.type === "meaning" ? esc(gloss(o)) : zh(o.hanzi);
  }

  function show() {
    if (index >= questions.length) {
      state.quizBest = state.quizBest || {};
      state.quizBest[state.level] = Math.max(state.quizBest[state.level] || 0, score);
      addXP(score * 2);
      view.innerHTML = `
        <h1>${t("result")} · HSK ${state.level}</h1>
        <div class="card center"><div style="font-size:52px;font-weight:800">${score}<span class="muted" style="font-size:20px"> ${t("ofTen")}</span></div>
        <p>${t("readiness")}: <b>${score * 10}%</b></p>
        <div class="row wrap" style="justify-content:center">${missed.map((w) => `<span class="pill" style="font-size:18px">${zh(w.hanzi)} ${w.pinyin}</span>`).join("")}</div></div>
        ${missed.length ? `<button class="btn block" id="add">${t("addMissed")}</button>` : ""}
        <a class="btn block ghost" style="margin-top:10px" href="#exam/quick">${icon("restart", 18)} ${t("retake")}</a>`;
      announce(`${t("result")}: ${score} ${t("ofTen")}`);
      const add = document.getElementById("add");
      if (add) {
        add.onclick = () => {
          const now = Date.now();
          for (const w of missed) {
            state.cards[w.hanzi] = state.cards[w.hanzi] ? { ...state.cards[w.hanzi], due: now } : schedule(null, 1, now - 10 * MINUTE);
          }
          saveState();
          toast(t("added"));
          add.disabled = true;
        };
      }
      return;
    }
    const q = questions[index];
    const zhOptions = q.type === "hanzi" || q.type === "pinyin" || q.type === "listen";
    view.innerHTML = `
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${index}"><div style="width:${(index / questions.length) * 100}%"></div></div>
      <h1 class="sub">${index + 1}/${questions.length}</h1>
      <div class="card">${promptHtml(q)}</div>
      <div class="options" style="${zhOptions ? "grid-template-columns:1fr 1fr" : ""}">
        ${q.options.map((o, i) => `<button class="option ${zhOptions ? "zh" : ""}" data-i="${i}"><span class="key" aria-hidden="true">${i + 1}</span> ${optionLabel(q, o)}</button>`).join("")}
      </div>`;
    const play = document.getElementById("play");
    if (play) {
      play.onclick = () => playWord(q.word);
      playWord(q.word);
    }
    let locked = false;
    const pick = (i) => {
      if (locked || !q.options[i]) {
        return;
      }
      locked = true;
      const ok = q.options[i] === q.answer;
      const buttons = view.querySelectorAll(".option");
      buttons[i].classList.add(ok ? "correct" : "wrong");
      buttons[q.options.indexOf(q.answer)].classList.add("correct");
      buttons.forEach((b) => {
        b.disabled = true;
      });
      announce(ok ? t("correct") : t("wrong"));
      if (ok) {
        score += 1;
      } else {
        missed.push(q.word);
      }
      index += 1;
      setTimeout(show, ok ? 700 : 1500);
    };
    bind(".option", (el) => pick(Number(el.dataset.i)));
    keyHandler = (e) => {
      if (/^[1-4]$/.test(e.key)) {
        pick(Number(e.key) - 1);
      } else if (e.key.toLowerCase() === "r" && q.type === "listen") {
        playWord(q.word);
      }
    };
  }

  show();
}

// ---------- Stats & calibration ----------
function renderStats() {
  const cal = calibration(state.log);
  const plotted = cal.bins.filter((b) => b.n);
  const toXY = (p, a) => `${20 + p * 260},${270 - a * 250}`;
  view.innerHTML = `
    <div class="row"><a href="#home" class="btn ghost small" aria-label="←">←</a><h1 style="margin:0">${t("stats")}</h1></div>
    <div class="card">
      <b>${t("calibration")}</b>
      <p class="sub">${t("calibDesc")}</p>
      ${cal.count < 20 ? `<p class="muted">${t("calibEmpty")} (${cal.count} ${t("reviews")})</p>` : ""}
      <svg viewBox="0 0 300 290" width="100%" role="img" aria-label="${t("calibration")}">
        <rect x="20" y="20" width="260" height="250" fill="var(--surface)" stroke="var(--line)"/>
        <line x1="20" y1="270" x2="280" y2="20" stroke="var(--muted)" stroke-dasharray="5 5"/>
        ${plotted.map((b) => `<circle cx="${20 + b.predicted * 260}" cy="${270 - b.actual * 250}" r="${4 + Math.min(10, Math.sqrt(b.n))}" fill="var(--red)" fill-opacity=".7"><title>${Math.round(b.predicted * 100)}% → ${Math.round(b.actual * 100)}% (n=${b.n})</title></circle>`).join("")}
        ${plotted.length > 1 ? `<polyline points="${plotted.map((b) => toXY(b.predicted, b.actual)).join(" ")}" fill="none" stroke="var(--red)" stroke-width="2"/>` : ""}
        <text x="150" y="288" font-size="11" text-anchor="middle" fill="var(--muted)">${t("predicted")}</text>
        <text x="8" y="150" font-size="11" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 8 150)">${t("actual")}</text>
      </svg>
      ${cal.count ? `<p class="small-text">n = ${cal.count} · Brier ${cal.brier.toFixed(3)} · ECE ${(cal.ece * 100).toFixed(1)}%</p>` : ""}
    </div>
    <div class="card">
      <b>${t("personalTitle")}</b>
      <p class="sub">${t("personalDesc")}</p>
      ${(() => {
        const fit = fitStabilityScale(state.log);
        if (fit.n < PERSONAL_MIN_REVIEWS) {
          return `<p class="muted">${PERSONAL_MIN_REVIEWS - fit.n} ${t("personalNeed")}</p>`;
        }
        return `<p>${t("personalScale")}: <b>${fit.k.toFixed(2)}${t("personalVs")}</b> (n = ${fit.n})</p>
          <p class="small-text">${t("personalFit")}: ${fit.before.toFixed(3)} → ${fit.after.toFixed(3)}</p>`;
      })()}
    </div>
    <div class="card">
      <b>${t("badges")}</b>
      <div class="row wrap" style="margin-top:8px">${[...STREAK_BADGES.map((n) => `streak-${n}`), ...WORD_BADGES.map((n) => `words-${n}`)].map((id) => `<span class="badge ${earnedBadges().includes(id) ? "on" : ""}">${badgeLabel(id)}</span>`).join("")}</div>
    </div>
    <div class="card">
      <div class="list-item"><span style="flex:1">${t("tones")} (${t("hearMode")})</span>${[1, 2, 3, 4].map((tn) => `<span class="pill tiny t${tn}">${state.tones[tn][1] ? Math.round((state.tones[tn][0] / state.tones[tn][1]) * 100) : "–"}%</span>`).join(" ")}</div>
      <div class="list-item"><span style="flex:1">${t("tones")} (${t("speakMode")})</span>${[1, 2, 3, 4].map((tn) => `<span class="pill tiny t${tn}">${state.mirror[tn][1] ? Math.round((state.mirror[tn][0] / state.mirror[tn][1]) * 100) : "–"}%</span>`).join(" ")}</div>
      ${LEVELS.map((lv) => {
        const words = wordsAtLevel(lv);
        const n = words.filter((w) => state.cards[w.hanzi]).length;
        return `<div class="list-item"><span style="flex:1">HSK ${lv}</span><span class="muted">${n}/${words.length}</span></div>`;
      }).join("")}
    </div>`;
}

// ---------- Made for Indonesian speakers ----------
function renderIndo() {
  view.innerHTML = `
    <div class="row"><a href="#home" class="btn ghost small" aria-label="←">←</a><h1 style="margin:0">${FLAG_ID} ${t("indoTitle")}</h1></div>
    <p class="sub">${t("indoDesc")}</p>
    <div class="card">
      <b>${t("loanTitle")}</b>
      <p class="sub">${t("loanDesc")}</p>
      ${LOANWORDS.map((w) => `
        <div class="list-item loan">
          <span class="loan-indo">${esc(w.indo)}</span>
          <span class="muted" aria-hidden="true">→</span>
          <button class="btn ghost small" data-say="${w.zh}" aria-label="${esc(w.indo)}: ${w.py}">${zh(w.zh)} <span class="muted small-text">${w.py}</span></button>
          <span class="spacer"></span>
          ${w.hsk ? `<span class="pill blue tiny">HSK ${w.hsk}</span>` : ""}
          <span class="muted small-text loan-mean">${esc(state.lang === "id" ? w.id : w.en)} · Hokkien <i>${esc(w.hok)}</i></span>
        </div>`).join("")}
      <p class="small-text muted">${t("source")}: Wikipedia, List of Chinese loanwords in Indonesian</p>
    </div>
    <div class="card">
      <b>${t("trapTitle")}</b>
      <p class="sub">${t("trapDesc")}</p>
      ${PINYIN_TRAPS.map((trap) => `
        <div class="trap">
          <span class="pill">${esc(trap.key)}</span>
          <p>${esc(state.lang === "id" ? trap.id : trap.en)}</p>
          <div class="row wrap">${trap.words.map((h) => {
            const word = BY_HANZI.get(h);
            return `<button class="btn ghost small" data-say="${h}" aria-label="${word ? word.pinyin : h}">${zh(h)} <span class="small-text">${word ? coloredPinyin(word) : ""}</span></button>`;
          }).join("")}</div>
        </div>`).join("")}
    </div>`;
  bindSay();
}

// ---------- Settings ----------
function renderSettings() {
  view.innerHTML = `
    <h1>${t("settings")}</h1>
    <div class="card">
      <div class="list-item"><label for="lang" style="flex:1">${t("language")}</label>
        <select id="lang"><option value="id">Bahasa Indonesia</option><option value="en">English</option></select></div>
      <div class="list-item"><label for="level" style="flex:1">${t("level")}</label>
        <select id="level">${LEVELS.map((lv) => `<option value="${lv}" ${lv === state.level ? "selected" : ""}>HSK ${lv} (${wordsAtLevel(lv).length})</option>`).join("")}</select></div>
      <div class="list-item"><label for="theme" style="flex:1">${t("theme")}</label>
        <select id="theme">${["auto", "light", "dark"].map((th) => `<option value="${th}" ${th === (state.theme || "auto") ? "selected" : ""}>${t("theme" + th[0].toUpperCase() + th.slice(1))}</option>`).join("")}</select></div>
      <div class="list-item"><label for="goal" style="flex:1">${t("dailyGoal")} (XP)</label>
        <select id="goal">${[10, 20, 30, 50, 80].map((g) => `<option ${g === state.goal ? "selected" : ""}>${g}</option>`).join("")}</select></div>
      <div class="list-item"><span style="flex:1">${t("voice")}</span><span class="ok small-text">${t("voiceOk")}</span></div>
      <div class="list-item"><label for="online" style="flex:1">${t("onlineSpeech")}</label><input type="checkbox" id="online" ${state.onlineSpeech ? "checked" : ""}></div>
    </div>
    <div class="card">
      <a class="btn block ghost" href="#stats">${icon("chart", 18)} ${t("stats")}</a>
      <button class="btn block ghost" id="export" style="margin-top:10px">${icon("download", 18)} ${t("exportData")}</button>
      <button class="btn block ghost" id="csv" style="margin-top:10px">${icon("download", 18)} ${t("studyData")}</button>
      <button class="btn block ghost" id="csvTones" style="margin-top:10px">${icon("download", 18)} ${t("toneData")} (${(state.toneLog || []).length})</button>
      <label class="btn block ghost" style="margin-top:10px">${icon("upload", 18)} ${t("importData")}<input type="file" id="import" accept="application/json" class="sr-only"></label>
      <button class="btn block" id="reset" style="margin-top:10px">${icon("trash", 18)} ${t("reset")}</button>
    </div>
    <p class="sub center offline-note">${icon("offline", 16)} ${t("offline")}</p>
    <p class="sub center small-text">Data: HSK 3.0 list (complete-hsk-vocabulary, MIT) · CC-CIDICT (CC BY-SA 4.0) · audio-cmn / Shtooka (CC BY-SA) · Make Me a Hanzi stroke data (Arphic PL)</p>`;
  const lang = document.getElementById("lang");
  lang.value = state.lang;
  lang.onchange = () => {
    state.lang = lang.value;
    saveState();
    route();
  };
  document.getElementById("level").onchange = (e) => {
    state.level = Number(e.target.value);
    state.onboarded = true;
    saveState();
  };
  document.getElementById("online").onchange = (e) => {
    state.onlineSpeech = e.target.checked;
    saveState();
  };
  document.getElementById("theme").onchange = (e) => {
    state.theme = e.target.value;
    saveState();
    applyTheme();
  };
  document.getElementById("goal").onchange = (e) => {
    state.goal = Number(e.target.value);
    saveState();
  };
  const download = (name, text, type) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([text], { type }));
    link.download = name;
    link.click();
  };
  document.getElementById("export").onclick = () => download(`nadaku-progress-${dateKey(Date.now())}.json`, JSON.stringify(state, null, 2), "application/json");
  document.getElementById("csv").onclick = () => {
    const rows = ["timestamp,hanzi,level,grade,recalled,predicted_recall,standard_model_recall"];
    for (const [time, hanzi, grade, predicted, base] of state.log) {
      rows.push(`${new Date(time).toISOString()},${hanzi},${BY_HANZI.get(hanzi)?.level ?? ""},${grade},${grade > 1 ? 1 : 0},${predicted},${base ?? predicted}`);
    }
    download(`nadaku-study-${dateKey(Date.now())}.csv`, rows.join("\n"), "text/csv");
  };
  document.getElementById("csvTones").onclick = () => download(`nadaku-tones-${dateKey(Date.now())}.csv`, toneLogCsv(state.toneLog), "text/csv");
  document.getElementById("import").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    state = Object.assign(defaultState(), JSON.parse(await file.text()));
    saveState();
    route();
  };
  document.getElementById("reset").onclick = () => {
    if (confirm(t("resetConfirm"))) {
      state = defaultState();
      saveState();
      location.hash = "home";
      route();
    }
  };
}

// ---------- Demo data (screenshots / showcase) ----------
function seedDemo() {
  const now = Date.now();
  state = defaultState();
  state.onboarded = true;
  const rng = seededRng(7);
  wordsAtLevel(1).slice(0, 120).forEach((w, i) => {
    let card = null;
    let time = now - 40 * DAY + i * 3 * 60 * MINUTE;
    for (let k = 0; k < 3 + (i % 4); k += 1) {
      const grade = rng() < 0.12 ? 1 : rng() < 0.2 ? 2 : rng() < 0.9 ? 3 : 4;
      if (card) {
        state.log.push([time, w.hanzi, grade, Math.round(retention(card, time) * 1000) / 1000]);
      }
      card = schedule(card, grade, time);
      time = Math.min(now - 2 * MINUTE, card.due + rng() * 2 * DAY);
    }
    state.cards[w.hanzi] = card;
  });
  [18, 34, 25, 12, 41, 30, 22].forEach((xp, idx) => {
    state.days[dateKey(now - (6 - idx) * DAY)] = xp;
  });
  state.xp = 2480;
  state.tones = { 1: [18, 20], 2: [15, 19], 3: [9, 17], 4: [19, 21] };
  state.mirror = { 1: [7, 8], 2: [5, 7], 3: [3, 7], 4: [8, 9] };
  state.talkBest = { intro: 100, food: 67 };
  state.examBest = { 1: 9 };
}

// ---------- Boot ----------
const params = new URLSearchParams(location.search);
if (params.has("test")) {
  const script = document.createElement("script");
  script.src = "tests.js";
  document.body.appendChild(script);
} else {
  if (params.has("demo")) {
    seedDemo();
  }
  applyTheme();
  window.addEventListener("hashchange", route);
  route();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js");
  }
}
