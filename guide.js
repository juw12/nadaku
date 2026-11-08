// Nada, the study guide.
// Rule-based and fully offline: Nada reads your progress on this device, builds today's queue, always shows
// the single next step with the reason for it, and moves you to the next step after each session until the
// queue is empty. No cloud model is involved.
"use strict";

const GUIDE_TEXT = {
  id: {
    role: "pemandu belajarmu",
    planTitle: "Rencana hari ini",
    of: "dari",
    stepsDone: "langkah selesai",
    doneLabel: "selesai",
    next: "Berikutnya",
    why: "Kenapa",
    start: "Mulai",
    allDoneTitle: "Semua langkah hari ini selesai",
    allDoneMore: "Antrean baru siap besok. Masih semangat? Pilih tambahan di bawah.",
    allDoneLine: "Kerja bagus hari ini! Ingatanmu paling kuat kalau besok kamu kembali sebentar.",
    extraLearn: "Tambah 5 kata lagi",
    extraStats: "Lihat statistik",
    openGuide: "Buka panduan Nada",
    close: "Tutup",
    honest: "Nada menyusun rencana dari progres di perangkat ini. Aturannya tetap dan offline, tanpa AI di server.",
    tipTitle: "Tips untuk layar ini",
    stepReview: "Ulang {n} kartu yang jatuh tempo",
    whyReview: "Kartu ini hampir terlupa. Mengulang sekarang paling hemat waktu.",
    stepLearn: "Pelajari 5 kata baru HSK {lv}",
    whyLearn: "Kata baru sedikit demi sedikit setiap hari lebih awet daripada banyak sekaligus.",
    stepTones: "Latih titik lemah: {tone}",
    stepTonesAny: "Latih 10 nada",
    whyTones: "Nada ini paling sering salah di catatanmu.",
    whyTonesAny: "Telinga yang terlatih membuat kosakata lebih mudah diingat.",
    stepWrite: "Tulis 1 karakter",
    whyWrite: "Menulis urutan goresan memperkuat ingatan bentuk karakter.",
    stepTalk: "Satu percakapan singkat",
    whyTalk: "Kata yang dipakai dalam kalimat lebih cepat keluar saat bicara.",
    stepExam: "Latihan 1 bagian ujian HSK {lv}",
    whyExam: "Latihan format ujian seminggu sekali membuat hari ujian terasa biasa.",
    lineFirst: "Halo, aku Nada. Aku akan memandu kamu langkah demi langkah. Mulai dari langkah pertama di bawah.",
    lineMany: "Ada {n} kartu yang mulai terlupa. Kita ulang dulu, baru tambah kata baru.",
    lineProgress: "Bagus, {done} langkah selesai. Tinggal {left} lagi.",
    lineStart: "Rencana hari ini sudah siap: {left} langkah, sekitar {min} menit.",
    afterTitle: "Nada: langkah berikutnya",
    afterDone: "Itu langkah terakhir hari ini. Antrian kosong, kerja bagus.",
    minutes: "menit",
    tips: {
      vocab: "Ketuk sebuah kata untuk mendengar suaranya. Pilih level HSK di atas untuk melihat daftar lain.",
      learn: "Dengarkan dulu, baru lihat arti. Tekan spasi atau Enter untuk lanjut.",
      review: "Jawab jujur. Kartu yang kamu tandai sulit akan muncul lagi lebih cepat.",
      tones: "Nada 3 turun lalu naik. Kalau ragu, ucapkan pelan dan lihat kurva suaramu.",
      write: "Ikuti urutan goresan: atas ke bawah, kiri ke kanan. Goresan yang benar akan terkunci.",
      talk: "Pilih jawaban, lalu tahan tombol mikrofon untuk menirukan. Semua offline.",
      exam: "Mulai dari latihan per bagian. Simulasi penuh paling berguna seminggu sekali.",
      me: "Ganti level HSK atau target harian di sini. Rencana Nada ikut menyesuaikan.",
      stats: "Garis diagonal berarti ramalan ingatan tepat. Semakin dekat titik ke garis, semakin akurat.",
      indo: "Mulai dari kata yang sudah kamu kenal, lalu hindari jebakan pinyin di bagian bawah.",
    },
  },
  en: {
    role: "your study guide",
    planTitle: "Today's plan",
    of: "of",
    stepsDone: "steps done",
    doneLabel: "done",
    next: "Next",
    why: "Why",
    start: "Start",
    allDoneTitle: "Every step for today is done",
    allDoneMore: "A new queue is ready tomorrow. Still keen? Pick an extra below.",
    allDoneLine: "Great work today! Memory sticks best if you come back briefly tomorrow.",
    extraLearn: "Learn 5 more words",
    extraStats: "View stats",
    openGuide: "Open Nada's guide",
    close: "Close",
    honest: "Nada builds the plan from progress stored on this device. The rules are fixed and offline, with no AI server.",
    tipTitle: "Tip for this screen",
    stepReview: "Review {n} due cards",
    whyReview: "These cards are close to being forgotten. Reviewing now saves the most time.",
    stepLearn: "Learn 5 new HSK {lv} words",
    whyLearn: "A few new words every day last longer than many at once.",
    stepTones: "Practise your weak spot: {tone}",
    stepTonesAny: "Practise 10 tones",
    whyTones: "This tone is the one you miss most often.",
    whyTonesAny: "A trained ear makes vocabulary easier to remember.",
    stepWrite: "Write 1 character",
    whyWrite: "Writing the stroke order strengthens memory of the character's shape.",
    stepTalk: "One short conversation",
    whyTalk: "Words you use in sentences come out faster when you speak.",
    stepExam: "Practise 1 HSK {lv} exam section",
    whyExam: "Practising the exam format once a week makes test day feel normal.",
    lineFirst: "Hi, I'm Nada. I'll guide you step by step. Start with the first step below.",
    lineMany: "{n} cards are starting to fade. Let's review first, then add new words.",
    lineProgress: "Nice, {done} steps done. {left} to go.",
    lineStart: "Today's plan is ready: {left} steps, about {min} minutes.",
    afterTitle: "Nada: next step",
    afterDone: "That was the last step for today. The queue is empty, well done.",
    minutes: "min",
    tips: {
      vocab: "Tap a word to hear it. Pick an HSK level above to see another list.",
      learn: "Listen first, then check the meaning. Press Space or Enter to continue.",
      review: "Answer honestly. Cards you mark as hard come back sooner.",
      tones: "Tone 3 dips then rises. If unsure, say it slowly and watch your pitch curve.",
      write: "Follow the stroke order: top to bottom, left to right. Correct strokes lock in place.",
      talk: "Pick a reply, then hold the mic button to repeat it. Everything works offline.",
      exam: "Start with practice by section. A full mock is most useful once a week.",
      me: "Change your HSK level or daily goal here. Nada's plan adjusts to it.",
      stats: "The diagonal means perfect memory forecasts. Dots close to the line mean accurate forecasts.",
      indo: "Start with words you already know, then avoid the pinyin traps further down.",
    },
  },
};

