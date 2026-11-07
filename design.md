# Nadaku design system (v6, "Practice paper")

Chosen by the /design bracket on 2026-11-07: 4 directions, each anchored to a reference, judged by a 3-model council
(B beat A 2-0-1, D beat C 3-0, B beat D 2-0-1). Directions and screenshots are kept in the build folder, not in the app.

## References and what we took
- 田字格 practice paper (Chinese exercise books): the grid square behind every headword, one cell per character. Signature element.
- Chinese seal (印章): vermilion chop with 调 as the logo and as the avatar for Nada. No cartoon face.
- Pleco: tone colours on hanzi and pinyin; dense, plain lists.
- Skritter: task first; Review and Learn sit directly under the daily goal.

## Palette (light)
| token | hex | use |
|---|---|---|
| --bg | #f8f4ec | paper |
| --card | #fffdf8 | sheets |
| --line | #e2d8c6 | grid lines, borders |
| --ink | #2a2521 | text |
| --muted | #625a52 | secondary text (AA on bg and card) |
| --red | #a8321f | the one accent: seal red |
| --seal | #a8321f | filled buttons and the logo (white text 6.6:1) |
| tones | #e8453c / #f08c00 / #2fa66a / #3b6fe0 | tone 1-4, used only on hanzi and pinyin |

Dark ("paper at night"): bg #1a1815, card #221f1b, line #3a342d, ink #ece6dc, muted #b3a999, accent text #f08a74, filled buttons stay #a8321f.
All pairs are checked for WCAG AA in tests.js.

## Type
- Display: Source Serif 4 600 (headings, numbers, tile titles). Body: Source Sans 3 400/600. Both OFL, bundled in /fonts with latin-ext for pinyin tone marks.
- Hanzi: system CJK (PingFang SC, Microsoft YaHei, Noto Sans CJK); KaiTi for the headword and the seal.

## Shape, spacing, motion
- Radius 4px (cards, buttons). 1px borders, no drop shadows, no gradients.
- Spacing 4/8/12/16/24. Touch targets 44px minimum.
- Motion: none except a short fade on toasts; prefers-reduced-motion respected.

## Icons
One 24px line set (1.75 stroke) drawn in app.js (ICON_PATHS). Icons only where they carry meaning: tab bar, audio, microphone, settings, task tiles. Never in headings.

## Voice
Plain Indonesian/English, short sentences. No exclamation-mark praise, no emoji, no hype words. Machine-translated text is labelled MT.

## Banned defaults
Emoji anywhere in the UI; purple/blue gradients; Inter as the only face; identical rounded cards with glow; cartoon mascots; confetti-style celebration copy; gradient text; em-dash-heavy copy; centred-everything layouts.
