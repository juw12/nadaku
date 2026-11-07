"""Nadaku pilot analysis: aggregate learners' exported CSVs into one report.

Usage: python pilot/analyze.py <folder with nadaku-study-*.csv and nadaku-tones-*.csv, one sub-folder per learner>
Writes pilot_report.md next to the folder. Standard library only.
"""
import csv
import math
import statistics
import sys
from collections import defaultdict
from pathlib import Path


def read_rows(path):
    with open(path, encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def calibration(rows, bins=10):
    buckets = defaultdict(list)
    for row in rows:
        p = float(row["predicted_recall"])
        buckets[min(bins - 1, int(p * bins))].append((p, int(row["recalled"])))
    table, ece, n = [], 0.0, len(rows)
    for b in sorted(buckets):
        items = buckets[b]
        mean_p = statistics.fmean(p for p, _ in items)
        hit = statistics.fmean(y for _, y in items)
        ece += len(items) / n * abs(mean_p - hit)
        table.append((b / bins, (b + 1) / bins, len(items), mean_p, hit))
    brier = statistics.fmean((float(r["predicted_recall"]) - int(r["recalled"])) ** 2 for r in rows)
    return table, ece, brier


def log_loss(rows, column):
    eps = 1e-6
    total = 0.0
    for row in rows:
        p = min(1 - eps, max(eps, float(row[column])))
        y = int(row["recalled"])
        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))
    return total / len(rows)


def main(folder):
    folder = Path(folder)
    learners = [p for p in folder.iterdir() if p.is_dir()] or [folder]
    lines = ["# Nadaku pilot report", "", f"Learners: {len(learners)}", ""]
    all_reviews, all_tones = [], []
    lines += ["| learner | reviews | recall | log-loss personal | log-loss standard | tone attempts | tone match |", "|---|---|---|---|---|---|---|"]
    for learner in learners:
        reviews = [r for f in learner.glob("nadaku-study-*.csv") for r in read_rows(f)]
        tones = [r for f in learner.glob("nadaku-tones-*.csv") for r in read_rows(f)]
        all_reviews += reviews
        all_tones += tones
        recall = statistics.fmean(int(r["recalled"]) for r in reviews) if reviews else float("nan")
        personal = log_loss(reviews, "predicted_recall") if reviews else float("nan")
        standard = log_loss(reviews, "standard_model_recall") if reviews else float("nan")
        match = statistics.fmean(int(r["match"]) for r in tones) if tones else float("nan")
        lines.append(f"| {learner.name} | {len(reviews)} | {recall:.1%} | {personal:.3f} | {standard:.3f} | {len(tones)} | {match:.1%} |")
    if all_reviews:
        table, ece, brier = calibration(all_reviews)
        lines += ["", "## Memory model calibration (all learners)", "", f"Brier {brier:.3f}, ECE {ece:.1%}. The target is about 90% recall at review time.", "",
                  "| predicted | n | mean predicted | actual recall |", "|---|---|---|---|"]
        lines += [f"| {lo:.1f}-{hi:.1f} | {n} | {p:.1%} | {y:.1%} |" for lo, hi, n, p, y in table]
    if all_tones:
        by_tone = defaultdict(list)
        for row in all_tones:
            by_tone[row["target_tone"]].append(int(row["match"]))
        lines += ["", "## Tone Mirror on learner voices", "", "| tone | attempts | detected as target |", "|---|---|---|"]
        lines += [f"| {tone} | {len(v)} | {statistics.fmean(v):.1%} |" for tone, v in sorted(by_tone.items())]
        lines += ["", "A match rate mixes learner error and classifier error. Have a teacher rate a random 50 attempts to separate them."]
    out = folder / "pilot_report.md"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(out)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