// Minimum activity (XP earned in that area today) that counts a step as done.
const GUIDE_DONE_XP = { review: 1, learn: 5, tones: 5, write: 2, talk: 5, exam: 1 };
const GUIDE_MINUTES = { review: 6, learn: 5, tones: 3, write: 3, talk: 3, exam: 10 };
const GUIDE_ICONS = { review: "review", learn: "plus", tones: "tone", write: "pen", talk: "chat", exam: "exam" };
const GUIDE_AREAS = ["review", "learn", "tones", "write", "talk", "exam"];

function gt(key) {
  const table = GUIDE_TEXT[state.lang] || GUIDE_TEXT.id;
  return table[key] ?? GUIDE_TEXT.id[key] ?? key;
}

function fill(text, values) {
  return String(text).replace(/\{(\w+)\}/g, (_, name) => (values[name] ?? ""));
}

function guideActivity(day = dateKey(Date.now())) {
  if (!state.activity || typeof state.activity !== "object") {
    state.activity = {};
  }
  if (!state.activity[day]) {
    state.activity[day] = {};
  }
  return state.activity[day];
}

// Called from addXP: credits the XP to the area of the current screen.
function guideRecord(amount, now = Date.now()) {
  const area = (location.hash.slice(1) || "home").split("/")[0];
  if (!GUIDE_AREAS.includes(area) || !(amount > 0)) {
    return;
  }
  const today = guideActivity(dateKey(now));
  today[area] = (today[area] || 0) + amount;
  const keep = new Set(Array.from({ length: 14 }, (_, i) => dateKey(now - i * DAY)));
  for (const day of Object.keys(state.activity)) {
    if (!keep.has(day)) {
      delete state.activity[day];
    }
  }
}

function daysSinceExam(now) {
  const dates = (state.examAttempts || []).map((a) => a.date || a.at || 0).filter(Boolean);
  if (!dates.length) {
    return Infinity;
  }
  return (now - Math.max(...dates)) / DAY;
}

