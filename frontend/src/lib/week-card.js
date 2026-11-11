// The week card on Home: every workout of the shown week, day by day, one row per workout (two on
// one day stay two). Read-only: it works everything out from S.workouts and stores nothing.
//
// An exercise marked Sports (cat 'sports' on a custom exercise, components/SportsSheet.jsx) is a
// time-only entry: it adds its minutes, never sets or volume, so a tennis match is not a lift.
import { SPORTS, EXIDX } from './exercises.js'
import { entryTimes } from './exercise-time.js'
import { hasCompletedWork, isWarmupRow, completedVolumeOf } from './workout-model.js'
import { isoOf, exerciseNameText } from './format.js'

const n = v => (Number(v) > 0 ? Number(v) : 0)

// A sports entry's minutes when no set carries a tick time (a workout logged by hand): the length
// typed on its done rows.
const typedMs = e => (e?.sets || []).reduce((ms, s) => ms + (hasCompletedWork(s) ? (n(s.min) * 60 + n(s.sec)) * 1000 : 0), 0)

/** The seven days from `startISO` ("YYYY-MM-DD"): `[{ iso, dow, day, workouts }]` and the week's totals. */
export function weekCard(S, startISO) {
  const customs = new Map((S?.customEx || []).filter(c => c && c.id != null).map(c => [c.id, c]))
  const [y, m, d] = String(startISO).split('-').map(Number)
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(y, m - 1, d + i)
    days.push({ iso: isoOf(date), dow: date.getDay(), day: date.getDate(), workouts: [] })
  }
  const byIso = new Map(days.map(x => [x.iso, x]))
  const total = { workouts: 0, ms: 0, sets: 0 }
  const logged = [...(S?.workouts || [])].filter(w => w && byIso.has(w.d)).sort((a, b) => (Number(a.start) || 0) - (Number(b.start) || 0))
  for (const w of logged) {
    const times = entryTimes(w)
    let sets = 0, volume = 0
    const sports = []
    ;(w.entries || []).forEach((e, i) => {
      const ex = customs.get(e?.id) || EXIDX[e?.id]
      const name = ex ? exerciseNameText(ex) : String(e?.id ?? '')
      if (customs.get(e?.id)?.cat === SPORTS) {
        const ms = times[i] > 0 ? times[i] : typedMs(e)
        if (ms > 0) sports.push({ id: e.id, name, ms })
        return
      }
      for (const s of e?.sets || []) {
        if (isWarmupRow(s) || !hasCompletedWork(s)) continue
        sets++
        volume += completedVolumeOf(s)
      }
    })
    const ms = Number(w.end) >= Number(w.start) ? Number(w.end) - Number(w.start) : 0
    byIso.get(w.d).workouts.push({ id: w.id, name: w.name || '', ms, sets, volume, sports })
    total.workouts++
    total.ms += ms
    total.sets += sets
  }
  return { days, total }
}
