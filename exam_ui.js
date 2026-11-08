/* Nadaku HSK mock exam: full papers in the current HSK (2.0) paper format, levels 1-6.
   Data: exam.js (EXAM_PAPERS) + pictures.js (PICTURES), loaded on first use.
   Loaded before app.js; everything here runs only after app.js has defined its globals. */
"use strict";

const EXAM_PROGRESS_KEY = "nadaku.exam.progress";
const EXAM_LETTERS = "ABCDEF";
const EXAM_SUBJECTIVE = new Set(["sentence_write", "essay", "summary"]);
const EXAM_LISTEN_KINDS = new Set(["pic_tf", "pic_choose", "pic_match", "mc", "mc_group", "tf_statement"]);

const EXAM_TEXT = {
  id: {
    title: "Ujian HSK", lead: "Simulasi ujian lengkap dengan format kertas HSK yang berlaku sekarang: bagian, jumlah soal, waktu dan nilai.",
    paper: "Paket A", sections: "Bagian", items: "soal", min: "menit", total: "Total", passLine: "Batas lulus",
    L: "Mendengar", R: "Membaca", W: "Menulis",
    startFull: "Mulai simulasi penuh", startFullSub: "Berwaktu, audio diputar sesuai aturan, nilai di akhir",
    practice: "Latihan per bagian", practiceSub: "Tanpa batas waktu, langsung lihat jawaban dan penjelasan",
    resume: "Lanjutkan ujian", discard: "Buang", quick: "Kuis kosakata cepat (10 soal)",
    history: "Riwayat", noHistory: "Belum ada simulasi. Nilai, bagian lemah dan pembahasan akan muncul di sini.",
    note: "Soal latihan orisinal yang mengikuti format resmi HSK 2.0, bukan soal ujian asli. Kosakata dibatasi pada daftar HSK Nadaku sampai level ini. Audio memakai suara Mandarin di perangkatmu; tanpa suara itu, rekaman kata penutur asli dirangkai.",
    loading: "Memuat soal…", part: "Bagian", question: "Soal", of: "dari", next: "Lanjut", prev: "Sebelumnya",
    flag: "Tandai", flagged: "Ditandai", sheet: "Lembar jawaban", finishSection: "Selesaikan bagian", finishExam: "Selesaikan ujian",
    unanswered: "soal belum dijawab. Tetap selesaikan bagian ini?", confirm: "Ya, selesaikan", cancel: "Kembali ke soal",
    timeUp: "Waktu habis, bagian ini otomatis dikumpulkan.", nextSection: "Berikutnya", begin: "Mulai",
    sectionDone: "Bagian selesai", playing: "Audio diputar", played: "Selesai diputar", playN: "Putaran",
    replay: "Putar lagi", listenOnly: "Dengarkan audio, lalu jawab. Di simulasi, audio tidak bisa diputar ulang.",
    noBack: "Bagian mendengar berjalan maju seperti ujian sebenarnya.",
    trueLbl: "Benar", falseLbl: "Salah", yourAnswer: "Jawabanmu", correctAnswer: "Kunci", none: "kosong",
    result: "Hasil", pass: "Lulus", fail: "Belum lulus", perSection: "Nilai per bagian", perPart: "Per bagian soal",
    review: "Pembahasan", onlyWrong: "Hanya yang salah", showMore: "Tampilkan 10 lagi", tapOpen: "Ketuk soal untuk melihat pembahasan.", addWords: "Tambahkan kosakata dari soal yang salah ke review",
    wordsAdded: "kata ditambahkan ke review", retry: "Ulangi simulasi", backExam: "Kembali ke Ujian",
    estimated: "Nilai menulis adalah perkiraan otomatis (panjang teks dan kata wajib). Bandingkan dengan contoh jawaban.",
    sample: "Contoh jawaban", chars: "karakter", target: "target", reading: "Waktu membaca", writing: "Waktu menulis",
    startWriting: "Mulai menulis", storyHidden: "Cerita disembunyikan. Tulis ringkasanmu.", useWord: "Gunakan kata",
    useWords: "Gunakan semua kata ini", typeHere: "Ketik dengan keyboard pinyin…", tapTiles: "Ketuk kata sesuai urutan",
    tapOrder: "Ketuk A, B, C sesuai urutan", clear: "Hapus", correctNow: "Benar", wrongNow: "Belum tepat",
    transcript: "Transkrip", translation: "Terjemahan", why: "Penjelasan", practiceMode: "Latihan", simMode: "Simulasi", check: "Cek jawaban",
    elapsed: "Waktu", score: "Nilai", passedAt: "Lulus pada", exitConfirm: "Keluar? Progres disimpan dan bisa dilanjutkan.",
    exit: "Keluar", sectionScore: "Nilai bagian", choose: "Pilih bagian latihan", picture: "Gambar",
  },
  en: {
    title: "HSK Exam", lead: "A full mock exam in the current HSK paper format: same sections, item counts, timing and scoring.",
    paper: "Paper A", sections: "Sections", items: "items", min: "min", total: "Total", passLine: "Pass mark",
    L: "Listening", R: "Reading", W: "Writing",
    startFull: "Start full mock exam", startFullSub: "Timed, audio plays by the exam rules, score at the end",
    practice: "Practise one section", practiceSub: "No time limit, see the answer and explanation right away",
    resume: "Resume exam", discard: "Discard", quick: "Quick vocabulary quiz (10 questions)",
    history: "History", noHistory: "No mock exams yet. Scores, weak parts and explanations will appear here.",
    note: "Original practice items that follow the official HSK 2.0 format, not real exam papers. Vocabulary stays within Nadaku's HSK lists up to this level. Audio uses your device's Mandarin voice; without one, native word recordings are chained.",
    loading: "Loading the paper…", part: "Part", question: "Question", of: "of", next: "Next", prev: "Previous",
    flag: "Flag", flagged: "Flagged", sheet: "Answer sheet", finishSection: "Finish section", finishExam: "Finish exam",
    unanswered: "questions unanswered. Finish this section anyway?", confirm: "Yes, finish", cancel: "Back to questions",
    timeUp: "Time is up; this section was handed in.", nextSection: "Next", begin: "Begin",
    sectionDone: "Section complete", playing: "Audio playing", played: "Finished playing", playN: "Play",
    replay: "Play again", listenOnly: "Listen, then answer. In the mock exam the audio cannot be replayed.",
    noBack: "The listening section only moves forward, like the real exam.",
    trueLbl: "True", falseLbl: "False", yourAnswer: "Your answer", correctAnswer: "Key", none: "blank",
    result: "Result", pass: "Pass", fail: "Not yet", perSection: "Score per section", perPart: "By part",
    review: "Review", onlyWrong: "Only wrong answers", showMore: "Show 10 more", tapOpen: "Tap a question to see the explanation.", addWords: "Add words from missed questions to review",
    wordsAdded: "words added to review", retry: "Retake mock exam", backExam: "Back to Exam",
    estimated: "The writing score is an automatic estimate (length and required words). Compare with the model answer.",
    sample: "Model answer", chars: "characters", target: "target", reading: "Reading time", writing: "Writing time",
    startWriting: "Start writing", storyHidden: "The story is hidden now. Write your summary.", useWord: "Use the word",
    useWords: "Use all of these words", typeHere: "Type with a pinyin keyboard…", tapTiles: "Tap the words in order",
    tapOrder: "Tap A, B, C in order", clear: "Clear", correctNow: "Correct", wrongNow: "Not quite",
    transcript: "Transcript", translation: "Translation", why: "Explanation", practiceMode: "Practice", simMode: "Mock exam", check: "Check answer",
    elapsed: "Time", score: "Score", passedAt: "Pass mark", exitConfirm: "Leave? Your progress is saved and can be resumed.",
    exit: "Leave", sectionScore: "Section score", choose: "Choose a section to practise", picture: "Picture",
  },
};