// Builds today's ordered queue. Each step: {id, title, why, href, icon, minutes, done}.
function guidePlan(now = Date.now()) {
  const today = guideActivity(dateKey(now));
  const due = dueWords(now).length;
  const learned = Object.keys(state.cards || {}).length;
  const levelLeft = wordsAtLevel(state.level).filter((w) => !(state.cards || {})[w.hanzi]).length;
  const weakest = typeof weakestTone === "function" ? weakestTone() : null;
  const steps = [];
  const add = (id, title, why, href) => {
    steps.push({
      id, title, why, href, icon: GUIDE_ICONS[id], minutes: GUIDE_MINUTES[id],
      done: (today[id] || 0) >= GUIDE_DONE_XP[id],
    });
  };
  if (due > 0 || today.review) {
    add("review", fill(gt("stepReview"), { n: Math.max(due, 1) }), gt("whyReview"), "#review");
    if (due === 0) {
      steps[steps.length - 1].done = true;
    }
  }
  if (levelLeft > 0 || today.learn) {
    add("learn", fill(gt("stepLearn"), { lv: state.level }), gt("whyLearn"), "#learn");
  }
  if (weakest) {
    add("tones", fill(gt("stepTones"), { tone: weakest }), gt("whyTones"), "#tones");
  } else {
    add("tones", gt("stepTonesAny"), gt("whyTonesAny"), "#tones");
  }
  if (learned > 0) {
    add("write", gt("stepWrite"), gt("whyWrite"), "#write");
  }
  if (learned >= 20 && (daysSinceExam(now) >= 7 || today.exam)) {
    add("exam", fill(gt("stepExam"), { lv: state.level }), gt("whyExam"), "#exam");
  } else if (learned > 0) {
    add("talk", gt("stepTalk"), gt("whyTalk"), "#talk");
  }
  return steps;
}

function guideSummary(now = Date.now()) {
  const steps = guidePlan(now);
  const done = steps.filter((s) => s.done).length;
  const left = steps.length - done;
  const next = steps.find((s) => !s.done) || null;
  const minutes = steps.filter((s) => !s.done).reduce((sum, s) => sum + s.minutes, 0);
  const due = dueWords(now).length;
  let line;
  let mood;
  if (!next) {
    line = gt("allDoneLine");
    mood = "cheer";
  } else if (!Object.keys(state.cards || {}).length) {
    line = gt("lineFirst");
    mood = "happy";
  } else if (next.id === "review" && due >= 15) {
    line = fill(gt("lineMany"), { n: due });
    mood = "think";
  } else if (done > 0) {
    line = fill(gt("lineProgress"), { done, left });
    mood = "encourage";
  } else {
    line = fill(gt("lineStart"), { left, min: minutes });
    mood = "happy";
  }
  return { steps, done, left, next, minutes, line, mood };
}

function guideStepsHtml(summary) {
  return `<ol class="guide-steps">${summary.steps.map((s, i) => {
    const status = s.done ? "done" : s === summary.next ? "next" : "todo";
    const marker = s.done ? icon("check", 14) : String(i + 1);
    return `<li class="${status}"><span class="gs-mark" aria-hidden="true">${marker}</span>
      <a href="${s.href}" class="gs-title">${esc(s.title)}</a>
      <span class="gs-min">${s.done ? "" : `${s.minutes} ${gt("minutes")}`}</span>
      <span class="sr-only">${s.done ? gt("doneLabel") : ""}</span></li>`;
  }).join("")}</ol>`;
}

// The plan card on the home screen.
function guideCardHtml(now = Date.now()) {
  const summary = guideSummary(now);
  const pct = summary.steps.length ? Math.round((summary.done / summary.steps.length) * 100) : 100;
  const next = summary.next;
  return `<section class="card guide" aria-labelledby="guide-title">
    <div class="guide-head">
      ${mascotSvg(summary.mood, 76)}
      <div class="guide-say">
        <p class="guide-name"><b id="guide-title">Nada</b> <span>${gt("role")}</span></p>
        <p class="guide-line">${esc(summary.line)}</p>
      </div>
    </div>
    ${next ? `<a class="btn block guide-next" href="${next.href}">${icon(next.icon, 18)} ${esc(next.title)}</a>
      <p class="guide-why"><span>${gt("why")}:</span> ${esc(next.why)}</p>`
      : `<div class="guide-done" role="status">
        <span class="gd-check" aria-hidden="true">${icon("check", 22)}</span>
        <div><b>${gt("allDoneTitle")}</b><p>${gt("allDoneMore")}</p></div>
      </div>
      <div class="row guide-extra"><a class="btn ghost small" href="#learn">${icon("plus", 16)} ${gt("extraLearn")}</a>
        <a class="btn ghost small" href="#stats">${icon("chart", 16)} ${gt("extraStats")}</a></div>`}
    <div class="guide-plan">
      <div class="row guide-plan-head"><span>${gt("planTitle")}</span><span class="spacer"></span>
        <span class="muted">${summary.done} ${gt("of")} ${summary.steps.length} ${gt("stepsDone")}</span></div>
      <div class="guide-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${gt("planTitle")}"><i style="width:${pct}%"></i></div>
      ${guideStepsHtml(summary)}
    </div>
  </section>`;
}

