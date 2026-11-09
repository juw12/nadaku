// Nadaku HSKK speaking mock: the official HSKK format (Beginner / Intermediate / Advanced), run offline.
// Audio prompts use the device's Mandarin voice (or native word recordings), answers are recorded on the device
// with MediaRecorder and never leave it. The learner reviews each recording against the model and rates it with the
// rubric; the score is an estimate built from those ratings (plus speech-time and, when online recognition is on,
// a character match for repeat / read-aloud items). Real HSKK answers are rated by trained examiners.

const HSKK_META = {
  beginner: { hsk: "1-2", items: 27, prep: 7, minutes: 20, parts: [["repeat", 15, 6], ["answer", 10, 4], ["open", 2, 3]] },
  intermediate: { hsk: "3-4", items: 14, prep: 10, minutes: 23, parts: [["repeat", 10, 5], ["picture", 2, 4], ["open", 2, 4]] },
  advanced: { hsk: "5-6", items: 6, prep: 10, minutes: 25, parts: [["retell", 3, 8], ["read", 1, 2], ["open", 2, 5]] },
};
const HSKK_LEVELS = ["beginner", "intermediate", "advanced"];
const HSKK_PART_ZH = { 1: "第一部分", 2: "第二部分", 3: "第三部分" };
const HSKK_VOICE_LEVEL = { beginner: 1, intermediate: 3, advanced: 5 };

