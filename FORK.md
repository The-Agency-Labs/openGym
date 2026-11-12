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

## Everything done today, on Home (2026-11-11)

What: under the Today row, one line for every workout logged today (not only the last one), each with
the time it started and how long it took, and the sports inside it with their own time. Nothing shows
on a day with no workout. "Choose a different workout" stays.
Why: the Today row named only the last workout, so a second one logged the same day looked missing.
Files: `frontend/src/components/TodayDone.jsx`, `frontend/src/views/Home.today-done.test.jsx`,
`frontend/src/views/Home.jsx` (one import, one line). Numbers come from `lib/week-card.js`.
Note: the new words are plain English, not in the locale packs (too large for a pull request).

## Preloaded sports (2026-11-12)

What: thirteen sports come with the app (pickleball, spikeball, swimming, basketball, volleyball, tennis,
badminton, soccer, hockey, golf, hiking, climbing, cycling). Each is a Sports exercise, listed after the
catalogue and found by the Sports filter. They log minutes only: no speed or distance, in the list, the
focus view, the routine line and the history. They count on the week and Today cards.
Built in, not saved to your data: never synced, not copied into your exercises, cannot be renamed or
deleted. An exercise of yours with the same name hides the built-in one ("Volleyball Runs" is a
different name, so it stays). The catalogue's own Swimming steps aside in lists so there is one;
a workout that logged it still reads.
Why: nobody should have to add the common sports by hand.
Files: `frontend/src/lib/preloaded-sports.js` (the names, the one home), `frontend/src/lib/exercises.js`,
`frontend/src/lib/history.js`, `frontend/src/lib/week-card.js`, `frontend/src/views/Workout.jsx`,
`frontend/src/views/FocusView.jsx` (each a few lines), and tests: `preloaded-sports.test.js`,
`Workout.sport.test.jsx`, `SportsSheet.test.jsx` (the Sports filter is now always offered).
Note: the new words are plain English, not in the locale packs. Not done yet: the Sports chip in the
custom exercise form (it lives in `sheets.jsx`, over the size limit for a pull request), so the
Library's "Mark your exercises as Sports" list stays. The "Suggest a fix" link in the exercise sheet
also still shows for a preloaded sport.