const PART_ZH = ["", "第一部分", "第二部分", "第三部分", "第四部分"];

function et(key) {
  return EXAM_TEXT[state.lang][key] ?? EXAM_TEXT.en[key] ?? key;
}

// ---------- data loading ----------
let examLoading = null;

function loadScriptOnce(src, globalName) {
  if (typeof window[globalName] !== "undefined" || (globalName === "EXAM_PAPERS" && typeof EXAM_PAPERS !== "undefined") || (globalName === "PICTURES" && typeof PICTURES !== "undefined")) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`could not load ${src}`));
    document.head.appendChild(script);
  });
}

function loadExamData() {
  if (!examLoading) {
    examLoading = Promise.all([loadScriptOnce("pictures.js", "PICTURES"), loadScriptOnce("exam.js", "EXAM_PAPERS")]);
  }
  return examLoading;
}

// ---------- paper model ----------
function flattenPaper(level) {
  const paper = EXAM_PAPERS[level];
  let n = 0;
  const sections = paper.sections.map((section) => {
    const questions = [];
    section.parts.forEach((part) => {
      part.blocks.forEach((block, b) => {
        const items = EXAM_SUBJECTIVE.has(block.kind) && !block.items ? [block] : block.items;
        items.forEach((item, i) => {
          n += 1;
          questions.push({
            key: `${section.id}${part.part}-${b}-${i}`, n, sec: section.id, part: part.part, kind: block.kind,
            ins: part.ins, block, item, index: i, first: i === 0,
          });
        });
      });
    });
    return { id: section.id, minutes: section.minutes, questions };
  });
  return { level, total: paper.total, pass: paper.pass, plays: paper.plays, sections };
}

function examKey(q) {
  return q.item.ans;
}

function normalizeZh(text) {
  return String(text || "").replace(/[。！？，、\s.!?,]/g, "");
}

function charCount(text) {
  return [...String(text || "").replace(/\s/g, "")].length;
}

function lengthFactor(length, target) {
  if (length >= target * 0.8) {
    return 1;
  }
  if (length >= target * 0.5) {
    return 0.6;
  }
  return length > 0 ? 0.3 : 0;
}

// Returns a score 0..1 for one question.
function scoreExamQuestion(q, response) {
  if (response === undefined || response === null || response === "") {
    return 0;
  }
  const key = examKey(q);
  switch (q.kind) {
    case "arrange":
      return key.map(normalizeZh).includes(normalizeZh(response)) ? 1 : 0;
    case "char_write":
      return String(response).trim() === key ? 1 : 0;
    case "order":
      return String(response).toUpperCase() === String(key).toUpperCase() ? 1 : 0;
    case "sentence_write": {
      const text = String(response);
      if (!text.includes(q.item.word)) {
        return 0;
      }
      return charCount(text) >= 6 && /[。！？]$/.test(text.trim()) ? 1 : 0.5;
    }
    case "essay": {
      const text = String(response);
      const lengthPart = lengthFactor(charCount(text), 80);
      if (q.item.words) {
        const used = q.item.words.filter((w) => text.includes(w)).length / q.item.words.length;
        return Math.round(lengthPart * (0.4 + 0.6 * used) * 100) / 100;
      }
      return lengthPart;
    }
    case "summary": {
      const text = String(response);
      const length = charCount(text);
      const lengthPart = length > 520 ? 0.7 : lengthFactor(length, 400);
      const sampleBigrams = new Set();
      const sample = normalizeZh(q.item.sample);
      for (let i = 0; i < sample.length - 1; i += 1) {
        sampleBigrams.add(sample.slice(i, i + 2));
      }
      const mine = normalizeZh(text);
      let hits = 0;
      const seen = new Set();
      for (let i = 0; i < mine.length - 1; i += 1) {
        const bigram = mine.slice(i, i + 2);
        if (sampleBigrams.has(bigram) && !seen.has(bigram)) {
          seen.add(bigram);
          hits += 1;
        }
      }
      const coverage = Math.min(1, hits / Math.max(1, sampleBigrams.size * 0.3));
      return Math.round(lengthPart * (0.3 + 0.7 * coverage) * 100) / 100;
    }
    default:
      return response === key ? 1 : 0;
  }
}

function questionWeight(q) {
  return q.kind === "essay" ? 3 : 1;
}

function sectionScore(section, responses) {
  let earned = 0;
  let possible = 0;
  for (const q of section.questions) {
    const w = questionWeight(q);
    earned += w * scoreExamQuestion(q, responses[q.key]);
    possible += w;
  }
  return Math.round((100 * earned) / Math.max(1, possible));
}

function examTotals(paper, responses) {
  const bySection = {};
  let total = 0;
  for (const section of paper.sections) {
    bySection[section.id] = sectionScore(section, responses);
    total += bySection[section.id];
  }
  return { bySection, total, passed: total >= paper.pass };
}

function partBreakdown(paper, responses) {
  const rows = [];
  for (const section of paper.sections) {
    const parts = new Map();
    for (const q of section.questions) {
      const row = parts.get(q.part) || { sec: section.id, part: q.part, kind: q.kind, right: 0, count: 0 };
      row.count += 1;
      row.right += scoreExamQuestion(q, responses[q.key]) >= 1 ? 1 : 0;
      parts.set(q.part, row);
    }
    rows.push(...parts.values());
  }
  return rows;
}

// ---------- progress persistence ----------
function loadExamProgress() {
  try {
    return JSON.parse(localStorage.getItem(EXAM_PROGRESS_KEY) || "null");
  } catch (err) {
    return null;
  }
}

function saveExamProgress(progress) {
  try {
    if (progress) {
      localStorage.setItem(EXAM_PROGRESS_KEY, JSON.stringify(progress));
    } else {
      localStorage.removeItem(EXAM_PROGRESS_KEY);
    }
  } catch (err) {
    /* storage full or blocked: the exam still runs in memory */
  }
}

// ---------- audio ----------
let examPlayToken = 0;

function examVoices() {
  const voices = "speechSynthesis" in window ? speechSynthesis.getVoices().filter((v) => /^zh/i.test(v.lang)) : [];
  const mainland = voices.filter((v) => /zh[-_]CN/i.test(v.lang));
  const pool = mainland.length ? mainland : voices;
  const female = pool.find((v) => /female|xiaoxiao|xiaoyi|huihui|yaoyao|ting|mei|xiaohan|xiaomo/i.test(v.name)) || pool[0];
  const male = pool.find((v) => /yunxi|yunyang|yunjian|kangkang|male|li-mu|yu-shu/i.test(v.name) && !/female/i.test(v.name)) || null;
  return { any: pool.length > 0, female, male };
}

function splitSpeaker(line) {
  const match = /^\s*([男女问])\s*[：:]\s*/.exec(line);
  return match ? { who: match[1], text: line.slice(match[0].length) } : { who: "", text: line };
}

function wordClipsFor(text) {
  const clips = [];
  const chars = [...text.replace(/[^\u4e00-\u9fff]/g, "")];
  let i = 0;
  while (i < chars.length) {
    let found = null;
    for (let len = Math.min(4, chars.length - i); len >= 1; len -= 1) {
      const candidate = BY_HANZI.get(chars.slice(i, i + len).join(""));
      if (candidate && candidate.audio) {
        found = candidate;
        break;
      }
    }
    if (found) {
      clips.push(...audioClips(found.audio, found.hanzi));
      i += [...found.hanzi].length;
    } else {
      i += 1;
    }
  }
  return clips;
}

