import { useMemo } from 'react'
import CardHead from './CardHead.jsx'
import { weekCard } from '../lib/week-card.js'
import { fmtNum, fmtDur, DAYS } from '../lib/format.js'
import { t } from '../lib/i18n.js'

// The week on Home, under the week strip: every workout of the shown week, day by day. `start` is
// the strip's first day, so the strip's arrows move this card too. Read-only; lib/week-card.js
// does the sums. The words are plain English like the Sports sheet's: not in the locale packs yet.
export default function WeekCard({ S, start }) {
  const wk = useMemo(() => weekCard(S, start), [S.workouts, S.customEx, start])
  const { total } = wk
  const sub = total.workouts ? [fmtDur(total.ms), total.sets + (total.sets === 1 ? ' set' : ' sets')].join(' · ') : 'Nothing logged this week'
  return <div className="card week-card">
    <CardHead icon="figureStrength" eyebrow="Week log" title={total.workouts + (total.workouts === 1 ? ' workout' : ' workouts')} sub={sub} />
    {wk.days.map(day => <div key={day.iso} className="row between week-card-day" data-day={day.iso} style={{ alignItems: 'flex-start', gap: 12, padding: '6px 0' }}>
      <div className="lbl2" style={{ minWidth: 44 }}>{t(DAYS[day.dow])} {day.day}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {day.workouts.length === 0 ? <div className="small dim">–</div> : day.workouts.map(w => <div key={w.id} className="week-card-workout" style={{ marginBottom: 4 }}>
          <div className="row between"><span className="tt">{w.name || 'Workout'}</span><span className="small dim">{w.ms >= 60000 ? fmtDur(w.ms) : ''}</span></div>
          {w.sets > 0 && <div className="ss">{w.sets + (w.sets === 1 ? ' set' : ' sets')} · {fmtNum(w.volume)} {S.unit}</div>}
          {w.sports.map(s => <div key={s.id} className="ss">{s.name} · {fmtDur(s.ms)}</div>)}
        </div>)}
      </div>
    </div>)}
  </div>
}
