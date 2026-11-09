/* Nadaku self-tests — run with index.html?test=1 (headless Chrome in CI). */
"use strict";

(async function runSelfTests() {
  const results = [];
  const check = (name, condition, detail = "") => {
    results.push({ name, pass: Boolean(condition), detail: String(detail) });
    console.log(`CHECK ${results.length} ${condition ? "PASS" : "FAIL"} ${name}`);
  };
  const HAN = /[\u4e00-\u9fff]/g;

  // ---------- v4: personal schedule (maximum-likelihood stability scale) ----------
  {
    const rng = seededRng(42);
    const synthetic = (trueScale, count) => {
      const log = [];
      for (let i = 0; i < count; i += 1) {
        const base = 0.5 + rng() * 0.49;
        const x = Math.pow(base, -2) - 1;
        const personal = Math.pow(1 + x / trueScale, -0.5);
        log.push([i, "我", rng() < personal ? 3 : 1, personal, base]);
      }
      return log;
    };
    const weak = fitStabilityScale(synthetic(0.6, 800));
    check("personal schedule: recovers a weaker memory (true 0.60×) from 800 reviews", Math.abs(weak.k - 0.6) < 0.12 && weak.after < weak.before, `k=${weak.k.toFixed(3)} raw=${weak.raw.toFixed(3)} loss ${weak.before.toFixed(3)}→${weak.after.toFixed(3)}`);
    const typical = fitStabilityScale(synthetic(1, 800));
    check("personal schedule: stays near 1.0× for a learner who matches the model", typical.k > 0.85 && typical.k < 1.15, `k=${typical.k.toFixed(3)}`);
    const tiny = fitStabilityScale(synthetic(0.4, 30));
    check("personal schedule: needs ≥ 50 reviews before changing anything", tiny.k === 1 && tiny.n === 30, `n=${tiny.n} k=${tiny.k}`);
    const keepScale = state.stabilityScale;
    const now = Date.UTC(2026, 0, 1);
    const mature = { s: 30, d: 5, reps: 4, lapses: 0, last: now - 30 * DAY, due: now };
    state.stabilityScale = 1;
    const standard = schedule(mature, 3, now).due - now;
    state.stabilityScale = 2;
    const stronger = schedule(mature, 3, now).due - now;
    state.stabilityScale = keepScale;
    check("personal schedule: a 2× stronger memory gets ~2× longer intervals", Math.abs(stronger / standard - 2) < 0.05, `${Math.round(standard / DAY)}d → ${Math.round(stronger / DAY)}d`);
  }

  // ---------- v4: tone sandhi when joining native syllable recordings ----------
  {
    const composed = VOCAB.filter((w) => typeof w.audio === "string" && w.audio && syllablesOf(w).length >= 2);
    const threeThree = composed.filter((w) => toneOf(syllablesOf(w)[0]) === 3 && toneOf(syllablesOf(w)[1]) === 3 && w.audio.split("|")[0].startsWith("s/"));
    const wrong = threeThree.filter((w) => !/2~?$/.test(w.audio.split("|")[0]));
    check("tone sandhi: 3rd+3rd-tone words play the first syllable as 2nd tone", threeThree.length > 0 && wrong.length === 0, `${threeThree.length} words; wrong: ${wrong.slice(0, 4).map((w) => w.hanzi).join(" ")}`);
  }

  // ---------- v4: content for Indonesian speakers ----------
  {
    check("15 Hokkien→Indonesian loanwords, each with source, Mandarin, pinyin and meaning", LOANWORDS.length === 15 && LOANWORDS.every((w) => w.indo && w.src && w.hok && w.zh && w.py && w.id && w.en), LOANWORDS.length);
    const pinyinMismatch = LOANWORDS.filter((w) => {
      const word = BY_HANZI.get(w.zh);
      return (word && word.pinyin !== w.py) || w.py.split(" ").length !== [...w.zh].length;
    });
    check("loanword pinyin matches the HSK list and has one syllable per character", pinyinMismatch.length === 0, pinyinMismatch.map((w) => w.indo).join(" "));
    const unplayable = LOANWORDS.filter((w) => !(BY_HANZI.get(w.zh)?.audio || SENTENCE_AUDIO[w.zh]));
    check("every loanword can be played offline with native audio", unplayable.length === 0, unplayable.map((w) => w.zh).join(" "));
    const trapWords = PINYIN_TRAPS.flatMap((trap) => trap.words);
    const missingTrap = trapWords.filter((h) => !BY_HANZI.get(h)?.audio);
    check("11 pinyin traps; every example word is an HSK word with native audio", PINYIN_TRAPS.length === 11 && missingTrap.length === 0, missingTrap.join(" "));
  }

  // ---------- v4: badges ----------
  {
    const keepCards = state.cards;
    state.cards = Object.fromEntries(VOCAB.slice(0, 12).map((w) => [w.hanzi, { s: 1, d: 5, reps: 1, lapses: 0, last: Date.now(), due: Date.now() }]));
    const earned = earnedBadges();
    state.cards = keepCards;
    check("badges: learning 12 words earns the 10-word badge (and not the 50)", earned.includes("words-10") && !earned.includes("words-50"), earned.join(","));
  }

  // ---------- Data integrity ----------
  check("5,363 HSK 3.0 words (levels 1-6)", VOCAB.length === 5363, VOCAB.length);
  const levelCounts = LEVELS.map((lv) => wordsAtLevel(lv).length).join(",");
  check("level sizes match HSK 3.0 (506,750,953,972,1059,1123)", levelCounts === "506,750,953,972,1059,1123", levelCounts);
  const misaligned = VOCAB.filter((w) => (w.hanzi.match(HAN) || []).length !== syllablesOf(w).length);
  check("every word: characters == pinyin syllables", misaligned.length === 0, misaligned.slice(0, 5).map((w) => w.hanzi).join(" "));
  const multiMark = VOCAB.filter((w) => syllablesOf(w).some((s) => [...s.normalize("NFC")].filter((c) => TONE_MARKS[c.toLowerCase()]).length > 1));
  check("every syllable has at most one tone mark", multiMark.length === 0, multiMark.slice(0, 5).map((w) => w.hanzi).join(" "));
  check("hanzi are unique", new Set(VOCAB.map((w) => w.hanzi)).size === VOCAB.length);
  const noGloss = VOCAB.filter((w) => !w.id || !w.en);
  check("every word has Indonesian + English gloss", noGloss.length === 0, noGloss.slice(0, 5).map((w) => w.hanzi).join(" "));
  const junk = VOCAB.filter((w) => /^(?:\(?marga|varian|nama keluarga|singkatan|lihat )/i.test(w.id) || /^(?:varian|singkatan|lihat)(?: dari)?$/i.test(w.id));
  check("no surname/variant/truncated glosses (common-sense meaning first)", junk.length === 0, junk.slice(0, 6).map((w) => `${w.hanzi}:${w.id}`).join(" | "));
  const coreSense = { 时: "waktu", 过: "lewat", 中: "dalam", 车: "mobil", 高: "tinggi", 被: "pasif", 新: "baru" };
  const wrongSense = Object.entries(coreSense).filter(([h, k]) => !BY_HANZI.get(h).id.includes(k));
  check("core words carry their everyday meaning (spot check of 7)", wrongSense.length === 0, wrongSense.map(([h]) => `${h}:${BY_HANZI.get(h).id}`).join(" | "));
  const noAudio = VOCAB.filter((w) => !w.audio);
  check("every word has an offline native-audio plan", noAudio.length === 0, `${noAudio.length} missing: ${noAudio.slice(0, 8).map((w) => w.hanzi).join(" ")}`);
  const recorded = VOCAB.filter((w) => w.audio === 1).length;
  check("≥ 75% of words have a whole-word native recording", recorded / VOCAB.length >= 0.75, `${recorded}/${VOCAB.length}`);
  check("every example belongs to a vocab word", Object.keys(EXAMPLES).every((k) => BY_HANZI.has(k)));
  check("≥ 100 example sentences with Indonesian translation", Object.values(EXAMPLES).filter((e) => e[2]).length >= 100, Object.keys(EXAMPLES).length);
  const sentenceTexts = [...Object.values(EXAMPLES).map((e) => e[0]), ...SCENARIOS.flatMap((s) => [s.end[0], ...s.steps.flatMap((st) => [st.bot[0], ...st.replies.map((r) => r.zh)])])];
  const noPlan = sentenceTexts.filter((s) => !SENTENCE_AUDIO[s]);
  check("every sentence has an offline syllable-audio plan", noPlan.length === 0, noPlan.slice(0, 3).join(" | "));
  check("every roleplay step has exactly 1 correct reply of 3", SCENARIOS.every((s) => s.steps.every((st) => st.replies.length === 3 && st.replies.filter((r) => r.ok).length === 1)));

  // ---------- Tone parsing ----------
  check("toneOf: mā má mǎ mà ma → 1 2 3 4 5", ["mā", "má", "mǎ", "mà", "ma"].map(toneOf).join() === "1,2,3,4,5");
  check("toneOf handles ü (nǚ=3, lǜ=4)", toneOf("nǚ") === 3 && toneOf("lǜ") === 4);
  check("stripTone: Zhōng→Zhong, nǚ→nü", stripTone("Zhōng") === "Zhong" && stripTone("nǚ") === "nü");

  // ---------- FSRS-4.5 ----------
  const t0 = Date.UTC(2026, 0, 1);
  const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;
  check("R(t = S) = 90% exactly (FSRS forgetting curve)", near(fsrsRetrievability(5, 5), 0.9));
  check("interval at 90% target retention equals stability", near(fsrsInterval(7.3), 7.3));
  const g1 = schedule(null, 3, t0);
  check("new card + Good → S = w2 = 3.7145, due in 4 days", near(g1.s, 3.7145) && g1.due === t0 + 4 * DAY, `S=${g1.s}`);
  check("new card initial difficulty D0(Good) = w4 = 5.1618", near(g1.d, 5.1618));
  const g2 = schedule(g1, 3, g1.due);
  check("second Good grows stability (S2 > S1)", g2.s > g1.s * 1.5, `S2=${g2.s.toFixed(2)}`);
  const lapse = schedule(g2, 1, g2.due);
  check("Again → relearn in 10 min, lapse counted, stability drops", lapse.due - g2.due === 10 * MINUTE && lapse.lapses === 1 && lapse.s < g2.s);
  const hard = schedule(g2, 2, g2.due);
  const good = schedule(g2, 3, g2.due);
  const easy = schedule(g2, 4, g2.due);
  check("stability order after review: Hard < Good < Easy", hard.s < good.s && good.s < easy.s, `${hard.s.toFixed(1)} < ${good.s.toFixed(1)} < ${easy.s.toFixed(1)}`);
  let walk = g1;
  const rng = seededRng(3);
  let dOk = true;
  for (let i = 0; i < 200; i += 1) {
    walk = schedule(walk, 1 + Math.floor(rng() * 4), walk.due + rng() * 3 * DAY);
    dOk = dOk && walk.d >= 1 && walk.d <= 10 && walk.s > 0 && Number.isFinite(walk.s);
  }
  check("difficulty stays in [1,10] and stability finite over 200 random reviews", dOk);
  check("retention decays monotonically", retention(g2, g2.due + DAY) < retention(g2, g2.due) && retention(g2, g2.last) === 1);

  // Consistency simulation: if memory truly follows the model, reviewing on schedule yields ≈90% recall.
  {
    const sim = seededRng(11);
    let reviews = 0;
    let recalled = 0;
    for (let c = 0; c < 400; c += 1) {
      let card = schedule(null, 3, 0);
      while (card.due < 180 * DAY) {
        const now = card.due;
        const p = retention(card, now);
        const ok = sim() < p;
        reviews += 1;
        recalled += ok ? 1 : 0;
        card = schedule(card, ok ? 3 : 1, now);
        if (!ok) {
          card = schedule(card, 3, card.due);
        }
      }
    }
    const rate = recalled / reviews;
    check("simulation: scheduled reviews hit the 90% retention target (±3%)", Math.abs(rate - 0.9) < 0.03, `${(rate * 100).toFixed(1)}% over ${reviews} reviews`);
  }

  // ---------- Calibration ----------
  {
    const sim = seededRng(5);
    const goodLog = [];
    const badLog = [];
    for (let i = 0; i < 4000; i += 1) {
      const p = 0.4 + 0.6 * sim();
      goodLog.push([i, "我", sim() < p ? 3 : 1, p]);
      badLog.push([i, "我", sim() < 0.7 ? 3 : 1, 0.96]);
    }
    const goodCal = calibration(goodLog);
    const badCal = calibration(badLog);
    check("calibration: well-calibrated log → ECE < 3%", goodCal.ece < 0.03, `${(goodCal.ece * 100).toFixed(1)}%`);
    check("calibration: over-confident log → ECE > 20%", badCal.ece > 0.2, `${(badCal.ece * 100).toFixed(1)}%`);
  }

  // ---------- Pitch tracking & tone classification ----------
  {
    const sr = 16000;
    const synth = (contour, seconds = 0.6, noise = 0.02) => {
      const n = Math.floor(sr * seconds);
      const out = new Float32Array(n);
      const nrng = seededRng(9);
      let phase = 0;
      for (let i = 0; i < n; i += 1) {
        const f = contour(i / n);
        phase += (2 * Math.PI * f) / sr;
        out[i] = 0.5 * Math.sin(phase) + 0.25 * Math.sin(2 * phase) + 0.12 * Math.sin(3 * phase) + noise * (nrng() - 0.5);
      }
      return out;
    };
    const flat = synth(() => 220);
    const est = detectPitch(flat.subarray(2000, 3024), sr);
    check("pitch detector: 220 Hz tone estimated within 2%", Math.abs(est - 220) / 220 < 0.02, `${est.toFixed(1)} Hz`);
    const tones = {
      1: (x) => 240 + 4 * Math.sin(x * 6),
      2: (x) => 170 + 110 * x,
      3: (x) => 210 - 260 * x * (1 - x) * 1.6 + 40 * x,
      4: (x) => 300 - 150 * x,
    };
    const got = [1, 2, 3, 4].map((tn) => classifyTone(pitchTrack(synth(tones[tn]), sr)).tone);
    check("tone classifier: synthetic tones 1-4 recognised", got.join() === "1,2,3,4", `got ${got.join(",")}`);
    const male = [1, 2, 3, 4].map((tn) => classifyTone(pitchTrack(synth((x) => tones[tn](x) * 0.55), sr)).tone);
    check("tone classifier works for a low (male) voice too", male.join() === "1,2,3,4", `got ${male.join(",")}`);
    check("silence → no tone detected", classifyTone(pitchTrack(new Float32Array(sr), sr)).tone === 0);
  }

  // ---------- Stroke-order matching (real Make Me a Hanzi data) ----------
  {
    const data = await loadStrokes("我");
    check("stroke data loads offline for 我 (7 strokes)", data && data.s.length === 7, data ? data.s.length : "none");
    if (data) {
      check("each correct stroke (its median) is accepted", data.m.every((m) => strokeMatches(m, m)));
      const reversed = data.m.filter((m) => pathLength(m) > 200);
      check("strokes drawn backwards are rejected", reversed.every((m) => !strokeMatches([...m].reverse(), m)), `${reversed.length} long strokes`);
      let wrongAccepted = 0;
      for (let i = 0; i < data.m.length - 1; i += 1) {
        if (strokeMatches(data.m[i + 1], data.m[i])) {
          wrongAccepted += 1;
        }
      }
      check("next stroke drawn out of order is rejected", wrongAccepted === 0, `${wrongAccepted} accepted`);
      const shaky = data.m.map((m) => m.map(([x, y], k) => [x + 25 * Math.sin(k), y + 25 * Math.cos(k)]));
      check("slightly shaky handwriting is still accepted", shaky.every((m, i) => strokeMatches(m, data.m[i])));
      check("a scribble in the wrong corner is rejected", !strokeMatches([[50, 850], [120, 820], [60, 780]], data.m[0]));
    }
    const sample = ["永", "爱", "国", "谢", "鼻"];
    const loaded = await Promise.all(sample.map(loadStrokes));
    check("stroke data present for sample characters", loaded.every(Boolean), sample.filter((_, i) => !loaded[i]).join(""));
  }

  // ---------- Quiz generation, every level ----------
  for (const lv of LEVELS) {
    const quiz = generateQuiz(10, seededRng(40 + lv), lv, true);
    const okAnswer = quiz.every((q) => q.options.includes(q.answer));
    const distinct = quiz.every((q) => new Set(q.options).size === 4);
    const unambiguous = quiz.filter((q) => q.type !== "tone").every((q) => {
      const ids = q.options.map((o) => o.id);
      const ens = q.options.map((o) => o.en);
      const pys = q.options.map((o) => o.pinyin);
      return new Set(ids).size === 4 && new Set(ens).size === 4 && new Set(pys).size === 4;
    });
    check(`HSK ${lv} quiz: 10 questions, answer present, 4 distinct unambiguous options`, quiz.length === 10 && okAnswer && distinct && unambiguous);
  }

  // ---------- Shadowing (offline speaking) ----------
  {
    const sr = 16000;
    const speech = new Float32Array(sr);
    let phase = 0;
    for (let i = 0; i < sr; i += 1) {
      phase += (2 * Math.PI * (200 + 40 * i / sr)) / sr;
      speech[i] = i > sr * 0.2 && i < sr * 0.8 ? 0.4 * Math.sin(phase) + 0.15 * Math.sin(2 * phase) : 0;
    }
    const voiced = voicedSeconds(speech, sr);
    check("shadowing: voiced-speech length measured within 0.1 s (0.6 s tone in 1 s clip)", Math.abs(voiced - 0.6) < 0.1, `${voiced.toFixed(2)} s`);
    const wav = encodeWav(speech, sr);
    check("shadowing: recording encoded as playable 16-bit WAV", wav.size === 44 + sr * 2 && wav.type === "audio/wav", wav.size);
    check("speech recognition is opt-in (off by default → no network use)", defaultState().onlineSpeech === false);
  }

  // ---------- Screens, writing flow, accessibility ----------
  const saved = JSON.stringify(state);
  seedDemo();
  const screenErrors = [];
  const unnamed = [];
  for (const screen of ["home", "vocab", "learn", "review", "tones", "tones/speak", "write/我", "talk", "talk/1", "exam", "stats", "me", "indo"]) {
    try {
      location.hash = screen;
      route();
      if (!view.innerHTML.trim()) {
        screenErrors.push(`${screen}: empty`);
      }
      document.querySelectorAll("button, a").forEach((el) => {
        const name = (el.getAttribute("aria-label") || el.textContent || "").trim();
        if (!name) {
          unnamed.push(`${screen}:${el.id || el.className}`);
        }
      });
      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        screenErrors.push(`${screen}: horizontal overflow`);
      }
    } catch (err) {
      screenErrors.push(`${screen}: ${err.message}`);
    }
  }
  check("all 13 screens render without errors or horizontal overflow", screenErrors.length === 0, screenErrors.join("; "));
  check("every button and link has an accessible name", unnamed.length === 0, unnamed.slice(0, 5).join(", "));
  const untagged = [];
  for (const screen of ["vocab", "learn", "talk/0", "exam"]) {
    location.hash = screen;
    route();
    const walker = document.createTreeWalker(view, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (/[\u4e00-\u9fff]/.test(node.textContent) && !node.parentElement.closest('[lang="zh-CN"]')) {
        untagged.push(`${screen}: ${node.textContent.trim().slice(0, 12)}`);
      }
    }
  }
  check("all visible Chinese text is marked lang=zh-CN for screen readers", untagged.length === 0, untagged.slice(0, 4).join(" | "));

  // writing flow end-to-end with real strokes
  location.hash = "write/我";
  route();
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (window.__writeTest) {
    const { data, submitStroke } = window.__writeTest;
    submitStroke([[500, 500], [510, 505]]);
    data.m.forEach((m) => submitStroke(m));
    const st = window.__writeTest.state();
    check("writing flow: wrong stroke counted, then all 7 strokes accepted in order", st.strokeIndex === 7 && st.misses === 1 && st.firstTry === 6, JSON.stringify(st));
  } else {
    check("writing flow: wrong stroke counted, then all 7 strokes accepted in order", false, "writer did not load");
  }

  // colour contrast (WCAG AA 4.5:1 for normal text)
  const lum = (hex) => {
    const c = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  const pairs = [["--muted", "--bg"], ["--muted", "--card"], ["--ink", "--bg"], ["#ffffff", "--red"], ["#ffffff", "--ink"], ["#ffffff", "#b45309"], ["#ffffff", "#b91c1c"], ["#ffffff", "#1f7a4c"], ["#ffffff", "#2a50a8"], ["--red", "#fff1ea"]];
  const lowContrast = pairs.map(([a, b]) => [a, b, ratio(a.startsWith("#") ? a : v(a), b.startsWith("#") ? b : v(b))]).filter(([, , r]) => r < 4.5);
  check("text colour pairs meet WCAG AA (≥ 4.5:1)", lowContrast.length === 0, lowContrast.map(([a, b, r]) => `${a}/${b}=${r.toFixed(2)}`).join(", "));

  // dark theme contrast
  document.documentElement.dataset.theme = "dark";
  const darkCss = getComputedStyle(document.documentElement);
  const dv = (name) => darkCss.getPropertyValue(name).trim();
  const darkPairs = [["--ink", "--bg"], ["--ink", "--card"], ["--muted", "--bg"], ["--muted", "--card"], ["--red", "--card"], ["--red-dark", "--soft"], ["--ok-ink", "--ok-bg"], ["--blue-ink", "--blue-bg"], ["#ffffff", "--solid"], ["--ink", "--surface"]];
  const darkLow = darkPairs.map(([a, b]) => [a, b, ratio(a.startsWith("#") ? a : dv(a), b.startsWith("#") ? b : dv(b))]).filter(([, , r]) => r < 4.5);
  delete document.documentElement.dataset.theme;
  applyTheme();
  check("dark theme: text colour pairs meet WCAG AA (≥ 4.5:1)", darkLow.length === 0, darkLow.map(([a, b, r]) => `${a}/${b}=${r.toFixed(2)}`).join(", "));

  // ---------- v5: Tatoeba examples, reading fixes, mascot, pilot tone log ----------
  {
    const keys = Object.keys(TATOEBA);
    check("Tatoeba: ≥ 3,500 HSK words have a real example sentence", keys.length >= 3500, keys.length);
    const badLevel = [];
    const badJoin = [];
    const badPinyin = [];
    let rowCount = 0;
    for (const [hanzi, rows] of Object.entries(TATOEBA)) {
      const target = BY_HANZI.get(hanzi);
      for (const row of rows) {
        rowCount += 1;
        const tokens = row[5].split(" ");
        if (!target || !tokens.includes(hanzi) || tokens.some((tok) => !BY_HANZI.get(tok) || BY_HANZI.get(tok).level > target.level)) {
          badLevel.push(`${hanzi}:${row[0]}`);
        }
        if (tokens.join("") !== (row[0].match(HAN) || []).join("")) {
          badJoin.push(row[0]);
        }
        const flat = row[1].toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, "");
        const missing = tokens.filter((tok) => tok.length > 1 && !flat.includes(BY_HANZI.get(tok).pinyin.toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, "")));
        if (missing.length) {
          badPinyin.push(`${row[0]}(${missing.join(",")})`);
        }
      }
    }
    check(`Tatoeba: every sentence uses only HSK words at or below the target word's level (${rowCount} rows)`, badLevel.length === 0, badLevel.slice(0, 4).join(" | "));
    check("Tatoeba: word segmentation covers every character of the sentence", badJoin.length === 0, badJoin.slice(0, 4).join(" | "));
    check("Tatoeba: sentence pinyin contains each multi-character word's verified pinyin", badPinyin.length === 0, badPinyin.slice(0, 4).join(" | "));
    const noCredit = Object.values(TATOEBA).flat().filter((row) => !(row[4] > 0) || !(row[2] || row[3]));
    check("Tatoeba: every row keeps its sentence id (attribution) and a translation", noCredit.length === 0, noCredit.length);

    const ex = exampleFor(BY_HANZI.get("该"));
    check("exampleFor falls back to Tatoeba when there is no hand-written example", ex && ex[4] > 0 && ex[0].includes("该"), ex && ex[0]);
    const hand = Object.keys(EXAMPLES)[0];
    check("exampleFor prefers the hand-written example", exampleFor(BY_HANZI.get(hand))[0] === EXAMPLES[hand][0], hand);

    const sample = Object.values(TATOEBA).flat().slice(0, 300);
    const unvoiced = sample.filter((row) => !composedSentencePlan(row[0]));
    check("Tatoeba sentences get native audio chained from their words (300 sampled)", unvoiced.length === 0, unvoiced.slice(0, 3).map((r) => r[0]).join(" "));

    const allRows = Object.values(TATOEBA).flat();
    const noIndonesian = allRows.filter((row) => !row[2]);
    const machineRows = allRows.filter((row) => row[6] === 1);
    check("every example sentence has an Indonesian translation (human first, machine ones flagged)", noIndonesian.length === 0 && machineRows.length > 0 && machineRows.length < allRows.length, `${allRows.length - machineRows.length} human, ${machineRows.length} MT, ${noIndonesian.length} missing`);
    const keepLang = state.lang;
    state.lang = "id";
    const mtHtml = exampleTranslation(machineRows[0]);
    const humanHtml = exampleTranslation(allRows.find((row) => row[2] && row[6] !== 1));
    state.lang = keepLang;
    check("machine-translated Indonesian is labelled MT, human translations are not", mtHtml.includes(">MT<") && !humanHtml.includes(">MT<"), mtHtml.slice(0, 80));
  }
  {
    const expected = { "没": ["méi", ""], "吧": ["ba", ""], "行": ["xíng", ""], "雨": ["yǔ", "hujan"], "胖": ["pàng", "gemuk"], "重": ["zhòng", "berat"], "老公": ["lǎo gōng", "suami"] };
    const wrong = Object.entries(expected).filter(([h, [py, idWord]]) => {
      const word = BY_HANZI.get(h);
      return !word || word.pinyin !== py || (idWord && !word.id.includes(idWord));
    });
    check("v5 reading fixes: 没 méi, 吧 ba, 行 xíng, 雨 yǔ (hujan), 胖 pàng, 重 zhòng, 老公 suami", wrong.length === 0, wrong.map(([h]) => `${h}:${BY_HANZI.get(h)?.pinyin}/${BY_HANZI.get(h)?.id}`).join(" | "));
    check("老公 no longer glossed as 'eunuch'", !/eunuch|kasim/i.test(BY_HANZI.get("老公").en + BY_HANZI.get("老公").id), BY_HANZI.get("老公").en);
  }
  {
    const moods = ["happy", "cheer", "think", "encourage"];
    const host = document.createElement("div");
    host.innerHTML = moods.map((m) => mascotSvg(m, 48)).join("");
    const svgs = host.querySelectorAll("svg.mascot");
    check("mascot Nada renders an SVG for each of 4 moods", svgs.length === 4 && [...svgs].every((s) => s.getAttribute("aria-hidden") === "true"), svgs.length);
    const keepLang = state.lang;
    const lineKinds = ["welcome", "done", "perfect", "tryAgain", "noDue"];
    const empty = [];
    for (const lang of ["id", "en"]) {
      state.lang = lang;
      lineKinds.forEach((kind) => {
        if (MASCOT_LINES[lang][kind] && !mascotLine(kind)) {
          empty.push(`${lang}.${kind}`);
        }
      });
    }
    state.lang = keepLang;
    const kindsId = Object.keys(MASCOT_LINES.id).sort().join();
    const kindsEn = Object.keys(MASCOT_LINES.en).sort().join();
    check("mascot lines exist in both languages with the same moments", kindsId === kindsEn && empty.length === 0, `${kindsId} vs ${kindsEn} ${empty.join(" ")}`);
  }
  {
    const csv = toneLogCsv([[Date.UTC(2026, 0, 2), "妈", "ma1", 1, 1], [Date.UTC(2026, 0, 2, 0, 1), "马", "ma3", 3, 2]]);
    const rows = csv.split("\n");
    check("tone practice CSV: header + one row per attempt with a match flag", rows.length === 3 && rows[0].startsWith("timestamp,") && rows[1].endsWith(",1,1,1") && rows[2].endsWith(",3,2,0"), rows.join(" / "));
    const keepLog = state.toneLog;
    state.toneLog = new Array(TONE_LOG_MAX).fill([0, "妈", "ma1", 1, 1]);
    logToneAttempt(BY_HANZI.get("妈") || { hanzi: "妈", pinyin: "mā" }, 1, { tone: 1 });
    const capped = state.toneLog.length === TONE_LOG_MAX && state.toneLog[TONE_LOG_MAX - 1][1] === "妈" && state.toneLog[TONE_LOG_MAX - 1][0] > 0;
    state.toneLog = keepLog;
    check(`tone practice log is capped at ${TONE_LOG_MAX} attempts (oldest dropped)`, capped, "");
  }

  {
    // v6: professional UI, no emoji anywhere on screen
    const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{1F1E6}-\u{1F1FF}]/u;
    const routes = ["home", "vocab", "tones/hear", "tones/speak", "write", "talk", "exam", "me", "stats", "indo"];
    const keepHash = location.hash;
    const withEmoji = [];
    for (const r of routes) {
      location.hash = r;
      route();
      const visible = document.getElementById("app").innerText;
      const match = visible.match(EMOJI);
      if (match) {
        withEmoji.push(`${r}:${match[0]}`);
      }
    }
    location.hash = keepHash;
    check("no emoji on any of 10 screens (line icons only)", withEmoji.length === 0, withEmoji.join(" "));
    const twoChar = BY_HANZI.get("促进");
    const host = document.createElement("div");
    host.innerHTML = wordCardHtml(twoChar);
    const cells = host.querySelectorAll('.hanzi-big [class^="t"]');
    check("word card draws one practice-grid cell per character", cells.length === 2 && host.querySelector(".hanzi-big").dataset.len === "2", cells.length);
  }


  {
    // v7: HSK mock exam - paper structure, item validity, scoring, routes
    await loadExamData();
    const OFFICIAL = {
      1: { items: 40, minutes: { L: 15, R: 17 }, total: 200, pass: 120 },
      2: { items: 60, minutes: { L: 25, R: 22 }, total: 200, pass: 120 },
      3: { items: 80, minutes: { L: 35, R: 30, W: 15 }, total: 300, pass: 180 },
      4: { items: 100, minutes: { L: 30, R: 40, W: 25 }, total: 300, pass: 180 },
      5: { items: 100, minutes: { L: 30, R: 45, W: 40 }, total: 300, pass: 180 },
      6: { items: 101, minutes: { L: 35, R: 50, W: 45 }, total: 300, pass: 180 },
    };
    const structure = [];
    for (const level of LEVELS) {
      const want = OFFICIAL[level];
      const paper = flattenPaper(level);
      const items = paper.sections.reduce((sum, s) => sum + s.questions.length, 0);
      const minutes = Object.fromEntries(paper.sections.map((s) => [s.id, s.minutes]));
      const ok = items === want.items && JSON.stringify(minutes) === JSON.stringify(want.minutes)
        && paper.total === want.total && paper.pass === want.pass && paper.sections.length * 100 === want.total;
      if (!ok) {
        structure.push(`HSK${level}: ${items} items ${JSON.stringify(minutes)} ${paper.total}/${paper.pass}`);
      }
    }
    check("mock papers HSK 1-6 match the official HSK 2.0 item counts, section times and pass lines", structure.length === 0, structure.join(" | "));

    const invalid = [];
    const choiceCount = (q) => {
      const it = q.item;
      const b = q.block;
      return (it.opts || b.opts || it.pics || b.pics || b.bank || b.sents || []).length;
    };
    for (const level of LEVELS) {
      for (const q of flattenPaper(level).sections.flatMap((s) => s.questions)) {
        const it = q.item;
        const key = it.ans;
        const where = `HSK${level} #${q.n} ${q.kind}`;
        if (EXAM_SUBJECTIVE.has(q.kind)) {
          if (!(it.sample || it.samples)) {
            invalid.push(`${where}: no sample answer`);
          }
          continue;
        }
        if (key === undefined || key === null || key === "") {
          invalid.push(`${where}: no key`);
          continue;
        }
        if (typeof key === "number" && (key < 0 || key >= choiceCount(q))) {
          invalid.push(`${where}: key ${key} of ${choiceCount(q)}`);
        }
        for (const pic of [it.pic, ...(it.pics || []), ...(q.kind === "pic_match" ? q.block.pics : [])].filter(Boolean)) {
          if (!PICTURES[pic]) {
            invalid.push(`${where}: missing picture ${pic}`);
          }
        }
        if (!(it.ex_id && it.ex_en)) {
          invalid.push(`${where}: no explanation`);
        }
      }
    }
    check("every mock item has a valid key, existing pictures and an ID + EN explanation", invalid.length === 0, invalid.slice(0, 4).join(" | "));

    const sampleAnswer = (q) => {
      if (EXAM_SUBJECTIVE.has(q.kind)) {
        return q.item.samples ? q.item.samples[0] : q.item.sample;
      }
      return Array.isArray(q.item.ans) ? q.item.ans[0] : q.item.ans;
    };
    const scoring = [];
    for (const level of LEVELS) {
      const paper = flattenPaper(level);
      const perfect = {};
      paper.sections.forEach((s) => s.questions.forEach((q) => {
        perfect[q.key] = sampleAnswer(q);
      }));
      const best = examTotals(paper, perfect);
      const empty = examTotals(paper, {});
      const objectiveFull = ["L", "R"].every((id) => best.bySection[id] === 100);
      if (!objectiveFull || !best.passed || empty.total !== 0 || empty.passed) {
        scoring.push(`HSK${level}: best ${JSON.stringify(best.bySection)} empty ${empty.total}`);
      }
    }
    check("scoring: key answers give 100 in listening + reading and pass; a blank sheet scores 0 and fails", scoring.length === 0, scoring.join(" | "));

    const p1 = flattenPaper(1);
    const half = {};
    p1.sections.forEach((s) => s.questions.forEach((q, i) => {
      if (i % 2 === 0) {
        half[q.key] = sampleAnswer(q);
      }
    }));
    const halfTotals = examTotals(p1, half);
    check("scoring: half the HSK 1 items right gives 50 + 50 = 100 / 200 (below the 120 pass line)", halfTotals.total === 100 && !halfTotals.passed, JSON.stringify(halfTotals));

    const keepHash = location.hash;
    const routeErrors = [];
    const settle = () => new Promise((resolve) => setTimeout(resolve, 30));
    location.hash = "exam";
    route();
    await settle();
    if (!view.querySelector(".paper-table")) {
      routeErrors.push("exam home");
    }
    location.hash = "exam/quick";
    route();
    await settle();
    if (!view.querySelector("h1")) {
      routeErrors.push("quick quiz");
    }
    const keepProgress = localStorage.getItem(EXAM_PROGRESS_KEY);
    startExam(1, "full", ["L", "R"]);
    location.hash = "exam/go";
    route();
    await settle();
    const introOk = !!view.querySelector(".ex-intro") && document.body.classList.contains("exam-focus");
    if (!introOk) {
      routeErrors.push("exam/go intro or focus mode");
    }
    state.examAttempts = [...(state.examAttempts || []), {
      level: 1, mode: "full", sections: ["L", "R"], responses: half, scores: halfTotals.bySection,
      total: halfTotals.total, passed: halfTotals.passed, seconds: 600, at: Date.now(),
    }];
    location.hash = "exam/result";
    route();
    await settle();
    if (!view.querySelector(".result-hero") || !view.querySelector("details.review-card") || document.body.classList.contains("exam-focus")) {
      routeErrors.push("exam/result");
    }
    if (keepProgress === null) {
      localStorage.removeItem(EXAM_PROGRESS_KEY);
    } else {
      localStorage.setItem(EXAM_PROGRESS_KEY, keepProgress);
    }
    location.hash = keepHash;
    check("exam routes render: home, quick quiz, exam/go (focus mode, no tab bar), result with collapsible review", routeErrors.length === 0, routeErrors.join(", "));
  }


  // ---------- v8: Nada the guide (rule-based queue, offline) ----------
  {
    const now = Date.now();
    const today = dateKey(now);
    const keepActivity = state.activity;
    const keepHash = location.hash;
    const keepOnboarded = state.onboarded;
    state.onboarded = true;
    state.activity = {};

    const due = dueWords(now).length;
    const fresh = guideSummary(now);
    check("guide: today's queue is ordered, review comes first when cards are due, and one next step is shown",
      fresh.steps.length >= 3 && (due === 0 || fresh.steps[0].id === "review") && fresh.next === fresh.steps[0] && fresh.done === 0,
      `${due} due, ${fresh.steps.map((s) => s.id).join(">")}`);

    location.hash = "tones";
    guideRecord(3, now);
    location.hash = "home";
    guideRecord(50, now);
    check("guide: XP is credited to the screen it was earned on (tones +3, home ignored)",
      state.activity[today].tones === 3 && state.activity[today].home === undefined, JSON.stringify(state.activity[today]));

    state.activity[today] = { review: 1 };
    const afterReview = guideSummary(now);
    check("guide: finishing a session advances the queue to the next step",
      afterReview.steps[0].done && afterReview.next && afterReview.next.id === afterReview.steps[1].id && afterReview.done === 1,
      afterReview.steps.map((s) => `${s.id}:${s.done}`).join(" "));

    state.activity[today] = { review: 99, learn: 99, tones: 99, write: 99, talk: 99, exam: 99 };
    const empty = guideSummary(now);
    const doneCard = document.createElement("div");
    doneCard.innerHTML = guideCardHtml(now) + guideNextHtml(now);
    check("guide: keeps going until the queue is empty, then shows an all-done state",
      empty.next === null && empty.left === 0 && !!doneCard.querySelector(".guide-done") && !doneCard.querySelector(".guide-next")
      && doneCard.querySelector(".guide-after").textContent.includes(gt("allDoneTitle")), `${empty.left} left`);

    state.activity[today] = {};
    location.hash = "home";
    route();
    const homeGuide = view.querySelector(".guide");
    check("guide: home leads with Nada's plan card, a next-step button with its reason, and the step list",
      !!homeGuide && view.querySelector(".card") === homeGuide && !!homeGuide.querySelector("a.guide-next[href^='#']")
      && !!homeGuide.querySelector(".guide-why") && homeGuide.querySelectorAll(".guide-steps li").length === fresh.steps.length
      && !!homeGuide.querySelector("svg.mascot[aria-hidden='true']"));

    const nextTitle = fresh.next.title;
    const nextMentions = homeGuide ? [...homeGuide.querySelectorAll("a, b, p, span")]
      .filter((el) => el.children.length === 0 && el.textContent.trim() === nextTitle).length : 0;
    check("guide: home names the next step once (the first queue row is the primary button, no duplicate)",
      nextMentions === 1 && !!homeGuide.querySelector(".guide-steps li.next a.guide-next"), `${nextMentions} mentions`);

    const happyFace = mascotSvg("happy", 40);
    const encourageFace = mascotSvg("encourage", 40);
    check("guide: Nada's moods differ at button size (encourage winks and waves, happy does not)",
      encourageFace !== happyFace && encourageFace.includes("m-arm") && !happyFace.includes("m-arm")
      && (encourageFace.match(/m-ink-fill/g) || []).length === 1 && (happyFace.match(/m-ink-fill/g) || []).length === 2);

    const strip = document.createElement("div");
    strip.innerHTML = guideNextHtml(now);
    const go = strip.querySelector(".guide-after-go");
    check("guide: session-complete strip hands off to the next queued step",
      !!go && go.getAttribute("href") === guideSummary(now).next.href, go ? go.getAttribute("href") : "none");

    view.innerHTML = "";
    guideMountFab("vocab", true);
    const fab = document.getElementById("nada-fab");
    let sheetOk = false;
    if (fab) {
      fab.click();
      const sheet = document.getElementById("nada-sheet");
      sheetOk = !!sheet && !!sheet.querySelector("[role='dialog'][aria-modal='true']") && !!sheet.querySelector(".guide-tip")
        && !!sheet.querySelector(".guide-honest");
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      sheetOk = sheetOk && !document.getElementById("nada-sheet");
    }
    const fabOk = !!fab && fab.getAttribute("aria-label") && fab.querySelector(".nada-badge");
    const pillText = fab ? (fab.querySelector(".nada-pill-text b") || {}).textContent : "";
    check("guide: on hub screens the floating Nada shows the next step as a label (visible without a tap)",
      !!fab && fab.classList.contains("nada-pill") && pillText === guideSummary(now).next.title, pillText);
    let tuckOk = false;
    if (fab) {
      const spacer = document.createElement("div");
      spacer.style.height = "4000px";
      document.body.appendChild(spacer);
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("scroll"));
      window.scrollTo(0, 600);
      window.dispatchEvent(new Event("scroll"));
      const tuckedDown = fab.classList.contains("tucked");
      window.scrollTo(0, 300);
      window.dispatchEvent(new Event("scroll"));
      tuckOk = tuckedDown && !fab.classList.contains("tucked");
      spacer.remove();
      window.scrollTo(0, 0);
    }
    check("guide: the pill tucks to just Nada while scrolling down and shows the label again on scroll up", tuckOk);
    view.innerHTML = `<a href="${guideSummary(now).next.href}">x</a>`;
    guideMountFab("vocab", true);
    const plainFab = document.getElementById("nada-fab");
    check("guide: no pill label when the screen already links to the same next step (one action, one wording)",
      !!plainFab && !plainFab.classList.contains("nada-pill") && !!plainFab.querySelector(".nada-badge"));
    view.innerHTML = "";
    guideMountFab("home", true);
    check("guide: floating Nada on other screens opens a labelled sheet (tip, queue, honesty note) that closes on Escape; hidden on home",
      fabOk && sheetOk && !document.getElementById("nada-fab"));

    location.hash = "vocab";
    route();
    const filledTiles = [...view.querySelectorAll(".grid2 .tile.primary")];
    const vocabNext = guideSummary(now).next;
    const expectTile = ["#review", "#learn"].includes(vocabNext.href) ? vocabNext.href : null;
    check("guide: vocabulary fills only one tile, the one for Nada's next step, and marks it",
      filledTiles.length === 1 && (!expectTile || filledTiles[0].getAttribute("href") === expectTile)
      && (!expectTile || !!filledTiles[0].querySelector(".tile-next")) && view.querySelectorAll(".grid2 .tile.quiet").length === 1,
      filledTiles.map((el) => el.getAttribute("href")).join(","));

    location.hash = "home";
    route();
    const homeStats = view.querySelector(".home-stats");
    check("polish: home has no duplicate streak or memory chart; the strip shows goal, words remembered and level",
      !!homeStats && homeStats.querySelectorAll(".hs-item").length === 3 && !view.querySelector(".memory-card")
      && homeStats.textContent.includes(t("remembered")) && !homeStats.textContent.includes(t("streak")));

    const moods = ["happy", "encourage", "think", "cheer"];
    check("mascot: every mood sits on steamer paper stamped with the app seal",
      moods.every((m) => mascotSvg(m, 40).includes("m-paper") && (mascotSvg(m, 40).match(/class="m-seal"/g) || []).length === 2));

    const afterExam = document.createElement("div");
    afterExam.innerHTML = guideAfterExamHtml(now);
    const nonExamNext = guideSummary(now).steps.find((s) => !s.done && s.id !== "exam");
    check("guide: the exam section intro names what Nada does after the exam (no clutter while the timer runs)",
      !!afterExam.querySelector(".ex-after-nada svg.mascot")
      && (nonExamNext ? afterExam.textContent.includes(nonExamNext.title) : afterExam.textContent.includes(gt("afterThisDone"))));

    location.hash = "vocab";
    route();
    const rowMeters = [...view.querySelectorAll(".list-item .v-meter")];
    check("polish: vocabulary rows use one neutral meter; red only marks fading words, characters stay ink",
      !view.querySelector(".list-item .zh .t1, .list-item .zh .t2, .list-item .zh .t3, .list-item .zh .t4")
      && rowMeters.every((m) => !(m.querySelector("i").getAttribute("style") || "").includes("background")), `${rowMeters.length} meters`);

    location.hash = "home";
    route();
    check("polish: home has one progress meter (no plan progress bar next to the daily-goal ring)",
      !view.querySelector(".guide .guide-bar") && !!view.querySelector(".home-stats .ring-fill"));

    const doneKey = `nada-done-${dateKey(now)}`;
    sessionStorage.setItem(doneKey, "0");
    state.activity[today] = { review: 1 };
    const popOnce = document.createElement("div");
    popOnce.innerHTML = guideCardHtml(now);
    const popAgain = document.createElement("div");
    popAgain.innerHTML = guideCardHtml(now);
    check("guide: the step just finished pops once when home is drawn, then stays still",
      popOnce.querySelectorAll(".guide-steps li.just-done").length === 1 && !popAgain.querySelector(".just-done"));

    state.activity[today] = { review: 99, learn: 99, tones: 99, write: 99, talk: 99 };
    const keepExamLevel = state.examLevel;
    state.examLevel = state.level;
    const examNext = guideSummary(now).next;
    location.hash = "exam";
    route();
    await new Promise((resolve) => setTimeout(resolve, 60));
    const picks = view.querySelectorAll("[data-practice].nada-pick, #hskk-start.nada-pick");
    const fullBtn = document.getElementById("start-full");
    check("guide: when Nada's next step is an exam section, exam home fills only that section button",
      (!guideSummary(now).steps.some((s) => s.id === "exam") || (examNext && examNext.id === "exam"))
      && (!examNext || examNext.id !== "exam" || (picks.length === 1 && !!fullBtn && fullBtn.classList.contains("ghost"))),
      examNext ? examNext.id : "none");
    state.examLevel = keepExamLevel;
    state.activity[today] = {};
    sessionStorage.removeItem(doneKey);

    // ---------- HSKK speaking mock ----------
    await loadHskkData();
    const formatOk = HSKK_LEVELS.every((id) => {
      const paper = HSKK_PAPERS[id];
      const meta = HSKK_META[id];
      const partsOk = paper.parts.length === 3 && paper.parts.every((p, i) => p.kind === meta.parts[i][0]
        && p.items.length === meta.parts[i][1] && p.minutes === meta.parts[i][2]);
      const minutes = paper.parts.reduce((s, p) => s + p.minutes, 0) + paper.prep;
      const points = paper.parts.reduce((s, p) => s + p.points, 0);
      return partsOk && minutes === meta.minutes && paper.minutes === meta.minutes && paper.prep === meta.prep
        && points === 100 && paper.total === 100 && paper.pass === 60;
    });
    check("HSKK: Beginner 27 / Intermediate 14 / Advanced 6 items in the official parts, timing, 100 points, pass 60",
      formatOk && HSKK_META.beginner.items === 27 && HSKK_META.intermediate.items === 14 && HSKK_META.advanced.items === 6);

    const allItems = HSKK_LEVELS.flatMap((id) => HSKK_PAPERS[id].parts.flatMap((p) => p.items.map((it) => ({ kind: p.kind, it }))));
    const contentOk = allItems.every(({ kind, it }) => it.zh && it.py && it.id && it.en && it.sec > 0
      && (!["open", "picture"].includes(kind) || (it.model && it.model_py))
      && (kind !== "picture" || it.pics.every((pic) => PICTURES[pic])));
    check("HSKK: every item has pinyin, Indonesian and English; open and picture items carry a model answer",
      contentOk, `${allItems.length} items`);

    const beginnerPaper = HSKK_PAPERS.beginner;
    const fullMarks = {};
    const halfMarks = {};
    beginnerPaper.parts.forEach((p, pi) => p.items.forEach((_it, i) => {
      fullMarks[`${pi}-${i}`] = hskkMaxRating(p.kind);
      halfMarks[`${pi}-${i}`] = hskkMaxRating(p.kind) / 2;
    }));
    const full = hskkScore(beginnerPaper, fullMarks);
    const half = hskkScore(beginnerPaper, halfMarks);
    const none = hskkScore(beginnerPaper, {});
    check("HSKK: score = time-weighted parts; full marks 100 (pass), half 50 (fail), none 0; char match by LCS",
      full.total === 100 && full.passed && half.total === 50 && !half.passed && none.total === 0
      && Math.abs(hskkCharMatch("我今天很忙。", "我今天忙") - 0.8) < 1e-9 && hskkSuggestRating("repeat", { voiced: 3, match: 0.95 }) === 2
      && hskkSuggestRating("open", { voiced: 0 }) === 0, `${full.total}/${half.total}/${none.total}`);

    const keepLevel = state.examLevel;
    const keepHskk = state.hskkLevel;
    state.examLevel = 1;
    delete state.hskkLevel;
    location.hash = "exam";
    route();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const hskkCard = view.querySelector(".hskk-card");
    check("HSKK: exam home offers the speaking mock (3 levels, level picked from HSK) and explains HSK 1-2 has no writing paper",
      !!hskkCard && hskkCard.querySelectorAll("[data-hskk]").length === 3
      && hskkCard.querySelector("[data-hskk].on").dataset.hskk === "beginner"
      && document.getElementById("hskk-start").getAttribute("href") === "#exam/hskk-beginner"
      && view.textContent.includes(ht("hsk12Write")));
    state.examLevel = keepLevel;
    if (keepHskk) {
      state.hskkLevel = keepHskk;
    }

    const rotationOk = LEVELS.every((lv) => {
      const lvPaper = flattenPaper(lv);
      const picks = new Set();
      for (let d = 0; d < lvPaper.sections.length + 1; d += 1) {
        picks.add(examPickFor(lvPaper, 20000 + d));
      }
      return picks.has("S") && lvPaper.sections.every((s) => picks.has(s.id)) && picks.size === lvPaper.sections.length + 1;
    });
    check("HSKK: Nada's exam step rotates through every written section and the speaking mock, every level", rotationOk);

    const keepPapersLevel = state.examLevel;
    state.examLevel = 4;
    renderExamHome();
    const papersLinks = [...view.querySelectorAll(".papers-card a")];
    check("Exam: official sample papers are linked (not copied) for the chosen level, plus audio/HSKK portals and the shared collection",
      papersLinks.length === 5 && papersLinks[0].href.endsWith("/HSK4_yj.pdf")
      && papersLinks.every((a) => a.target === "_blank" && a.rel.includes("noopener"))
      && papersLinks.some((a) => a.href.includes("bit.ly/ContohSoalHSKdanHSKK")),
      papersLinks.map((a) => a.href).join(" "));
    state.examLevel = keepPapersLevel;

    const keepAttempts = state.hskkAttempts;
    const keepXp = state.xp;
    const keepDays = JSON.parse(JSON.stringify(state.days));
    const session = hskkRun("beginner", { speed: 0.002, noMic: true });
    const introOk = !!view.querySelector(".hk-intro") && view.querySelectorAll(".ex-parts li").length === 3;
    session.controls.begin();
    const prepOk = !!view.querySelector(".hk-prep") && view.querySelectorAll(".hk-prep .hk-q").length === 2;
    session.controls.ready();
    const firstItemOk = !!view.querySelector(".hk-item .hk-listen") && !view.querySelector(".hk-item [lang='zh-CN'].hk-passage");
    for (let waited = 0; session.phase !== "review" && waited < 6000; waited += 50) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    const reviewItems = view.querySelectorAll(".hk-rev-item").length;
    const scoreBtn = document.getElementById("hk-score");
    const lockedBeforeRating = !!scoreBtn && scoreBtn.disabled;
    view.querySelectorAll("[data-fill]").forEach((btn) => btn.click());
    document.getElementById("hk-score").click();
    const resultScore = view.querySelector(".hk-score b");
    const saved = (state.hskkAttempts || []).slice(-1)[0];
    check("HSKK: a full Beginner session runs offline without a mic (intro, prep, 27 timed items, rated review, result saved)",
      introOk && prepOk && firstItemOk && reviewItems === 27 && lockedBeforeRating
      && !!resultScore && resultScore.textContent === "100" && !!saved && saved.level === "beginner" && saved.total === 100,
      `review ${reviewItems}, phase ${session.phase}`);
    const focusCard = view.querySelector(".hk-focus");
    check("HSKK: the result names the weakest part with one practice step, and retake/back are quiet links",
      !!focusCard && focusCard.textContent.includes(HSKK_PART_ZH[1]) && !!focusCard.querySelector('a[href="#talk"]')
      && !!document.querySelector("#hk-back.btn-text") && !!document.querySelector("#hk-again.btn-text")
      && view.querySelectorAll(".hk-result-actions .btn:not(.btn-text)").length === 0);
    session.cleanup();
    state.hskkAttempts = keepAttempts;
    state.xp = keepXp;
    state.days = keepDays;
    saveState();

    const copy = JSON.stringify(GUIDE_TEXT).toLowerCase();
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    check("guide: copy is honest (rule-based, offline, no server AI claim) and has no emoji",
      GUIDE_TEXT.id.honest.includes("offline") && GUIDE_TEXT.en.honest.toLowerCase().includes("offline")
      && !/(chatgpt|gpt-|llm|cloud ai|powered by ai|ditenagai ai)/.test(copy) && !emoji.test(copy));

    state.activity = keepActivity;
    state.onboarded = keepOnboarded;
    location.hash = keepHash;
  }

  state = JSON.parse(saved);

  const failed = results.filter((r) => !r.pass);
  document.title = failed.length ? `TESTS FAIL ${failed.length}/${results.length}` : `TESTS PASS ${results.length}/${results.length}`;
  view.innerHTML = `<pre id="test-results">${results.map((r) => esc(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  [" + r.detail + "]" : ""}`)).join("\n")}\n\n${document.title}</pre>`;
})();