const HSKK_TEXT = {
  id: {
    card: "Ujian lisan (HSKK)", cardSub: "Kemampuan bicara diuji terpisah di HSKK. Pilih tingkat yang sesuai dengan level HSK-mu.",
    beginner: "Dasar", intermediate: "Menengah", advanced: "Lanjut", forHsk: "cocok untuk HSK",
    prep: "Persiapan", total: "Total", passLine: "Batas lulus", start: "Mulai simulasi lisan", last: "Terakhir",
    repeat: "Dengar lalu ulangi", answer: "Dengar lalu jawab", open: "Jawab pertanyaan", picture: "Ceritakan gambar",
    retell: "Dengar lalu ceritakan ulang", read: "Baca nyaring",
    insRepeat: "Dengarkan satu kalimat, lalu ucapkan ulang persis sama.",
    insAnswer: "Dengarkan pertanyaannya, lalu jawab dengan kalimat pendek.",
    insOpen: "Jawab pertanyaan dengan beberapa kalimat. Bicara sampai waktunya hampir habis.",
    insPicture: "Ceritakan apa yang terjadi di gambar: siapa, di mana, sedang apa.",
    insRetell: "Dengarkan cerita pendek (diputar sekali), lalu ceritakan ulang dengan kata-katamu sendiri.",
    insRead: "Baca teks ini dengan nyaring, jelas dan dengan nada yang benar.",
    introMic: "Mikrofon dipakai untuk merekam jawabanmu. Rekaman hanya disimpan di perangkat ini selama sesi.",
    introNoMic: "Mikrofon tidak tersedia. Kamu tetap bisa berlatih: ucapkan jawabanmu dengan suara keras, lalu nilai sendiri.",
    introStay: "Jangan tinggalkan halaman ini sampai selesai; rekaman tidak disimpan permanen.",
    begin: "Mulai", prepTitle: "Waktu persiapan", prepLead: "Seperti di ujian asli, siapkan jawaban untuk bagian 2 dan 3. Boleh mencatat di kertas.",
    prepReady: "Saya siap, mulai ujian", listening: "Dengarkan…", speakNow: "Bicara sekarang", getReady: "Bersiap…",
    next: "Selesai, lanjut", noMicTake: "Tanpa rekaman: ucapkan jawabanmu sekarang.",
    reviewTitle: "Periksa jawabanmu", reviewLead: "Dengarkan rekamanmu, bandingkan dengan contoh, lalu beri nilai dengan jujur. Nilai akhir dihitung dari penilaian ini.",
    yourTake: "Rekamanmu", model: "Contoh", modelAnswer: "Contoh jawaban", noTake: "Tidak ada rekaman",
    spoke: "Bicara", sec: "dtk", match: "Cocok", suggested: "saran otomatis", rated: "dinilai",
    fillAll: "Tandai semua", seeScore: "Lihat nilai", needRate: "Nilai semua jawaban dulu",
    r2: ["Belum", "Sebagian", "Tepat"], r4: ["0", "1", "2", "3", "4"],
    rubric2: "Tepat = semua kata dan nada benar · Sebagian = maksudnya tersampaikan dengan beberapa salah · Belum = tidak bisa.",
    rubric4: "4 = lengkap, lancar, hampir tanpa salah · 3 = jelas, sedikit salah · 2 = bisa dipahami tapi pendek/terputus · 1 = sangat terbatas · 0 = tidak menjawab.",
    resultTitle: "Nilai lisan (estimasi)", pass: "Lulus", fail: "Belum lulus", again: "Ulangi", back: "Kembali ke ujian",
    resultNote: "Nilai ini dihitung dari penilaianmu sendiri dengan rubrik di atas. Di HSKK asli, jawaban dinilai oleh penguji.",
    rubricHow: "Cara menilai", showText: "Lihat teks", partsDetail: "Bagian dan waktu",
    focusTitle: "Fokus berikutnya", practiceTalk: "Latihan bicara", again2: "Ulangi simulasi", back2: "Kembali ke ujian",
    focus_repeat: "Menirukan kalimat: dengar sekali, ulangi dengan nada dan jeda yang sama. Latih dengan Tahan & ulangi di tab Bicara.",
    focus_answer: "Jawab dengan kalimat lengkap, bukan satu kata: ulangi bagian pertanyaan lalu tambah jawabanmu.",
    focus_picture: "Gambarkan siapa, di mana, sedang apa, lalu tambah satu pendapat. Pakai 先…然后…最后 untuk urutan.",
    focus_open: "Pakai pola: pendapat, dua alasan, satu contoh, kesimpulan. Terus bicara sampai waktu hampir habis.",
    focus_retell: "Catat kata kunci saat mendengar, lalu ceritakan berurutan: awal, kejadian, akhir.",
    focus_read: "Baca pelan dan jelas; jaga nada tiap suku kata dan berhenti sejenak di koma.",
    part: "Bagian", of: "dari", leave: "Simulasi lisan dihentikan.", items: "soal", min: "menit",
    hsk12Write: "Format resmi HSK 1–2 hanya Mendengar dan Membaca; menulis mulai di HSK 3. Bicara diuji di HSKK di bawah.",
  },
  en: {
    card: "Speaking exam (HSKK)", cardSub: "Speaking is tested separately in the HSKK. Pick the level that matches your HSK level.",
    beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", forHsk: "fits HSK",
    prep: "Preparation", total: "Total", passLine: "Pass line", start: "Start speaking mock", last: "Last",
    repeat: "Listen and repeat", answer: "Listen and answer", open: "Answer questions", picture: "Describe the picture",
    retell: "Listen and retell", read: "Read aloud",
    insRepeat: "Listen to one sentence, then say it back exactly.",
    insAnswer: "Listen to the question, then answer with a short sentence.",
    insOpen: "Answer the question in several sentences. Keep talking until the time is nearly up.",
    insPicture: "Describe what happens in the picture: who, where, doing what.",
    insRetell: "Listen to a short story (played once), then retell it in your own words.",
    insRead: "Read this text aloud, clearly and with the right tones.",
    introMic: "The microphone records your answers. Recordings stay on this device for this session only.",
    introNoMic: "No microphone available. You can still practise: say your answers out loud, then rate yourself.",
    introStay: "Stay on this page until you finish; recordings are not stored permanently.",
    begin: "Begin", prepTitle: "Preparation time", prepLead: "As in the real test, prepare your answers for parts 2 and 3. You may take notes on paper.",
    prepReady: "I'm ready, start the test", listening: "Listen…", speakNow: "Speak now", getReady: "Get ready…",
    next: "Done, next", noMicTake: "No recording: say your answer now.",
    reviewTitle: "Review your answers", reviewLead: "Play your recording, compare it with the model, then rate it honestly. Your score is built from these ratings.",
    yourTake: "Your recording", model: "Model", modelAnswer: "Model answer", noTake: "No recording",
    spoke: "Spoke", sec: "s", match: "Match", suggested: "auto suggestion", rated: "rated",
    fillAll: "Mark all", seeScore: "See score", needRate: "Rate every answer first",
    r2: ["Not yet", "Partly", "Correct"], r4: ["0", "1", "2", "3", "4"],
    rubric2: "Correct = every word and tone right · Partly = meaning comes across with some errors · Not yet = could not.",
    rubric4: "4 = complete, fluent, almost no errors · 3 = clear, few errors · 2 = understandable but short/halting · 1 = very limited · 0 = no answer.",
    resultTitle: "Speaking score (estimate)", pass: "Pass", fail: "Not yet", again: "Try again", back: "Back to exams",
    resultNote: "This score comes from your own ratings with the rubric above. In the real HSKK, answers are rated by examiners.",
    rubricHow: "How to rate", showText: "Show text", partsDetail: "Parts and timing",
    focusTitle: "Focus next", practiceTalk: "Speaking practice", again2: "Retake mock", back2: "Back to exams",
    focus_repeat: "Repeating: listen once, then copy the tones and pauses exactly. Practise with Hold & repeat in the Speak tab.",
    focus_answer: "Answer in a full sentence, not one word: echo part of the question, then add your answer.",
    focus_picture: "Say who, where and what is happening, then add one opinion. Use 先…然后…最后 for order.",
    focus_open: "Use a frame: opinion, two reasons, one example, conclusion. Keep talking until time is nearly up.",
    focus_retell: "Note key words while listening, then retell in order: start, events, ending.",
    focus_read: "Read slowly and clearly; hold each tone and pause briefly at commas.",
    part: "Part", of: "of", leave: "Speaking mock stopped.", items: "items", min: "min",
    hsk12Write: "The official HSK 1–2 papers have only Listening and Reading; writing starts at HSK 3. Speaking is tested in the HSKK below.",
  },
};

