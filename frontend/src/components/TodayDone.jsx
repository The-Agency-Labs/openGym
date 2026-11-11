import { t, dateLocale } from '../lib/i18n.js'
import { fmtDur, todayISO } from '../lib/format.js'
import { weekCard } from '../lib/week-card.js'

// Under the Today row: every workout logged today, one line each with the time it started and how
// long it took, and the sports inside it. Nothing is drawn on a day with none. Read-only; the
// numbers come from the week card's own helper (lib/week-card.js), so the two cards agree.
// The words are plain English: the locale packs are too large to change in the same pull request.
export default function TodayDone({ S }) {
  const workouts = weekCard(S, todayISO()).days[0].workouts
  if (!workouts.length) return null
  const started = new Map((Array.isArray(S?.workouts) ? S.workouts : []).filter(Boolean).map(w => [w.id, Number(w.start)]))
  const clock = id => (started.get(id) > 0 ? new Date(started.get(id)).toLocaleTimeString(dateLocale(), { hour: 'numeric', minute: '2-digit' }) : null)
  return <div className="today-done small" style={{ marginTop: 6 }}>
    {workouts.map(w => <div key={w.id} className="today-done-workout" style={{ marginTop: 4 }}>
      <div className="row between" style={{ gap: 8 }}>
        <span>{w.name || t('Workout done')}</span>
        <span className="dim">{[clock(w.id), w.ms >= 60000 ? fmtDur(w.ms) : null].filter(Boolean).join(' · ')}</span>
      </div>
      {w.sports.map(s => <div key={s.id} className="dim">{s.name + (s.ms >= 60000 ? ' ' + fmtDur(s.ms) : '')}</div>)}
    </div>)}
  </div>
}
