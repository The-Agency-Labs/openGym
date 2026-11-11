# FORK.md

What this fork changes from upstream (DuarteSantos8/openGym), and why. One entry per change.

## Sports type for your own exercises (2026-11-11)

What: a Sports value in the exercise Type filter (Library and picker). In the Library, "Mark your
exercises as Sports" opens a sheet where each of your own exercises is switched to Sports or back.
The mark is the exercise's own `cat`, so it syncs like any edit of a custom exercise.
Why: sports are tracked as time only, a consistency metric, and need their own filter.
Files: `frontend/src/lib/exercises.js` (SPORTS, CATEGORIES), `frontend/src/views/Library.jsx` (one row,
one import), `frontend/src/components/SportsSheet.jsx`, `frontend/src/components/SportsSheet.test.jsx`.
Note: the new words are plain English, not in the locale packs (too large for a pull request).

## Week card on Home (2026-11-11)

What: a card on Home listing every workout of the week the strip shows (the arrows move both): one line
each with its time, sets and volume, a dash for a day off, and the week's totals. A sport (an exercise
marked Sports) shows its time only. A week with no workout shows no card.
Why: see the whole week, sports and lifts together, as a consistency check.
Files: `frontend/src/lib/week-card.js`, `frontend/src/components/WeekCard.jsx` (and their tests),
`frontend/src/views/Home.jsx` (one import, one line).
Note: the new words are plain English, not in the locale packs (too large for a pull request).