function ht(key) {
  return HSKK_TEXT[state.lang][key] ?? HSKK_TEXT.en[key] ?? key;
}

function hskkLevelFor(hskLevel) {
  return hskLevel <= 2 ? "beginner" : hskLevel <= 4 ? "intermediate" : "advanced";
}

function hskkMaxRating(kind) {
  return kind === "repeat" || kind === "answer" ? 2 : 4;
}

// Score out of 100 from the ratings: each part weighs its official time share; inside a part every item counts the same.
function hskkScore(paper, ratings) {
  const parts = paper.parts.map((part, p) => {
    const max = hskkMaxRating(part.kind);
    const got = part.items.reduce((sum, _item, i) => sum + Math.max(0, Math.min(max, Number(ratings[`${p}-${i}`]) || 0)), 0);
    return Math.round((part.points * got) / (max * part.items.length) * 10) / 10;
  });
  const total = Math.round(parts.reduce((a, b) => a + b, 0));
  return { parts, total, passed: total >= paper.pass };
}

// Share of the target characters that appear in order in the recognised text (longest common subsequence).
function hskkCharMatch(target, heard) {
  const a = [...String(target).replace(/[^\u4e00-\u9fff]/g, "")];
  const b = [...String(heard).replace(/[^\u4e00-\u9fff]/g, "")];
  if (!a.length) {
    return 0;
  }
  const row = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = 0;
    for (let j = 1; j <= b.length; j += 1) {
      const keep = row[j];
      row[j] = a[i - 1] === b[j - 1] ? prev + 1 : Math.max(row[j], row[j - 1]);
      prev = keep;
    }
  }
  return row[b.length] / a.length;
}

function hskkSuggestRating(kind, take) {
  if (!take) {
    return null;
  }
  if (take.voiced === 0) {
    return 0;
  }
  if (typeof take.match === "number") {
    if (kind === "repeat") {
      return take.match >= 0.9 ? 2 : take.match >= 0.5 ? 1 : 0;
    }
    if (kind === "read") {
      return take.match >= 0.95 ? 4 : take.match >= 0.85 ? 3 : take.match >= 0.7 ? 2 : take.match >= 0.4 ? 1 : 0;
    }
  }
  return null;
}

function loadHskkData() {
  const pictures = typeof loadScriptOnce === "function" ? loadScriptOnce("pictures.js", "PICTURES") : Promise.resolve();
  const papers = typeof HSKK_PAPERS !== "undefined" ? Promise.resolve() : new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "hskk.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("could not load hskk.js"));
    document.head.appendChild(script);
  });
  return Promise.all([pictures, papers]);
}

// ---------- exam home card ----------
function hskkHomeCardHtml(hskLevel, nadaTag = "") {
  const levelId = HSKK_LEVELS.includes(state.hskkLevel) ? state.hskkLevel : hskkLevelFor(hskLevel);
  const meta = HSKK_META[levelId];
  const last = (state.hskkAttempts || []).filter((a) => a.level === levelId).slice(-1)[0];
  const testMinutes = meta.parts.reduce((sum, p) => sum + p[2], 0);
  return `<section class="card hskk-card" aria-label="${ht("card")}">
    <div class="paper-head"><h2 class="h3">${ht("card")}</h2>
      <span class="pill">${meta.items} ${ht("items")} · ${meta.minutes} ${ht("min")}</span></div>
    <p class="small muted tight">${ht("cardSub")}</p>
    <div class="seg seg-small" role="radiogroup" aria-label="HSKK">
      ${HSKK_LEVELS.map((id) => `<button class="seg-btn ${id === levelId ? "on" : ""}" role="radio" aria-checked="${id === levelId}" data-hskk="${id}">${ht(id)}</button>`).join("")}
    </div>
    <details class="hk-parts-detail"><summary>${ht("partsDetail")}</summary>
    <table class="paper-table">
      <thead><tr><th>${ht("part")}</th><th class="num">${ht("items")}</th><th class="num">${ht("min")}</th></tr></thead>
      <tbody>${meta.parts.map(([kind, n, m], i) => `<tr><td><span lang="zh-CN">${HSKK_PART_ZH[i + 1]}</span> · ${ht(kind)}</td><td class="num">${n}</td><td class="num">${m}</td></tr>`).join("")}
        <tr><td>${ht("prep")}</td><td class="num"></td><td class="num">${meta.prep}</td></tr></tbody>
      <tfoot><tr><td>${ht("total")}</td><td class="num">${meta.items}</td><td class="num">${testMinutes + meta.prep}</td></tr></tfoot>
    </table></details>
    <p class="small muted">${ht("passLine")}: <b>60</b> / 100 · ${ht("forHsk")} ${meta.hsk}${last ? ` · ${ht("last")}: <b>${last.total}</b>` : ""}</p>
    <a class="btn block${nadaTag ? " nada-pick" : " ghost"}" id="hskk-start" href="#exam/hskk-${levelId}">${icon("mic", 18)} ${ht("start")}${nadaTag}</a>
  </section>`;
}