function playClipList(clips, token, onDone) {
  let index = 0;
  const next = () => {
    if (token !== examPlayToken) {
      return;
    }
    if (index >= clips.length) {
      onDone();
      return;
    }
    const clip = clips[index];
    index += 1;
    const audio = new Audio(clip.src);
    audio.volume = clip.light ? 0.55 : 1;
    audio.onended = next;
    audio.onerror = next;
    currentAudio.push(audio);
    const promise = audio.play();
    if (promise && promise.catch) {
      promise.catch(() => setTimeout(next, 50));
    }
  };
  next();
}

// Speaks lines like "男：……" with different voices; calls onDone when finished (unless cancelled).
function speakExamLines(lines, level, token, onDone) {
  const voices = examVoices();
  const rate = level <= 2 ? 0.82 : level <= 4 ? 0.9 : 0.98;
  let index = 0;
  const next = () => {
    if (token !== examPlayToken) {
      return;
    }
    if (index >= lines.length) {
      onDone();
      return;
    }
    const { who, text } = splitSpeaker(lines[index]);
    index += 1;
    if (!voices.any) {
      playClipList(wordClipsFor(text), token, () => setTimeout(next, 350));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = rate;
    if (who === "男") {
      utterance.voice = voices.male || voices.female;
      utterance.pitch = voices.male ? 1 : 0.72;
    } else {
      utterance.voice = voices.female;
      utterance.pitch = who === "问" ? 0.95 : 1.05;
    }
    utterance.onend = () => setTimeout(next, 450);
    utterance.onerror = () => setTimeout(next, 100);
    speechSynthesis.speak(utterance);
  };
  next();
}

function listeningScript(q) {
  const src = q.kind === "mc_group" ? q.block : q.item;
  let lines = [];
  if (q.kind === "mc_group") {
    lines = q.first ? [...(Array.isArray(src.audio) ? src.audio : [src.audio])] : [];
    lines.push(`问：${q.item.q}`);
    return lines;
  }
  if (q.kind === "pic_match" || q.kind === "pic_tf" || q.kind === "pic_choose") {
    return Array.isArray(q.item.zh) ? q.item.zh : [q.item.zh];
  }
  lines = Array.isArray(src.audio) ? [...src.audio] : [src.audio];
  if (q.item.q && q.kind === "mc") {
    lines.push(`问：${q.item.q}`);
  }
  return lines;
}

function isListening(q) {
  return q.sec === "L" && EXAM_LISTEN_KINDS.has(q.kind);
}

// ---------- shared rendering helpers ----------
function pictureSvg(id, size = 72) {
  const picture = typeof PICTURES !== "undefined" ? PICTURES[id] : null;
  if (!picture) {
    return "";
  }
  return `<svg class="pic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${et("picture")}">${picture.svg}</svg>`;
}

function zhLines(value) {
  const lines = Array.isArray(value) ? value : [value];
  return lines.map((line) => `<p class="ex-line" lang="zh-CN">${esc(line)}</p>`).join("");
}

function withPinyin(text, py, level) {
  if (level <= 2 && py) {
    return `<span class="ex-py">${esc(py)}</span><span lang="zh-CN">${esc(text)}</span>`;
  }
  return `<span lang="zh-CN">${esc(text)}</span>`;
}

function examTranslation(obj) {
  const primary = state.lang === "id" ? obj.id : obj.en;
  return primary ? esc(primary) : "";
}

function formatClock(seconds) {
  const s = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function sectionName(id) {
  return et(id);
}

// ---------- exam home ----------
function renderExamScreen(arg) {
  if (arg === "quick") {
    renderQuickQuiz();
    return;
  }
  view.innerHTML = `<h1>${et("title")}</h1><p class="muted">${et("loading")}</p>`;
  loadExamData()
    .then(() => {
      if (!location.hash.startsWith("#exam")) {
        return;
      }
      if (arg === "go") {
        runExamSession();
      } else if (arg === "result") {
        renderExamResult();
      } else {
        renderExamHome();
      }
    })
    .catch(() => {
      view.innerHTML = `<h1>${et("title")}</h1><div class="card"><p>${esc(t("noAudio"))}</p></div>`;
    });
}

function renderExamHome() {
  const level = state.examLevel || state.level;
  const paper = flattenPaper(level);
  const progress = loadExamProgress();
  const totalItems = paper.sections.reduce((sum, s) => sum + s.questions.length, 0);
  const totalMinutes = paper.sections.reduce((sum, s) => sum + s.minutes, 0);
  const attempts = (state.examAttempts || []).filter((a) => a.level === level && a.mode === "full").slice(-5).reverse();
  view.innerHTML = `
    <h1>${et("title")}</h1>
    <p class="muted lead">${et("lead")}</p>
    <div class="seg" role="radiogroup" aria-label="HSK">
      ${LEVELS.map((lv) => `<button class="seg-btn ${lv === level ? "on" : ""}" role="radio" aria-checked="${lv === level}" data-level="${lv}">HSK ${lv}</button>`).join("")}
    </div>
    ${progress ? `
      <div class="card resume-card">
        <div><b>${et("resume")}: HSK ${progress.level}</b>
          <div class="muted small">${progress.mode === "full" ? et("simMode") : et("practiceMode")} · ${sectionName(progress.sections[progress.sectionIndex])} · ${et("question")} ${progress.qIndex + 1}</div></div>
        <div class="row"><button class="btn ghost small" id="discard">${et("discard")}</button><a class="btn small" href="#exam/go">${et("resume")}</a></div>
      </div>` : ""}
    <section class="card paper-card" aria-label="HSK ${level} ${et("paper")}">
      <div class="paper-head"><h2>HSK ${level} <span class="muted">· ${et("paper")}</span></h2>
        <span class="pill">${totalItems} ${et("items")} · ${totalMinutes} ${et("min")}</span></div>
      <table class="paper-table">
        <thead><tr><th>${et("sections")}</th><th class="num">${et("items")}</th><th class="num">${et("min")}</th><th class="num">${et("score")}</th></tr></thead>
        <tbody>${paper.sections.map((s) => `<tr><td>${sectionName(s.id)}</td><td class="num">${s.questions.length}</td><td class="num">${s.minutes}</td><td class="num">100</td></tr>`).join("")}</tbody>
        <tfoot><tr><td>${et("total")}</td><td class="num">${totalItems}</td><td class="num">${totalMinutes}</td><td class="num">${paper.total}</td></tr></tfoot>
      </table>
      <p class="small muted">${et("passLine")}: <b>${paper.pass}</b> / ${paper.total}</p>
      <button class="btn block" id="start-full">${icon("exam", 18)} ${et("startFull")}</button>
      <p class="small muted center tight">${et("startFullSub")}</p>
      <div class="practice-row" role="group" aria-label="${et("choose")}">
        <span class="small muted">${et("practice")}:</span>
        ${paper.sections.map((s) => `<button class="btn ghost small" data-practice="${s.id}">${sectionName(s.id)}</button>`).join("")}
      </div>
      <p class="small muted center tight">${et("practiceSub")}</p>
    </section>
    <section class="card">
      <h2 class="h3">${et("history")}</h2>
      ${attempts.length ? `<ul class="history">${attempts.map((a) => `
        <li><span>${new Date(a.date).toLocaleDateString(state.lang === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "short" })}</span>
          <span class="hist-bar"><span style="width:${Math.round((a.total / paper.total) * 100)}%" class="${a.passed ? "ok" : ""}"></span></span>
          <b>${a.total}</b><span class="pill tiny ${a.passed ? "green" : ""}">${a.passed ? et("pass") : et("fail")}</span></li>`).join("")}</ul>`
        : `<p class="muted small">${et("noHistory")}</p>`}
    </section>
    <p class="small muted note">${et("note")}</p>
    <a class="btn ghost block" href="#exam/quick">${icon("review", 18)} ${et("quick")}</a>`;
  bind(".seg-btn", (el) => {
    state.examLevel = Number(el.dataset.level);
    saveState();
    renderExamHome();
  });
  const discard = document.getElementById("discard");
  if (discard) {
    discard.onclick = () => {
      saveExamProgress(null);
      renderExamHome();
    };
  }
  document.getElementById("start-full").onclick = () => startExam(level, "full", paper.sections.map((s) => s.id));
  bind("[data-practice]", (el) => startExam(level, "practice", [el.dataset.practice]));
}

function startExam(level, mode, sectionIds) {
  saveExamProgress({
    level, mode, sections: sectionIds, sectionIndex: 0, qIndex: 0, responses: {}, flags: [],
    started: Date.now(), sectionStarted: null, spent: {}, played: {}, intro: true,
  });
  if (location.hash === "#exam/go") {
    runExamSession();
  } else {
    location.hash = "#exam/go";
  }
}

// ---------- exam session ----------
let examTimer = null;

function runExamSession() {
  const progress = loadExamProgress();
  if (!progress) {
    renderExamHome();
    return;
  }
  const paper = flattenPaper(progress.level);
  const sectionsById = Object.fromEntries(paper.sections.map((s) => [s.id, s]));
  const practice = progress.mode === "practice";
  let feedbackShown = false;

  const section = () => sectionsById[progress.sections[progress.sectionIndex]];
  const question = () => section().questions[progress.qIndex];
  const save = () => saveExamProgress(progress);

  function clearTimer() {
    if (examTimer) {
      clearInterval(examTimer);
      examTimer = null;
    }
  }

  function remainingSeconds() {
    const sec = section();
    const spent = (progress.spent[sec.id] || 0) + (progress.sectionStarted ? (Date.now() - progress.sectionStarted) / 1000 : 0);
    return sec.minutes * 60 - spent;
  }

  function pauseClock() {
    const sec = section();
    if (progress.sectionStarted) {
      progress.spent[sec.id] = (progress.spent[sec.id] || 0) + (Date.now() - progress.sectionStarted) / 1000;
      progress.sectionStarted = null;
    }
  }

  function tick() {
    const clock = document.getElementById("ex-clock");
    if (!clock || !location.hash.startsWith("#exam/go")) {
      clearTimer();
      return;
    }
    if (practice) {
      const spent = (progress.spent[section().id] || 0) + (progress.sectionStarted ? (Date.now() - progress.sectionStarted) / 1000 : 0);
      clock.textContent = formatClock(spent);
      return;
    }
    const left = remainingSeconds();
    clock.textContent = formatClock(left);
    clock.classList.toggle("low", left < 300);
    if (left <= 0) {
      clearTimer();
      toast(et("timeUp"));
      finishSection();
    }
  }

  function sectionIntro() {
    clearTimer();
    stopAudio();
    document.body.classList.add("exam-focus");
    const sec = section();
    view.innerHTML = `
      <div class="ex-intro card">
        <p class="eyebrow">HSK ${progress.level} · ${practice ? et("practiceMode") : et("simMode")}</p>
        <h1>${sectionName(sec.id)}</h1>
        <p class="ex-intro-meta">${sec.questions.length} ${et("items")} · ${practice ? "" : `${sec.minutes} ${et("min")}`}</p>
        <ol class="ex-parts">${[...new Set(sec.questions.map((q) => q.part))].map((p) => {
          const q = sec.questions.find((x) => x.part === p);
          const nums = sec.questions.filter((x) => x.part === p).map((x) => x.n);
          return `<li><b lang="zh-CN">${PART_ZH[p]}</b> <span class="muted">${nums[0]}–${nums[nums.length - 1]}</span><br><span class="small">${esc(q.ins[state.lang === "id" ? 0 : 1])}</span></li>`;
        }).join("")}</ol>
        ${sec.id === "L" && !practice ? `<p class="small muted">${et("noBack")} ${progress.level <= 3 ? (state.lang === "id" ? "Setiap audio diputar dua kali." : "Each recording is played twice.") : (state.lang === "id" ? "Setiap audio diputar sekali." : "Each recording is played once.")}</p>` : ""}
        <button class="btn block" id="begin">${et("begin")}</button>
      </div>`;
    document.getElementById("begin").onclick = () => {
      progress.intro = false;
      progress.sectionStarted = Date.now();
      save();
      showQuestion();
    };
    keyHandler = (e) => {
      if (e.key === "Enter") {
        document.getElementById("begin").click();
      }
    };
  }

  function answered(q) {
    const r = progress.responses[q.key];
    return r !== undefined && r !== null && r !== "";
  }

  function setResponse(q, value) {
    progress.responses[q.key] = value;
    save();
  }

  function headerHtml(q) {
    const sec = section();
    const pos = progress.qIndex + 1;
    return `
      <div class="ex-bar">
        <div class="ex-bar-left"><b>HSK ${progress.level} · ${sectionName(sec.id)}</b><span class="muted small" lang="zh-CN">${PART_ZH[q.part]}</span></div>
        <div class="ex-bar-mid small">${et("question")} <b>${q.n}</b> <span class="muted">(${pos}/${sec.questions.length})</span></div>
        <div class="ex-bar-right">
          <span class="ex-clock ${practice ? "practice" : ""}" id="ex-clock" aria-label="${practice ? et("elapsed") : et("min")}">--:--</span>
          <button class="icon-btn" id="ex-sheet" aria-label="${et("sheet")}">${icon("chart", 18)}</button>
          <button class="icon-btn" id="ex-exit" aria-label="${et("exit")}">${icon("close", 18)}</button>
        </div>
      </div>
      <div class="progress thin" role="progressbar" aria-valuemin="0" aria-valuemax="${sec.questions.length}" aria-valuenow="${pos}"><div style="width:${(pos / sec.questions.length) * 100}%"></div></div>
      ${q.first || progress.qIndex === 0 || sec.questions[progress.qIndex - 1].part !== q.part ? `<p class="ex-ins">${esc(q.ins[state.lang === "id" ? 0 : 1])}</p>` : ""}`;
  }

  function choiceButtons(q, labels, opts = {}) {
    const current = progress.responses[q.key];
    return `<div class="ex-choices ${opts.grid ? "grid" : ""} ${opts.compact ? "compact" : ""}" role="radiogroup" aria-label="${et("question")} ${q.n}">
      ${labels.map((label, i) => {
        const value = opts.values ? opts.values[i] : i;
        const selected = current === value;
        return `<button class="ex-choice ${selected ? "on" : ""}" role="radio" aria-checked="${selected}" data-v="${i}">
          ${opts.noLetter ? "" : `<span class="ex-letter" aria-hidden="true">${opts.letters ? opts.letters[i] : EXAM_LETTERS[i]}</span>`}<span class="ex-choice-body">${label}</span></button>`;
      }).join("")}
    </div>`;
  }

  function tfButtons(q) {
    return choiceButtons(q, [`${icon("check", 18)} ${et("trueLbl")}`, `${icon("close", 18)} ${et("falseLbl")}`],
      { values: [true, false], noLetter: true, grid: true });
  }

  function audioPanel(q) {
    return `<div class="ex-audio" id="ex-audio" aria-live="polite">
      <span class="ex-audio-ic">${icon("listen", 22)}</span>
      <span id="ex-audio-state" class="small">${et("playing")}</span>
      ${practice ? `<button class="btn ghost small" id="ex-replay">${icon("sound", 16)} ${et("replay")}</button>` : ""}
    </div>`;
  }

  function bodyHtml(q) {
    const level = progress.level;
    const it = q.item;
    const block = q.block;
    const listen = isListening(q);
    const showStimulus = !listen || feedbackShown;
    switch (q.kind) {
      case "pic_tf":
        return `<div class="ex-pic-solo">${pictureSvg(it.pic, 120)}</div>
          ${listen ? audioPanel(q) : `<p class="ex-word">${withPinyin(it.zh, it.py, level)}</p>`}
          ${tfButtons(q)}`;
      case "pic_choose":
        return `${audioPanel(q)}${choiceButtons(q, it.pics.map((p) => pictureSvg(p, 72)), { grid: true })}`;
      case "pic_match": {
        const pics = `<div class="ex-pic-grid">${block.pics.map((p, i) => `<figure><span class="ex-letter">${EXAM_LETTERS[i]}</span>${pictureSvg(p, 56)}</figure>`).join("")}</div>`;
        const stem = listen ? audioPanel(q) : `<p class="ex-stem">${withPinyin(it.zh, it.py, level)}</p>`;
        return `${pics}${stem}${choiceButtons(q, block.pics.map((_, i) => EXAM_LETTERS[i]), { grid: true, compact: true, noLetter: true })}`;
      }
      case "mc": {
        const stem = listen ? audioPanel(q) : `<div class="ex-passage">${zhLines(it.passage)}</div>`;
        const ask = !listen || practice || level <= 3 || feedbackShown ? (it.q ? `<p class="ex-q" lang="zh-CN">${esc(it.q)}</p>` : "") : "";
        return `${stem}${ask}${choiceButtons(q, it.opts.map((o) => `<span lang="zh-CN">${esc(o)}</span>`))}`;
      }
      case "mc_group": {
        const stem = listen ? audioPanel(q) : `<div class="ex-passage">${zhLines(block.passage)}</div>`;
        const ask = !listen || practice || feedbackShown ? `<p class="ex-q" lang="zh-CN">${esc(it.q)}</p>` : "";
        return `${stem}${ask}${choiceButtons(q, it.opts.map((o) => `<span lang="zh-CN">${esc(o)}</span>`))}`;
      }
      case "tf_statement": {
        const stem = listen ? audioPanel(q) : `<div class="ex-passage">${zhLines(it.passage)}</div>`;
        return `${stem}<p class="ex-stmt"><span aria-hidden="true">★</span> <span lang="zh-CN">${esc(it.stmt)}</span></p>${tfButtons(q)}`;
      }
      case "match_qa":
        return `<ol class="ex-bank" type="A">${block.opts.map((o, i) => `<li><span class="ex-letter">${EXAM_LETTERS[i]}</span> ${withPinyin(o, block.opts_py && block.opts_py[i], level)}</li>`).join("")}</ol>
          <p class="ex-stem">${withPinyin(it.zh, it.py, level)}</p>
          ${choiceButtons(q, block.opts.map((_, i) => EXAM_LETTERS[i]), { grid: true, compact: true, noLetter: true })}`;
      case "fill_bank":
        return `<div class="ex-chips">${block.bank.map((w, i) => `<span class="ex-chip"><span class="ex-letter">${EXAM_LETTERS[i]}</span> ${withPinyin(w, block.bank_py && block.bank_py[i], level)}</span>`).join("")}</div>
          <p class="ex-stem">${withPinyin(it.zh, it.py, level)}</p>
          ${choiceButtons(q, block.bank.map((_, i) => EXAM_LETTERS[i]), { grid: true, compact: true, noLetter: true })}`;
      case "cloze": {
        const marks = "①②③④⑤";
        return `<div class="ex-passage">${zhLines(block.passage)}</div>
          <p class="ex-q">${marks[q.index]}</p>${choiceButtons(q, it.opts.map((o) => `<span lang="zh-CN">${esc(o)}</span>`))}`;
      }
      case "cloze_multi":
      case "error_sentence":
        return `${it.passage ? `<div class="ex-passage">${zhLines(it.passage)}</div>` : ""}${choiceButtons(q, it.opts.map((o) => `<span lang="zh-CN">${esc(o)}</span>`))}`;
      case "sentence_insert":
        return `<div class="ex-passage">${zhLines(block.passage)}</div>
          <p class="ex-q">(${q.index + 1})</p>
          ${choiceButtons(q, block.sents.map((s) => `<span lang="zh-CN">${esc(s)}</span>`))}`;
      case "order": {
        const current = String(progress.responses[q.key] || "");
        return `<p class="small muted">${et("tapOrder")}</p>
          <div class="ex-order">${it.segs.map((s, i) => {
            const pos = current.indexOf(EXAM_LETTERS[i]);
            return `<button class="ex-seg ${pos >= 0 ? "used" : ""}" data-seg="${i}"><span class="ex-letter">${pos >= 0 ? pos + 1 : EXAM_LETTERS[i]}</span><span lang="zh-CN">${esc(s)}</span></button>`;
          }).join("")}</div>
          <div class="ex-built"><span>${current.split("").join(" → ") || "—"}</span><button class="btn ghost small" id="ex-clear">${et("clear")}</button></div>`;
      }
      case "arrange": {
        const current = progress.responses[q.key] ? JSON.parse(progress.responsesTiles?.[q.key] || "[]") : [];
        const used = new Set(current);
        return `<p class="small muted">${et("tapTiles")}</p>
          <div class="ex-built tall" lang="zh-CN">${current.map((i) => `<button class="ex-tile on" data-untile="${i}">${esc(it.tiles[i])}</button>`).join("") || `<span class="muted">—</span>`}</div>
          <div class="ex-tiles">${it.tiles.map((tile, i) => `<button class="ex-tile ${used.has(i) ? "used" : ""}" data-tile="${i}" ${used.has(i) ? "disabled" : ""} lang="zh-CN">${esc(tile)}</button>`).join("")}</div>`;
      }
      case "char_write":
        return `<p class="ex-stem" lang="zh-CN">${esc(it.zh).replace(/（\s*）|\(\s*\)/, `<span class="ex-blank"><span class="ex-py">${esc(it.py)}</span><input class="ex-char" id="ex-input" maxlength="2" autocomplete="off" aria-label="${esc(it.py)}" value="${esc(progress.responses[q.key] || "")}"></span>`)}</p>`;
      case "sentence_write":
        return `<div class="ex-pic-solo">${pictureSvg(it.pic, 110)}</div>
          <p class="ex-word">${et("useWord")}: <b lang="zh-CN">${esc(it.word)}</b></p>
          ${textAreaHtml(q, 2, 0)}`;
      case "essay":
        return `${it.words ? `<p class="small muted">${et("useWords")}</p><div class="ex-chips">${it.words.map((w) => `<span class="ex-chip" lang="zh-CN">${esc(w)}</span>`).join("")}</div>`
          : `<div class="ex-pic-solo">${pictureSvg(it.pic, 110)}</div><p class="small muted">${examTranslation({ id: it.topic_id, en: it.topic_en })}</p>`}
          ${textAreaHtml(q, 6, 80)}`;
      case "summary":
        return summaryHtml(q);
      default:
        return `<p>${esc(q.kind)}</p>`;
    }
  }

  function textAreaHtml(q, rows, target) {
    const value = progress.responses[q.key] || "";
    return `<textarea class="ex-text" id="ex-input" rows="${rows}" lang="zh-CN" placeholder="${et("typeHere")}">${esc(value)}</textarea>
      <p class="small muted right"><span id="ex-count">${charCount(value)}</span> ${et("chars")}${target ? ` · ${et("target")} ${target}` : ""}</p>`;
  }

  function summaryHtml(q) {
    const it = q.item;
    const phase = progress.summaryPhase || "read";
    if (phase === "read") {
      return `<div class="ex-readbar"><b>${et("reading")}</b> <span id="ex-read-clock">10:00</span>
          <button class="btn small" id="ex-start-writing">${et("startWriting")}</button></div>
        <h2 class="h3" lang="zh-CN">${esc(it.title || "")}</h2><div class="ex-passage long">${zhLines(it.story.split(/\n+/))}</div>`;
    }
    return `<p class="small muted">${et("storyHidden")}</p>${textAreaHtml(q, 14, 400)}`;
  }

  function feedbackHtml(q) {
    const score = scoreExamQuestion(q, progress.responses[q.key]);
    const it = q.item;
    const subjective = EXAM_SUBJECTIVE.has(q.kind);
    const key = keyLabel(q);
    const transcript = isListening(q) ? listeningScript(q).filter((l) => !l.startsWith("问：") || q.kind !== "mc_group") : null;
    const translation = examTranslation(q.kind === "mc_group" || q.kind === "cloze" || q.kind === "sentence_insert" ? q.block : it);
    const why = state.lang === "id" ? it.ex_id : it.ex_en;
    return `<div class="ex-feedback ${subjective ? "neutral" : score >= 1 ? "ok" : "bad"}" role="status">
      <b>${subjective ? et("sample") : score >= 1 ? et("correctNow") : et("wrongNow")}</b>
      ${!subjective ? `<span class="small">${et("correctAnswer")}: <b>${key}</b></span>` : ""}
      ${subjective ? `<p lang="zh-CN">${esc(it.samples ? it.samples.join(" / ") : it.sample)}</p>` : ""}
      ${transcript && transcript.length ? `<div class="small"><span class="muted">${et("transcript")}:</span>${zhLines(transcript)}</div>` : ""}
      ${translation ? `<p class="small"><span class="muted">${et("translation")}:</span> ${translation}</p>` : ""}
      ${why ? `<p class="small"><span class="muted">${et("why")}:</span> ${esc(why)}</p>` : ""}
    </div>`;
  }

  function footerHtml(q) {
    const sec = section();
    const last = progress.qIndex === sec.questions.length - 1;
    const lastSection = progress.sectionIndex === progress.sections.length - 1;
    const flagged = progress.flags.includes(q.key);
    const canBack = progress.qIndex > 0 && (practice || !isListening(q));
    return `<div class="ex-foot">
      <button class="btn ghost small" id="ex-prev" ${canBack ? "" : "disabled"}>${icon("back", 16)} ${et("prev")}</button>
      <button class="btn ghost small ${flagged ? "on" : ""}" id="ex-flag" aria-pressed="${flagged}">${flagged ? et("flagged") : et("flag")}</button>
      ${practice && !feedbackShown ? `<button class="btn small" id="ex-check" ${answered(q) ? "" : "disabled"}>${EXAM_SUBJECTIVE.has(q.kind) ? et("sample") : et("check")}</button>`
        : `<button class="btn small" id="ex-next">${last ? (lastSection ? et("finishExam") : et("finishSection")) : et("next")} ${icon("arrow", 16)}</button>`}
    </div>`;
  }

  function showQuestion() {
    if (progress.intro) {
      sectionIntro();
      return;
    }
    stopAudio();
    examPlayToken += 1;
    const q = question();
    document.body.classList.add("exam-focus");
    if (!progress.sectionStarted) {
      progress.sectionStarted = Date.now();
      save();
    }
    view.innerHTML = `<div class="exam-run">${headerHtml(q)}<div class="ex-body">${bodyHtml(q)}</div>
      ${feedbackShown ? feedbackHtml(q) : ""}${footerHtml(q)}</div>`;
    wireQuestion(q);
    clearTimer();
    examTimer = setInterval(tick, 1000);
    tick();
    if (isListening(q) && !feedbackShown) {
      startListening(q);
    }
    const focusTarget = document.getElementById("ex-input");
    if (focusTarget && !("ontouchstart" in window)) {
      focusTarget.focus();
    }
  }

  function startListening(q) {
    const plays = practice ? 1 : (progress.level <= 3 ? 2 : 1);
    const token = examPlayToken;
    const stateEl = () => document.getElementById("ex-audio-state");
    if (!practice && progress.played[q.key] >= plays) {
      if (stateEl()) {
        stateEl().textContent = et("played");
      }
      return;
    }
    let round = 0;
    const lines = listeningScript(q);
    const playRound = () => {
      if (token !== examPlayToken) {
        return;
      }
      round += 1;
      if (stateEl()) {
        stateEl().textContent = `${et("playing")} · ${et("playN")} ${round}/${plays}`;
      }
      speakExamLines(lines, progress.level, token, () => {
        progress.played[q.key] = round;
        save();
        if (round < plays) {
          setTimeout(playRound, 1800);
        } else if (stateEl()) {
          stateEl().textContent = et("played");
        }
      });
    };
    setTimeout(playRound, 500);
  }

  function wireQuestion(q) {
    bind(".ex-choice", (el) => {
      if (feedbackShown) {
        return;
      }
      const i = Number(el.dataset.v);
      const value = q.kind === "pic_tf" || q.kind === "tf_statement" ? i === 0 : i;
      setResponse(q, value);
      view.querySelectorAll(".ex-choice").forEach((b) => {
        const on = b === el;
        b.classList.toggle("on", on);
        b.setAttribute("aria-checked", String(on));
      });
      const check = document.getElementById("ex-check");
      if (check) {
        check.disabled = false;
      }
    });
    bind("[data-seg]", (el) => {
      const letter = EXAM_LETTERS[Number(el.dataset.seg)];
      let current = String(progress.responses[q.key] || "");
      current = current.includes(letter) ? current : current + letter;
      setResponse(q, current.slice(0, 3));
      showQuestion();
    });
    bind("[data-tile]", (el) => {
      progress.responsesTiles = progress.responsesTiles || {};
      const order = JSON.parse(progress.responsesTiles[q.key] || "[]");
      order.push(Number(el.dataset.tile));
      progress.responsesTiles[q.key] = JSON.stringify(order);
      setResponse(q, order.map((i) => q.item.tiles[i]).join(""));
      showQuestion();
    });
    bind("[data-untile]", (el) => {
      const order = JSON.parse(progress.responsesTiles[q.key] || "[]").filter((i) => i !== Number(el.dataset.untile));
      progress.responsesTiles[q.key] = JSON.stringify(order);
      setResponse(q, order.length ? order.map((i) => q.item.tiles[i]).join("") : "");
      showQuestion();
    });
    const clear = document.getElementById("ex-clear");
    if (clear) {
      clear.onclick = () => {
        setResponse(q, "");
        showQuestion();
      };
    }
    const input = document.getElementById("ex-input");
    if (input) {
      input.addEventListener("input", () => {
        setResponse(q, input.value);
        const count = document.getElementById("ex-count");
        if (count) {
          count.textContent = charCount(input.value);
        }
        const checkBtn = document.getElementById("ex-check");
        if (checkBtn) {
          checkBtn.disabled = !input.value.trim();
        }
      });
    }
    const startWriting = document.getElementById("ex-start-writing");
    if (startWriting) {
      const readUntil = progress.readUntil || (progress.readUntil = Date.now() + 10 * MINUTE);
      save();
      const readTick = setInterval(() => {
        const el = document.getElementById("ex-read-clock");
        if (!el) {
          clearInterval(readTick);
          return;
        }
        const left = (readUntil - Date.now()) / 1000;
        el.textContent = formatClock(left);
        if (left <= 0) {
          clearInterval(readTick);
          progress.summaryPhase = "write";
          save();
          showQuestion();
        }
      }, 1000);
      startWriting.onclick = () => {
        clearInterval(readTick);
        progress.summaryPhase = "write";
        save();
        showQuestion();
      };
    }
    const replay = document.getElementById("ex-replay");
    if (replay) {
      replay.onclick = () => {
        stopAudio();
        examPlayToken += 1;
        startListening(q);
      };
    }
    document.getElementById("ex-prev").onclick = () => {
      feedbackShown = false;
      progress.qIndex -= 1;
      save();
      showQuestion();
    };
    document.getElementById("ex-flag").onclick = () => {
      progress.flags = progress.flags.includes(q.key) ? progress.flags.filter((k) => k !== q.key) : [...progress.flags, q.key];
      save();
      const btn = document.getElementById("ex-flag");
      const on = progress.flags.includes(q.key);
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? et("flagged") : et("flag");
    };
    const check = document.getElementById("ex-check");
    if (check) {
      check.onclick = () => {
        feedbackShown = true;
        stopAudio();
        examPlayToken += 1;
        showQuestion();
        announce(scoreExamQuestion(q, progress.responses[q.key]) >= 1 ? et("correctNow") : et("wrongNow"));
      };
    }
    const next = document.getElementById("ex-next");
    if (next) {
      next.onclick = goNext;
    }
    document.getElementById("ex-sheet").onclick = openSheet;
    document.getElementById("ex-exit").onclick = () => {
      confirmDialog(et("exitConfirm"), () => {
        pauseClock();
        save();
        clearTimer();
        stopAudio();
        location.hash = "#exam";
      }, et("exit"));
    };
    keyHandler = (e) => {
      const choices = view.querySelectorAll(".ex-choice");
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) {
        choices[n - 1].click();
      } else if (/^[a-f]$/i.test(e.key) && choices.length && !q.kind.startsWith("pic_tf")) {
        const i = EXAM_LETTERS.indexOf(e.key.toUpperCase());
        if (choices[i]) {
          choices[i].click();
        }
      } else if (e.key === "Enter") {
        (document.getElementById("ex-check") || document.getElementById("ex-next")).click();
      }
    };
  }

  function goNext() {
    feedbackShown = false;
    const sec = section();
    if (progress.qIndex < sec.questions.length - 1) {
      progress.qIndex += 1;
      save();
      showQuestion();
      return;
    }
    const open = sec.questions.filter((q) => !answered(q)).length;
    if (open && !practice) {
      confirmDialog(`${open} ${et("unanswered")}`, finishSection);
      return;
    }
    finishSection();
  }

  function confirmDialog(message, onYes, yesLabel = et("confirm")) {
    const dialog = document.createElement("div");
    dialog.className = "ex-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.innerHTML = `<div class="card"><p>${esc(message)}</p><div class="row end">
      <button class="btn ghost small" data-no>${et("cancel")}</button><button class="btn small" data-yes>${yesLabel}</button></div></div>`;
    document.body.appendChild(dialog);
    dialog.querySelector("[data-yes]").focus();
    dialog.querySelector("[data-no]").onclick = () => dialog.remove();
    dialog.querySelector("[data-yes]").onclick = () => {
      dialog.remove();
      onYes();
    };
  }

  function openSheet() {
    const sec = section();
    const listeningLocked = !practice && sec.id === "L";
    const dialog = document.createElement("div");
    dialog.className = "ex-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", et("sheet"));
    dialog.innerHTML = `<div class="card sheet"><div class="row between"><h2 class="h3">${et("sheet")} · ${sectionName(sec.id)}</h2>
      <button class="icon-btn" data-close aria-label="${et("cancel")}">${icon("close", 18)}</button></div>
      <div class="sheet-grid">${sec.questions.map((q, i) => `<button class="sheet-cell ${answered(q) ? "done" : ""} ${progress.flags.includes(q.key) ? "flag" : ""} ${i === progress.qIndex ? "here" : ""}" data-go="${i}" ${listeningLocked ? "disabled" : ""}>${q.n}</button>`).join("")}</div>
      <p class="small muted">${sec.questions.filter(answered).length}/${sec.questions.length} · ${listeningLocked ? et("noBack") : ""}</p></div>`;
    document.body.appendChild(dialog);
    const close = () => dialog.remove();
    dialog.querySelector("[data-close]").onclick = close;
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        close();
      }
    });
    dialog.querySelectorAll("[data-go]").forEach((el) => {
      el.onclick = () => {
        progress.qIndex = Number(el.dataset.go);
        feedbackShown = false;
        save();
        close();
        showQuestion();
      };
    });
  }

  function finishSection() {
    clearTimer();
    stopAudio();
    examPlayToken += 1;
    pauseClock();
    if (progress.sectionIndex < progress.sections.length - 1) {
      progress.sectionIndex += 1;
      progress.qIndex = 0;
      progress.intro = true;
      save();
      sectionIntro();
      return;
    }
    const totals = examTotals({ ...paper, sections: progress.sections.map((id) => sectionsById[id]) }, progress.responses);
    const attempt = {
      level: progress.level, mode: progress.mode, sections: progress.sections, date: Date.now(),
      scores: totals.bySection, total: totals.total, passed: progress.mode === "full" && totals.passed,
      seconds: Math.round(Object.values(progress.spent).reduce((a, b) => a + b, 0)),
      responses: progress.responses,
    };
    state.examAttempts = [...(state.examAttempts || []), attempt].slice(-20);
    state.examBest[progress.level] = Math.max(state.examBest[progress.level] || 0, progress.mode === "full" ? totals.total : 0);
    addXP(Math.round(totals.total / 10));
    saveState();
    saveExamProgress(null);
    location.hash = "#exam/result";
  }

  showQuestion();
}

function keyLabel(q) {
  const key = examKey(q);
  if (q.kind === "pic_tf" || q.kind === "tf_statement") {
    return key ? et("trueLbl") : et("falseLbl");
  }
  if (q.kind === "arrange") {
    return `<span lang="zh-CN">${esc(key[0])}</span>`;
  }
  if (q.kind === "char_write" || q.kind === "order") {
    return `<span lang="zh-CN">${esc(key)}</span>`;
  }
  if (typeof key === "number") {
    const opts = q.item.opts || (q.kind === "sentence_insert" ? q.block.sents : null);
    const bank = q.kind === "fill_bank" ? q.block.bank : q.kind === "match_qa" ? q.block.opts : null;
    const text = bank ? bank[key] : opts ? opts[key] : "";
    return `${EXAM_LETTERS[key]}${text ? ` · <span lang="zh-CN">${esc(text)}</span>` : ""}`;
  }
  return esc(String(key));
}

function responseLabel(q, response) {
  if (response === undefined || response === null || response === "") {
    return `<span class="muted">${et("none")}</span>`;
  }
  if (typeof response === "boolean") {
    return response ? et("trueLbl") : et("falseLbl");
  }
  if (typeof response === "number") {
    return EXAM_LETTERS[response];
  }
  return `<span lang="zh-CN">${esc(String(response))}</span>`;
}

// ---------- results & review ----------
function renderExamResult() {
  document.body.classList.remove("exam-focus");
  const attempt = (state.examAttempts || [])[(state.examAttempts || []).length - 1];
  if (!attempt) {
    renderExamHome();
    return;
  }
  const full = flattenPaper(attempt.level);
  const paper = { ...full, sections: full.sections.filter((s) => attempt.sections.includes(s.id)) };
  const maxTotal = paper.sections.length * 100;
  const rows = partBreakdown(paper, attempt.responses);
  const hasWriting = attempt.sections.includes("W");
  const isFull = attempt.mode === "full";
  view.innerHTML = `
    <h1>${et("result")} · HSK ${attempt.level}</h1>
    <section class="card result-hero">
      <div class="result-score"><span class="big">${attempt.total}</span><span class="muted"> / ${maxTotal}</span></div>
      ${isFull ? `<span class="pill ${attempt.passed ? "green" : "red"}">${attempt.passed ? et("pass") : et("fail")}</span>
        <p class="small muted">${et("passedAt")} ${full.pass} / ${full.total} · ${et("elapsed")} ${formatClock(attempt.seconds)}</p>`
        : `<p class="small muted">${et("practiceMode")} · ${et("elapsed")} ${formatClock(attempt.seconds)}</p>`}
      <div class="result-sections">${paper.sections.map((s) => `
        <div class="rs-row"><span>${sectionName(s.id)}</span><span class="rs-bar"><span style="width:${attempt.scores[s.id]}%"></span></span><b>${attempt.scores[s.id]}</b></div>`).join("")}</div>
      ${hasWriting ? `<p class="small muted">${et("estimated")}</p>` : ""}
    </section>
    ${typeof guideNextHtml === "function" ? guideNextHtml() : ""}
    <section class="card">
      <h2 class="h3">${et("perPart")}</h2>
      <table class="paper-table"><tbody>${rows.map((r) => {
        const pct = Math.round((r.right / r.count) * 100);
        return `<tr class="${pct < 60 ? "weak" : ""}"><td>${sectionName(r.sec)} <span lang="zh-CN" class="muted">${PART_ZH[r.part]}</span></td><td class="num">${r.right}/${r.count}</td><td class="num">${pct}%</td></tr>`;
      }).join("")}</tbody></table>
    </section>
    <div class="stack">
      <button class="btn block" id="add-words">${icon("plus", 18)} ${et("addWords")}</button>
      <a class="btn ghost block" href="#exam">${icon("restart", 18)} ${et("backExam")}</a>
    </div>
    <section class="review-wrap">
      <div class="row between"><h2>${et("review")}</h2>
        <label class="small"><input type="checkbox" id="only-wrong" checked> ${et("onlyWrong")}</label></div>
      <div id="review-list"></div>
    </section>`;
  const list = document.getElementById("review-list");
  const pageSize = 10;
  let shown = pageSize;
  const draw = () => {
    const onlyWrong = document.getElementById("only-wrong").checked;
    const items = paper.sections.flatMap((s) => s.questions).filter((q) => !onlyWrong || EXAM_SUBJECTIVE.has(q.kind) || scoreExamQuestion(q, attempt.responses[q.key]) < 1);
    const more = items.length - shown;
    list.innerHTML = items.length
      ? `<p class="small muted">${et("tapOpen")}</p>${items.slice(0, shown).map((q) => reviewCard(q, attempt)).join("")}
        ${more > 0 ? `<button class="btn ghost block" id="review-more">${et("showMore")} <span class="muted">(${more})</span></button>` : ""}`
      : `<p class="muted">${et("correctNow")}</p>`;
    list.querySelectorAll("[data-play]").forEach((el) => {
      el.onclick = (event) => {
        event.preventDefault();
        stopAudio();
        examPlayToken += 1;
        speakExamLines(JSON.parse(el.dataset.play), attempt.level, examPlayToken, () => {});
      };
    });
    const moreButton = document.getElementById("review-more");
    if (moreButton) {
      moreButton.onclick = () => {
        shown += pageSize;
        draw();
      };
    }
  };
  document.getElementById("only-wrong").onchange = () => {
    shown = pageSize;
    draw();
  };
  draw();
  document.getElementById("add-words").onclick = (e) => {
    const missed = paper.sections.flatMap((s) => s.questions).filter((q) => !EXAM_SUBJECTIVE.has(q.kind) && scoreExamQuestion(q, attempt.responses[q.key]) < 1);
    const words = new Set();
    for (const q of missed) {
      const text = [q.item.zh, q.item.q, q.item.stmt, ...(q.item.opts || [])].flat().filter(Boolean).join("");
      for (const w of VOCAB) {
        if (w.level === attempt.level && [...w.hanzi].length >= 2 && text.includes(w.hanzi)) {
          words.add(w.hanzi);
        }
      }
    }
    const now = Date.now();
    for (const hanzi of words) {
      state.cards[hanzi] = state.cards[hanzi] ? { ...state.cards[hanzi], due: now } : schedule(null, 1, now - 10 * MINUTE);
    }
    saveState();
    toast(`${words.size} ${et("wordsAdded")}`);
    e.currentTarget.disabled = true;
  };
}

function reviewCard(q, attempt) {
  const response = attempt.responses[q.key];
  const subjective = EXAM_SUBJECTIVE.has(q.kind);
  const score = scoreExamQuestion(q, response);
  const it = q.item;
  const listening = isListening(q);
  const script = listening ? listeningScript(q) : null;
  const groupText = q.kind === "mc_group" || q.kind === "cloze" || q.kind === "sentence_insert" ? q.block : null;
  const stimulus = listening ? script.filter((l) => !(q.kind === "mc_group" && l.startsWith("问："))) :
    [it.passage || (groupText && groupText.passage), it.zh, it.stmt ? `★ ${it.stmt}` : null, it.q].flat().filter(Boolean);
  const translation = examTranslation(groupText || it);
  const why = state.lang === "id" ? it.ex_id : it.ex_en;
  const status = subjective ? "est" : score >= 1 ? "ok" : "bad";
  const shortLabel = (label) => {
    const head = String(label).split(" · ")[0].replace(/<[^>]+>/g, "");
    return [...head].length > 8 ? `${[...head].slice(0, 8).join("")}…` : head;
  };
  const statusLabel = subjective ? "" : `${shortLabel(responseLabel(q, response))} → ${shortLabel(keyLabel(q))}`;
  return `<details class="card review-card ${status}">
    <summary><span class="rv-num">${q.n}</span><span class="rv-title">${sectionName(q.sec)} <span lang="zh-CN" class="muted">${PART_ZH[q.part]}</span></span>
      <span class="rv-ans small">${subjective ? "" : statusLabel}</span><span class="rv-caret">${icon("arrow", 16)}</span></summary>
    <div class="rv-body">
    ${listening ? `<button class="btn ghost small" data-play='${esc(JSON.stringify(script))}'>${icon("sound", 16)} ${t("listen")}</button>` : ""}
    ${it.pic ? `<div class="ex-pic-solo small">${pictureSvg(it.pic, 56)}</div>` : ""}
    ${it.pics ? `<div class="ex-pic-row">${it.pics.map((p, i) => `<figure><span class="ex-letter">${EXAM_LETTERS[i]}</span>${pictureSvg(p, 40)}</figure>`).join("")}</div>` : ""}
    ${q.kind === "pic_match" ? `<div class="ex-pic-row">${q.block.pics.map((p, i) => `<figure><span class="ex-letter">${EXAM_LETTERS[i]}</span>${pictureSvg(p, 40)}</figure>`).join("")}</div>` : ""}
    <div class="review-stim">${zhLines(q.kind === "summary" ? [it.title || ""] : stimulus.slice(0, 12))}</div>
    ${!subjective ? `<p class="small">${et("yourAnswer")}: <b>${responseLabel(q, response)}</b> · ${et("correctAnswer")}: <b>${keyLabel(q)}</b></p>`
      : `<p class="small">${et("yourAnswer")}: ${responseLabel(q, response)}</p><p class="small"><span class="muted">${et("sample")}:</span> <span lang="zh-CN">${esc(it.samples ? it.samples.join(" / ") : it.sample || "")}</span></p>`}
    ${translation ? `<p class="small"><span class="muted">${et("translation")}:</span> ${translation}</p>` : ""}
    ${why ? `<p class="small"><span class="muted">${et("why")}:</span> ${esc(why)}</p>` : ""}
    </div>
  </details>`;
}
