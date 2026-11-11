// The week card on Home: every workout of one week, a day at a time, and the week's totals.
// Pure, so it is tested without a screen. A sport is one of your own exercises marked Sports
// (exercises.js SPORTS): it counts time only, never sets or volume.
import { SPORTS } from './exercises.js'
import { entryTimes } from './exercise-time.js'
import { completedVolumeOf, hasCompletedWork, isWarmupRow } from './workout-model.js'

const num = v => (Number(v) > 0 ? Number(v) : 0)
const listOf = v => (Array.isArray(v) ? v : [])

// The length typed into the done rows of an entry, for a workout with no tick times.
function typedMs(entry) {
  return listOf(entry?.sets).filter(s => s && hasCompletedWork(s)).reduce((ms, s) => {
    const rows = s.sides && s.sides.L && s.sides.R ? [s.sides.L, s.sides.R] : [s]
    return ms + rows.reduce((n, r) => n + num(r.min) * 60000 + num(r.sec) * 1000, 0)
  }, 0)
}

function rowFor(w, sportIds, own) {
  const entries = listOf(w.entries)
  const times = entryTimes(w)
  const sports = []
  let sets = 0, volume = 0, ms = 0
  entries.forEach((e, i) => {
    const entryMs = times[i] > 0 ? times[i] : typedMs(e)
    ms += entryMs
    if (e && sportIds.has(e.id)) {
      sports.push({ id: e.id, name: String(own.get(e.id) || ''), ms: entryMs })
      return
    }
    for (const s of listOf(e?.sets)) {
      if (!s || isWarmupRow(s) || !hasCompletedWork(s)) continue
      sets++
      volume += completedVolumeOf(s)
    }
  })
  const span = Number(w.end) - Number(w.start)
  return { id: w.id, name: String(w.name || ''), ms: span > 0 ? span : ms, sets, volume, sports }
}

/** `{ days: [{ iso, dow, day, workouts }], total: { workouts, ms, sets } }` for the 7 days from startISO. */
export function weekCard(S, startISO) {
  const customEx = listOf(S?.customEx).filter(c => c && c.cat === SPORTS)
  const sportIds = new Set(customEx.map(c => c.id))
  const own = new Map(customEx.map(c => [c.id, c.n]))
  const all = listOf(S?.workouts).filter(Boolean)
  const days = []
  const total = { workouts: 0, ms: 0, sets: 0 }
  const d = new Date(startISO + 'T12:00:00')
  for (let i = 0; i < 7; i++) {
    const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    const workouts = all.filter(w => w.d === iso).sort((a, b) => num(a.start) - num(b.start)).map(w => rowFor(w, sportIds, own))
    for (const w of workouts) { total.workouts++; total.ms += w.ms; total.sets += w.sets }
    days.push({ iso, dow: d.getDay(), day: d.getDate(), workouts })
    d.setDate(d.getDate() + 1)
  }
  return { days, total }
}
