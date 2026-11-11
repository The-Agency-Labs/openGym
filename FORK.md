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
