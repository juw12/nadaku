# Nadaku — Belajar Mandarin HSK 1–6 untuk lidah Indonesia (offline)

**Live:** https://juw12.github.io/nadaku/ (HTTPS → mic, install and offline cache work out of the box).
**Local:** double-click `start.bat`, or open `index.html` in Chrome/Edge.
`?demo=1` shows sample progress · `?test=1` runs the 65 automated checks.

## What it does
- **Content:** all 5,363 HSK 3.0 words (levels 1–6) with Indonesian (CC-CIDICT) + English glosses, tone-coloured pinyin cross-checked against 3 sources, 111 example sentences, 4 Indonesian-context roleplays.
- **Built for Indonesian speakers:** 15 Hokkien loanwords you already know (bakmi, bakpao, cawan, cengbeng…) bridged to their Mandarin words, and 11 pinyin traps for Indonesian tongues (c, q, x, zh/ch/sh/r, aspiration, ü, e, -i, ian, tones) with HSK examples.
- **Memory:** FSRS-4.5 scheduler that **personalises itself** — after 50 reviews it fits your own stability multiplier by maximum likelihood (shrunk toward the standard model) and shows the log-loss improvement. Memory Meter, calibration chart (Brier/ECE), CSV export.
- **Tones:** native syllable audio + **Tone Mirror**: speak and see your pitch curve; on-device classifier built from native-speaker pitch templates — **90.6 % on 1,491 native recordings end-to-end in the browser (2-fold cross-validated: 91.1 %)**, up from 85.3 % for the old rule-based version. Fully offline.
- **Audio:** 5,363 / 5,363 words offline: 4,305 whole-word native recordings + 1,058 composed from native syllables with tone-sandhi rules (3-3, 不, 一).
- **Writing:** stroke-order checking for all 1,799 characters (Watch / Trace / Recall).
- **Speaking:** "Hold & repeat" shadowing in roleplays (offline); online speech recognition is opt-in.
- **Polish & access:** light/dark theme (auto or manual), streak & word badges, confetti (respects reduced motion), installable PWA, keyboard shortcuts, screen-reader labels, WCAG-AA contrast in both themes.

## Known limits (honest)
- Tone templates come from a small set of native speakers (audio-cmn); accuracy on learners' voices and other speakers is not yet measured.
- Learning claims (FSRS personalisation, calibration) are verified by simulation, not yet by real learners. Run a 10–20 person pilot with the CSV export.
- 1,058 words use composed syllable audio (sandhi applied, prosody less natural). Glosses for HSK 4–6 come straight from CC-CIDICT (auto-filtered, not hand-reviewed).

## Licences
App code: MIT (see `LICENSE`). Data: HSK list — complete-hsk-vocabulary (MIT) · Indonesian glosses — CC-CIDICT (CC BY-SA 4.0) · audio — audio-cmn / Shtooka project (CC BY-SA) · strokes — Make Me a Hanzi / hanzi-writer-data (Arphic Public License) · loanword list — Wikipedia "List of Chinese loanwords in Indonesian" (CC BY-SA 4.0). CC BY-SA data stays under its licence (attribution + share-alike).
