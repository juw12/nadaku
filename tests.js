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

  state = JSON.parse(saved);

  const failed = results.filter((r) => !r.pass);
  document.title = failed.length ? `TESTS FAIL ${failed.length}/${results.length}` : `TESTS PASS ${results.length}/${results.length}`;
  view.innerHTML = `<pre id="test-results">${results.map((r) => `${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  [" + r.detail + "]" : ""}`).join("\n")}\n\n${document.title}</pre>`;
})();
