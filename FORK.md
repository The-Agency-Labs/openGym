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

What: a card on Home under the week strip's hero, listing every workout of the shown week day by day
(name, length, sets, volume), a dash for a day off, and the week's totals. A workout of your own
Sports exercise shows its time only. Two workouts on one day are two rows. The strip's arrows move
the card too. Read-only: nothing is stored or synced.
Why: one place to see everything done in a week, as the base for tying it to habits later.
Files: `frontend/src/lib/week-card.js` (the sums), `frontend/src/components/WeekCard.jsx`,
`frontend/src/views/Home.jsx` (one import, one line), and a test for each new file.
Note: the new words are plain English, not in the locale packs (too large for a pull request).