function hskkBindHome(rerender) {
  document.querySelectorAll("[data-hskk]").forEach((el) => {
    el.onclick = () => {
      state.hskkLevel = el.dataset.hskk;
      saveState();
      rerender();
    };
  });
}

// ---------- recording ----------
async function hskkOpenMic() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return null;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    return { stream, ctx, analyser };
  } catch (error) {
    return null;
  }
}

function hskkCloseMic(mic) {
  if (!mic) {
    return;
  }
  mic.stream.getTracks().forEach((track) => track.stop());
  if (mic.ctx && mic.ctx.state !== "closed") {
    mic.ctx.close();
  }
}

// One answer: MediaRecorder for playback, an RMS meter for speaking time, optional online recognition for a match score.
function hskkStartTake(mic, target, onLevel) {
  const take = { voiced: 0, url: null, heard: "" };
  if (!mic) {
    return { stop: async () => null };
  }
  let recorder = null;
  const chunks = [];
  if (typeof MediaRecorder !== "undefined") {
    try {
      recorder = new MediaRecorder(mic.stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) {
          chunks.push(e.data);
        }
      };
      recorder.start();
    } catch (error) {
      recorder = null;
    }
  }
  const buffer = new Float32Array(mic.analyser.fftSize);
  let floor = 0.01;
  const meter = setInterval(() => {
    mic.analyser.getFloatTimeDomainData(buffer);
    let sum = 0;
    for (let i = 0; i < buffer.length; i += 1) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    floor = Math.min(floor * 1.002, Math.max(0.004, rms));
    if (rms > Math.max(0.02, floor * 3)) {
      take.voiced += 0.1;
    }
    onLevel(Math.min(1, rms * 8));
  }, 100);
  let recognition = null;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (target && state.onlineSpeech && navigator.onLine && Recognition) {
    try {
      recognition = new Recognition();
      recognition.lang = "zh-CN";
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          if (event.results[i].isFinal) {
            take.heard += event.results[i][0].transcript;
          }
        }
      };
      recognition.onerror = () => {};
      recognition.start();
    } catch (error) {
      recognition = null;
    }
  }
  return {
    stop: () => new Promise((resolve) => {
      clearInterval(meter);
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          /* already stopped */
        }
      }
      const finish = () => {
        take.voiced = Math.round(take.voiced);
        if (chunks.length) {
          take.url = URL.createObjectURL(new Blob(chunks, { type: chunks[0].type || "audio/webm" }));
        }
        // Recognition results arrive a moment after stop(); give them a short window.
        setTimeout(() => {
          if (target && take.heard) {
            take.match = Math.round(hskkCharMatch(target, take.heard) * 100) / 100;
          }
          resolve(take);
        }, recognition ? 600 : 0);
      };
      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = finish;
        recorder.stop();
      } else {
        finish();
      }
    }),
  };
}

// ---------- session ----------
let hskkSession = null;

function renderHskkScreen(arg) {
  const levelId = String(arg).replace("hskk-", "");
  if (!HSKK_LEVELS.includes(levelId)) {
    location.hash = "#exam";
    return;
  }
  view.innerHTML = `<h1>${ht("card")}</h1><p class="muted">${typeof et === "function" ? et("loading") : "…"}</p>`;
  loadHskkData()
    .then(() => {
      if (location.hash === `#exam/hskk-${levelId}`) {
        hskkRun(levelId);
      }
    })
    .catch(() => {
      view.innerHTML = `<h1>${ht("card")}</h1><div class="card"><p>${esc(t("noAudio"))}</p></div>`;
    });
}

