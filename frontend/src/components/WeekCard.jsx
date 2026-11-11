import { useMemo } from 'react'
import CardHead from './CardHead.jsx'
import { weekCard } from '../lib/week-card.js'
import { fmtDur, fmtVol, DAYS } from '../lib/format.js'
import { t } from '../lib/i18n.js'

// The week on Home, under the week strip: every workout of the shown week, day by day. `start` is
// the strip's first day, so the strip's arrows move this card too. Read-only; lib/week-card.js does
// the sums. The words are plain English like the Sports sheet's: not in the locale packs yet.
export default function WeekCard({ S, start }) {
  const wk = useMemo(() => weekCard(S, start), [S.workouts, S.customEx, start])
  const { total } = wk
  const setsText = n => n + (n === 1 ? ' set' : ' sets')
  const sub = total.workouts
    ? total.workouts + (total.workouts === 1 ? ' workout' : ' workouts') + (total.ms >= 60000 ? ' · ' + fmtDur(total.ms) : '') + (total.sets ? ' · ' + setsText(total.sets) : '')
    : 'Nothing logged this week'
  return <div className="card week-card">
    <CardHead icon="figureStrength" eyebrow="Week" title="Every workout" sub={sub} />
    {wk.days.map(d => <div key={d.iso} className="week-card-day" data-day={d.iso}>
      <div className="lbl">{t(DAYS[d.dow])} {d.day}</div>
      {d.workouts.length === 0 ? <div className="small dim">–</div> : d.workouts.map(w => <div key={w.id} className="week-card-workout">
        <div>{w.name || 'Workout'}</div>
        <div className="small dim">{[
          w.ms >= 60000 ? fmtDur(w.ms) : null,
          w.sets ? setsText(w.sets) : null,
          w.volume > 0 ? fmtVol(w.volume, S.unit) : null,
          ...w.sports.map(s => s.name + (s.ms >= 60000 ? ' ' + fmtDur(s.ms) : '')),
        ].filter(Boolean).join(' · ')}</div>
      </div>)}
    </div>)}
  </div>
}