// Shown on every session-complete screen: hands the learner straight to the next queued step.
function guideNextHtml(now = Date.now()) {
  const summary = guideSummary(now);
  const next = summary.next;
  return `<div class="guide-after">
    ${mascotSvg(next ? "encourage" : "cheer", 44)}
    <div class="guide-after-body">
      <p class="guide-after-title">${next ? gt("afterTitle") : gt("allDoneTitle")}</p>
      <p class="muted small">${next ? esc(next.title) : gt("afterDone")}</p>
    </div>
    ${next ? `<a class="btn small guide-after-go" href="${next.href}">${gt("start")} ${icon("arrow", 16)}</a>`
      : `<a class="btn ghost small" href="#home">${icon("home", 16)}</a>`}
  </div>`;
}

// Floating Nada button on the other screens: opens a sheet with a tip for this screen and today's queue.
function guideMountFab(routeName, force = false) {
  const old = document.getElementById("nada-fab");
  if (old) {
    old.remove();
  }
  const sheet = document.getElementById("nada-sheet");
  if (sheet) {
    sheet.remove();
  }
  const hidden = ["home", "", "onboarding"].includes(routeName) || !state.onboarded || document.body.classList.contains("exam-focus")
    || (!force && location.search.includes("test=1"));
  if (hidden) {
    return;
  }
  const fab = document.createElement("button");
  fab.id = "nada-fab";
  fab.className = "nada-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", gt("openGuide"));
  const summary = guideSummary();
  fab.innerHTML = `${mascotSvg(summary.next ? "happy" : "cheer", 40)}${summary.left ? `<span class="nada-badge">${summary.left}</span>` : ""}`;
  fab.addEventListener("click", () => guideOpenSheet(routeName));
  document.body.appendChild(fab);
}

function guideOpenSheet(routeName) {
  const summary = guideSummary();
  const tip = (gt("tips") || {})[routeName];
  const sheet = document.createElement("div");
  sheet.id = "nada-sheet";
  sheet.className = "nada-sheet";
  sheet.innerHTML = `<div class="nada-sheet-card" role="dialog" aria-modal="true" aria-labelledby="nada-sheet-title">
    <div class="guide-head">
      ${mascotSvg(summary.mood, 52)}
      <div class="guide-say">
        <p class="guide-name"><b id="nada-sheet-title">Nada</b> <span>${gt("role")}</span></p>
        <p class="guide-line">${esc(summary.line)}</p>
      </div>
      <button class="icon-btn" type="button" data-close aria-label="${gt("close")}">${icon("close", 18)}</button>
    </div>
    ${tip ? `<div class="guide-tip"><b>${gt("tipTitle")}</b><p>${esc(tip)}</p></div>` : ""}
    ${summary.next ? `<a class="btn block guide-next" href="${summary.next.href}" data-close>${icon(summary.next.icon, 18)} ${esc(summary.next.title)}</a>` : ""}
    <div class="guide-plan">
      <div class="row guide-plan-head"><span>${gt("planTitle")}</span><span class="spacer"></span>
        <span class="muted">${summary.done} ${gt("of")} ${summary.steps.length} ${gt("stepsDone")}</span></div>
      ${guideStepsHtml(summary)}
    </div>
    <p class="muted small guide-honest">${gt("honest")}</p>
  </div>`;
  const close = () => {
    sheet.remove();
    document.removeEventListener("keydown", onKey);
    const fab = document.getElementById("nada-fab");
    if (fab) {
      fab.focus();
    }
  };
  const onKey = (event) => {
    if (event.key === "Escape") {
      close();
    }
  };
  sheet.addEventListener("click", (event) => {
    if (event.target === sheet || event.target.closest("[data-close]") || event.target.closest(".gs-title")) {
      close();
    }
  });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(sheet);
  const first = sheet.querySelector(".guide-next, [data-close]");
  if (first) {
    first.focus();
  }
}