// opts.speed < 1 shortens every timer (tests); opts.noMic skips the microphone.
function hskkRun(levelId, opts = {}) {
  if (hskkSession) {
    hskkSession.cleanup();
  }
  const paper = HSKK_PAPERS[levelId];
  const speed = opts.speed || 1;
  const voiceLevel = HSKK_VOICE_LEVEL[levelId];
  const route = `#exam/hskk-${levelId}`;
  const session = {
    levelId, paper, partIndex: 0, itemIndex: 0, takes: {}, ratings: {}, suggested: {}, phase: "intro",
    mic: null, timer: null, take: null, token: 0,
  };
  hskkSession = session;
  const lang = state.lang === "id" ? "id" : "en";
  const levelName = `HSKK ${ht(levelId)}`;

  const onHashChange = () => {
    if (location.hash !== route && hskkSession === session) {
      session.cleanup();
    }
  };
  window.addEventListener("hashchange", onHashChange);

  session.cleanup = () => {
    clearInterval(session.timer);
    session.token += 1;
    examPlayToken += 1;
    stopAudio();
    if (session.take) {
      session.take.stop();
      session.take = null;
    }
    hskkCloseMic(session.mic);
    session.mic = null;
    window.removeEventListener("hashchange", onHashChange);
    view.onclick = null;
    document.body.classList.remove("exam-focus", "hskk-on");
    if (hskkSession === session) {
      hskkSession = null;
    }
  };

  function part() {
    return paper.parts[session.partIndex];
  }

  function item() {
    return part().items[session.itemIndex];
  }

  function key(p = session.partIndex, i = session.itemIndex) {
    return `${p}-${i}`;
  }

  function insFor(kind) {
    return ht(`ins${kind[0].toUpperCase()}${kind.slice(1)}`);
  }

  function clock(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  function countdown(seconds, onTick, onEnd) {
    clearInterval(session.timer);
    const ends = Date.now() + seconds * 1000 * speed;
    const step = () => {
      const left = (ends - Date.now()) / 1000 / speed;
      onTick(left);
      if (left <= 0) {
        clearInterval(session.timer);
        onEnd();
      }
    };
    session.timer = setInterval(step, 250 * Math.min(1, speed * 4));
    step();
  }

  function play(text, onDone) {
    examPlayToken += 1;
    const token = examPlayToken;
    let done = false;
    const finish = () => {
      if (!done && token === examPlayToken) {
        done = true;
        onDone();
      }
    };
    // Safety net: never wait on audio longer than its plausible length.
    setTimeout(finish, Math.max(4000, [...text].length * 450) * speed);
    if (speed < 1) {
      setTimeout(finish, 30);
      return;
    }
    speakExamLines([text], voiceLevel, token, finish);
  }

  function intro() {
    session.phase = "intro";
    document.body.classList.add("exam-focus", "hskk-on");
    const hasMicApi = !opts.noMic && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    view.innerHTML = `
      <div class="ex-intro card hk-intro">
        <p class="eyebrow">${levelName} · ${ht("forHsk")} ${HSKK_META[levelId].hsk}</p>
        <h1>${ht("card")}</h1>
        <p class="ex-intro-meta">${HSKK_META[levelId].items} ${ht("items")} · ${paper.minutes} ${ht("min")} · ${ht("passLine")} 60 / 100</p>
        <ol class="ex-parts">${paper.parts.map((p) => `<li><b lang="zh-CN">${HSKK_PART_ZH[p.part]}</b> <span class="muted">${ht(p.kind)} · ${p.items.length} ${ht("items")} · ${p.minutes} ${ht("min")}</span><br><span class="small">${insFor(p.kind)}</span></li>`).join("")}</ol>
        <p class="small muted">${hasMicApi ? ht("introMic") : ht("introNoMic")} ${ht("introStay")}</p>
        <button class="btn block" id="hk-begin">${icon("mic", 18)} ${ht("begin")}</button>
      </div>`;
    document.getElementById("hk-begin").onclick = async () => {
      document.getElementById("hk-begin").disabled = true;
      session.mic = hasMicApi ? await hskkOpenMic() : null;
      if (hskkSession !== session) {
        hskkCloseMic(session.mic);
        return;
      }
      prep();
    };
  }

  function prepMaterials() {
    return paper.parts.slice(1).map((p, offset) => `
      <div class="hk-prep-part"><p class="hk-part-label"><b lang="zh-CN">${HSKK_PART_ZH[p.part]}</b> · ${ht(p.kind)}</p>
        ${p.items.map((it) => promptHtml(p.kind, it, true)).join("")}</div>`).join("");
  }

  function prep() {
    session.phase = "prep";
    view.innerHTML = `
      <div class="card hk-prep">
        <p class="eyebrow">${levelName}</p>
        <div class="row hk-prep-head"><h1>${ht("prepTitle")}</h1><span class="spacer"></span><span class="hk-clock" id="hk-clock">${clock(paper.prep * 60)}</span></div>
        <p class="small muted">${ht("prepLead")}</p>
        ${prepMaterials()}
        <button class="btn block" id="hk-ready">${ht("prepReady")}</button>
      </div>`;
    const clockEl = document.getElementById("hk-clock");
    countdown(paper.prep * 60, (left) => {
      clockEl.textContent = clock(left);
    }, () => showItem());
    document.getElementById("hk-ready").onclick = () => showItem();
  }

  // What the learner sees for an item. Listening items hide the text until the review.
  function promptHtml(kind, it, inPrep = false) {
    const pinyin = levelId === "beginner" ? `<span class="ex-py">${esc(it.py)}</span>` : "";
    if (kind === "picture") {
      return `<div class="hk-scene" role="img" aria-label="${esc(it[lang])}">${it.pics.map((p) => pictureSvg(p, inPrep ? 52 : 64)).join("")}</div>
        <p class="hk-q">${pinyin}<span lang="zh-CN">${esc(it.zh)}</span></p>`;
    }
    if (kind === "read") {
      return `<p class="hk-passage" lang="zh-CN">${esc(it.zh)}</p>`;
    }
    if (kind === "open") {
      return `<p class="hk-q">${pinyin}<span lang="zh-CN">${esc(it.zh)}</span></p>`;
    }
    return `<div class="hk-listen">${icon("listen", 28)}<span>${ht("listening")}</span></div>`;
  }

  function showItem() {
    clearInterval(session.timer);
    session.phase = "item";
    const p = part();
    const it = item();
    const n = session.itemIndex + 1;
    view.innerHTML = `
      <div class="card hk-item">
        <p class="eyebrow">${levelName} · ${ht("part")} ${p.part} · ${n} ${ht("of")} ${p.items.length}</p>
        <h2 class="hk-part-title"><span lang="zh-CN">${HSKK_PART_ZH[p.part]}</span> · ${ht(p.kind)}</h2>
        <p class="small muted tight">${insFor(p.kind)}</p>
        <div class="hk-prompt" id="hk-prompt">${promptHtml(p.kind, it)}</div>
        <div class="hk-rec" id="hk-rec" aria-live="polite">
          <span class="hk-dot" aria-hidden="true"></span><span id="hk-status">${ht("listening")}</span>
          <span class="spacer"></span><span class="hk-clock" id="hk-clock">${clock(it.sec)}</span>
        </div>
        <div class="hk-meter" aria-hidden="true"><i id="hk-meter"></i></div>
        <button class="btn ghost block" id="hk-next" disabled>${ht("next")}</button>
      </div>`;
    const listenFirst = ["repeat", "answer", "retell"].includes(p.kind) || (p.kind === "open" && levelId === "beginner");
    if (listenFirst) {
      play(it.zh, () => speak());
    } else {
      document.getElementById("hk-status").textContent = ht("getReady");
      setTimeout(() => speak(), 1500 * speed);
    }
  }

  function speak() {
    if (hskkSession !== session || session.phase !== "item") {
      return;
    }
    const p = part();
    const it = item();
    const k = key();
    const rec = document.getElementById("hk-rec");
    const status = document.getElementById("hk-status");
    const clockEl = document.getElementById("hk-clock");
    const meterEl = document.getElementById("hk-meter");
    const nextBtn = document.getElementById("hk-next");
    if (!rec) {
      return;
    }
    rec.classList.add("on");
    status.textContent = session.mic ? ht("speakNow") : ht("noMicTake");
    nextBtn.disabled = false;
    const target = p.kind === "repeat" || p.kind === "read" ? it.zh : "";
    session.take = hskkStartTake(session.mic, target, (level) => {
      meterEl.style.width = `${Math.round(level * 100)}%`;
    });
    let finished = false;
    const done = async () => {
      if (finished) {
        return;
      }
      finished = true;
      clearInterval(session.timer);
      const take = session.take;
      session.take = null;
      const result = take ? await take.stop() : null;
      if (hskkSession !== session) {
        return;
      }
      if (result) {
        session.takes[k] = { ...result, sec: it.sec };
        const suggestion = hskkSuggestRating(p.kind, result);
        if (suggestion !== null) {
          session.ratings[k] = suggestion;
          session.suggested[k] = true;
        }
      }
      advance();
    };
    nextBtn.onclick = done;
    countdown(it.sec, (left) => {
      clockEl.textContent = clock(left);
    }, done);
  }

  function advance() {
    if (session.itemIndex < part().items.length - 1) {
      session.itemIndex += 1;
    } else if (session.partIndex < paper.parts.length - 1) {
      session.partIndex += 1;
      session.itemIndex = 0;
    } else {
      review();
      return;
    }
    showItem();
  }

  function ratingButtons(kind, k) {
    const labels = hskkMaxRating(kind) === 2 ? ht("r2") : ht("r4");
    return `<div class="seg seg-small hk-rate" role="radiogroup" aria-label="${ht("rated")}">${labels.map((label, v) => `<button class="seg-btn ${session.ratings[k] === v ? "on" : ""}" role="radio" aria-checked="${session.ratings[k] === v}" data-rate="${k}" data-v="${v}">${label}</button>`).join("")}</div>`;
  }

  function reviewItemHtml(p, partIdx, it, i) {
    const k = key(partIdx, i);
    const take = session.takes[k];
    const metrics = take ? [
      `<span class="pill tiny">${ht("spoke")} ${take.voiced}/${take.sec} ${ht("sec")}</span>`,
      typeof take.match === "number" ? `<span class="pill tiny">${ht("match")} ${Math.round(take.match * 100)}%</span>` : "",
      session.suggested[k] ? `<span class="muted tiny">${ht("suggested")}</span>` : "",
    ].join(" ") : "";
    const model = it.model ? `<details class="hk-model"><summary>${ht("modelAnswer")}</summary>
        <p><span class="ex-py">${esc(it.model_py)}</span><span lang="zh-CN">${esc(it.model)}</span></p></details>` : "";
    const scene = p.kind === "picture" ? `<div class="hk-scene small">${it.pics.map((pic) => pictureSvg(pic, 36)).join("")}</div>` : "";
    return `<li class="hk-rev-item" id="hk-rev-${k}">
      ${scene}
      ${it.zh.length > 40
        ? `<details class="hk-rev-long"><summary><span lang="zh-CN">${esc(it.zh.slice(0, 14))}…</span> <span class="muted small">${ht("showText")}</span></summary>
            <p class="hk-rev-text"><span class="ex-py">${esc(it.py)}</span><span lang="zh-CN">${esc(it.zh)}</span><span class="muted small">${esc(it[lang])}</span></p></details>`
        : `<p class="hk-rev-text"><span class="ex-py">${esc(it.py)}</span><span lang="zh-CN">${esc(it.zh)}</span><span class="muted small">${esc(it[lang])}</span></p>`}
      ${model}
      <div class="row hk-rev-audio">
        <button class="btn ghost small" data-model="${k}">${icon("sound", 16)} ${ht("model")}</button>
        ${take && take.url ? `<audio controls preload="none" src="${take.url}" aria-label="${ht("yourTake")}"></audio>` : `<span class="muted small">${ht("noTake")}</span>`}
      </div>
      <div class="row hk-rev-foot">${metrics}<span class="spacer"></span>${ratingButtons(p.kind, k)}</div>
    </li>`;
  }

  function unrated() {
    let count = 0;
    paper.parts.forEach((p, partIdx) => p.items.forEach((_it, i) => {
      if (typeof session.ratings[key(partIdx, i)] !== "number") {
        count += 1;
      }
    }));
    return count;
  }

  function review() {
    clearInterval(session.timer);
    session.phase = "review";
    hskkCloseMic(session.mic);
    session.mic = null;
    document.body.classList.remove("exam-focus");
    const total = paper.parts.reduce((sum, p) => sum + p.items.length, 0);
    view.innerHTML = `
      <p class="eyebrow">${levelName}</p>
      <h1>${ht("reviewTitle")}</h1>
      <p class="muted lead">${ht("reviewLead")}</p>
      ${paper.parts.map((p, partIdx) => {
        const max = hskkMaxRating(p.kind);
        return `<section class="card hk-review-part">
          <div class="row"><h2 class="h3"><span lang="zh-CN">${HSKK_PART_ZH[p.part]}</span> · ${ht(p.kind)}</h2><span class="spacer"></span>
            <button class="btn ghost small" data-fill="${partIdx}" data-v="${max}">${ht("fillAll")}: ${(max === 2 ? ht("r2") : ht("r4"))[max]}</button></div>
          <details class="hk-rubric"><summary class="small">${ht("rubricHow")}</summary><p class="small muted tight">${max === 2 ? ht("rubric2") : ht("rubric4")}</p></details>
          <ol class="hk-rev-list">${p.items.map((it, i) => reviewItemHtml(p, partIdx, it, i)).join("")}</ol>
        </section>`;
      }).join("")}
      <div class="card hk-review-foot">
        <span id="hk-rated">${total - unrated()} / ${total} ${ht("rated")}</span><span class="spacer"></span>
        <button class="btn" id="hk-score">${ht("seeScore")}</button>
      </div>`;
    const refresh = () => {
      const left = unrated();
      document.getElementById("hk-rated").textContent = `${total - left} / ${total} ${ht("rated")}`;
      const btn = document.getElementById("hk-score");
      btn.disabled = left > 0;
      btn.title = left > 0 ? ht("needRate") : "";
    };
    view.onclick = (event) => {
      const rate = event.target.closest("[data-rate]");
      const fill = event.target.closest("[data-fill]");
      const model = event.target.closest("[data-model]");
      if (rate) {
        session.ratings[rate.dataset.rate] = Number(rate.dataset.v);
        delete session.suggested[rate.dataset.rate];
        rate.parentElement.querySelectorAll(".seg-btn").forEach((b) => {
          const on = b === rate;
          b.classList.toggle("on", on);
          b.setAttribute("aria-checked", String(on));
        });
        refresh();
      } else if (fill) {
        // Only fills the answers not rated yet, so a careful rating is never overwritten.
        const partIdx = Number(fill.dataset.fill);
        paper.parts[partIdx].items.forEach((_it, i) => {
          const k = key(partIdx, i);
          if (typeof session.ratings[k] !== "number") {
            session.ratings[k] = Number(fill.dataset.v);
            const group = document.querySelector(`#hk-rev-${k} .hk-rate`);
            if (group) {
              group.querySelectorAll(".seg-btn").forEach((b) => {
                const on = Number(b.dataset.v) === session.ratings[k];
                b.classList.toggle("on", on);
                b.setAttribute("aria-checked", String(on));
              });
            }
          }
        });
        refresh();
      } else if (model) {
        const [partIdx, i] = model.dataset.model.split("-").map(Number);
        const it = paper.parts[partIdx].items[i];
        stopAudio();
        play(it.model || it.zh, () => {});
      }
    };
    document.getElementById("hk-score").onclick = () => {
      if (unrated() === 0) {
        result();
      }
    };
    refresh();
  }

  function result() {
    view.onclick = null;
    session.phase = "result";
    const score = hskkScore(paper, session.ratings);
    // Weakest part by share of its points; ties go to the earlier part (it comes first in the test).
    const weakIndex = paper.parts.reduce((best, p, i) => (score.parts[i] / p.points < score.parts[best] / paper.parts[best].points ? i : best), 0);
    const weakPart = paper.parts[weakIndex];
    state.hskkAttempts = [...(state.hskkAttempts || []), {
      level: levelId, date: Date.now(), total: score.total, passed: score.passed, parts: score.parts,
    }].slice(-20);
    addXP(Math.max(1, Math.round(score.total / 10)));
    saveState();
    view.innerHTML = `
      <div class="card center hk-result">
        ${typeof mascotSvg === "function" ? mascotSvg(score.passed ? "cheer" : "encourage", 72) : ""}
        <p class="eyebrow">${levelName}</p>
        <h1>${ht("resultTitle")}</h1>
        <div class="hk-score"><b>${score.total}</b><span>/ 100</span></div>
        <span class="pill ${score.passed ? "green" : ""}">${score.passed ? ht("pass") : ht("fail")} · ${ht("passLine")} 60</span>
        <ul class="hk-part-scores">${paper.parts.map((p, i) => `<li><span><span lang="zh-CN">${HSKK_PART_ZH[p.part]}</span> · ${ht(p.kind)}</span>
          <span class="hk-bar"><i style="width:${Math.round((score.parts[i] / p.points) * 100)}%"></i></span><b>${score.parts[i]}</b><span class="muted small">/ ${p.points}</span></li>`).join("")}</ul>
        <p class="small muted">${ht("resultNote")}</p>
      </div>
      <section class="card hk-focus">
        <p class="eyebrow">${ht("focusTitle")}</p>
        <h2 class="h3"><span lang="zh-CN">${HSKK_PART_ZH[weakPart.part]}</span> · ${ht(weakPart.kind)} <span class="muted small">${score.parts[weakIndex]} / ${weakPart.points}</span></h2>
        <p class="small">${ht("focus_" + weakPart.kind)}</p>
        <a class="btn ghost small" href="#talk">${icon("mic", 16)} ${ht("practiceTalk")}</a>
      </section>
      ${typeof guideNextHtml === "function" ? guideNextHtml() : ""}
      <div class="row hk-result-actions">
        <a class="btn-text" href="#exam" id="hk-back">${ht("back2")}</a>
        <button class="btn-text" id="hk-again">${icon("restart", 14)} ${ht("again2")}</button>
      </div>`;
    document.getElementById("hk-again").onclick = () => hskkRun(levelId, opts);
  }

  session.controls = {
    begin: () => {
      session.mic = null;
      prep();
    },
    ready: () => showItem(),
    next: () => {
      const btn = document.getElementById("hk-next");
      if (btn && !btn.disabled) {
        btn.click();
      }
    },
    review: () => review(),
    rateAll: (value) => {
      paper.parts.forEach((p, partIdx) => p.items.forEach((_it, i) => {
        session.ratings[key(partIdx, i)] = Math.min(value, hskkMaxRating(p.kind));
      }));
    },
  };
  intro();
  return session;
}
