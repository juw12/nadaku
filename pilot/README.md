# Nadaku learner pilot (2 weeks, 10-20 people)

Goal: measure, on real Indonesian learners, (1) whether the memory model's predicted recall matches actual recall,
(2) whether the personal schedule beats the standard one, and (3) how often Tone Mirror hears the intended tone.

## Who
10-20 Indonesian adults learning HSK 1-3. Any phone with Chrome or Safari. No account is needed and all data stays on the phone until they export it.

## Steps
1. Send the invitation below with the link https://juw12.github.io/nadaku/.
2. Each learner uses the app 10 minutes a day for 14 days: reviews plus at least 10 Tone Mirror attempts.
3. On day 14 they open Settings and tap both export buttons ("Ekspor data studi (CSV)" and "Ekspor latihan nada (CSV)"), then send the two files.
4. Put each learner's files in their own folder, e.g. `pilot/data/rina/`, and run `python pilot/analyze.py pilot/data`.
5. Have a Mandarin teacher rate 50 random Tone Mirror attempts (correct or not) to separate learner error from classifier error.

## Invitation (Bahasa Indonesia)
> Halo! Saya sedang menguji aplikasi belajar Mandarin gratis untuk penutur bahasa Indonesia: https://juw12.github.io/nadaku/
> Mau bantu? Pakai 10 menit sehari selama 2 minggu (ulang kata + latihan nada dengan mikrofon).
> Tidak perlu daftar akun; semua data tersimpan di HP-mu. Di hari ke-14, buka Pengaturan, tekan dua tombol "Ekspor ... (CSV)", lalu kirim dua file itu ke saya.
> Data hanya dipakai untuk mengukur apakah jadwal ulangan dan pengenalan nada bekerja; tidak ada nama atau suara yang disimpan, hanya hasil nada (angka).

## Consent and privacy
The exports contain timestamps, words, grades and tone numbers only: no audio, no name. Ask for consent before collecting. Delete the files after the report.
