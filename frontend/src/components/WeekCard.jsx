import { t } from '../lib/i18n.js'
import { DAYS, fmtDur, fmtVol } from '../lib/format.js'
import { weekCard } from '../lib/week-card.js'
import CardHead from './CardHead.jsx'

// Every workout of the week the strip above shows, one line each, with the week's totals.
// Read-only. Nothing is drawn for a week with no workout.
// The words are plain English: the locale packs are too large to change in the same pull request.
const setsText = n => n + (n === 1 ? ' set' : ' sets')
const workoutsText = n => n + (n === 1 ? ' workout' : ' workouts')

export default function WeekCard({ S, start }) {
  const { days, total } = weekCard(S, start)
  if (!total.workouts) return null
  const unit = S?.unit || 'kg'
  const sub = [workoutsText(total.workouts), fmtDur(total.ms), setsText(total.sets)].join(' · ')
  return <div className="card week-card">
    <CardHead icon="calendar" eyebrow={t('This week')} title="Every workout" sub={sub} />
    {days.map(day => <div key={day.iso} className="week-card-day row between" style={{ alignItems: 'flex-start', gap: 10, marginTop: 8 }}>
      <div className="small dim" style={{ width: 44, flexShrink: 0 }}>{t(DAYS[day.dow])} {day.day}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {day.workouts.length ? day.workouts.map(w => <div key={w.id} className="week-card-workout">
          <div>{w.name || 'Workout'}</div>
          <div className="small dim">{[fmtDur(w.ms), w.sets ? setsText(w.sets) : null, w.volume ? fmtVol(w.volume, unit) : null].filter(Boolean).join(' · ')}</div>
          {w.sports.map(s => <div key={s.id} className="small dim">{s.name + (s.ms >= 60000 ? ' ' + fmtDur(s.ms) : '')}</div>)}
        </div>) : <div className="small dim">–</div>}
      </div>
    </div>)}
  </div>
}
