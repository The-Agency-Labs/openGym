import { useStore } from '../store/useStore.js'
import { Button } from './ui.jsx'
import { t } from '../lib/i18n.js'
import { SPORTS } from '../lib/exercises.js'

// Which of your own exercises are sports: time only, a consistency metric rather than a lift.
// The mark is the exercise's own `cat`, the field the catalogue's kinds already use, so the
// Library's and the picker's Type filter find it with no second list. Each tap is one stamped
// edit of that exercise (store update), so it syncs like any change to a custom exercise.
// The words are plain English: the locale packs are too large to change in the same pull request.

export const toggleSports = id => useStore.getState().update(s => {
  const ex = (s.customEx || []).find(c => c && c.id === id)
  if (!ex) return
  if (ex.cat === SPORTS) delete ex.cat
  else ex.cat = SPORTS
})

export default function SportsSheet({ close }) {
  const customEx = useStore(s => s.S.customEx)
  const own = (customEx || []).filter(c => c && c.id != null)
  return <div className="lib-fsheet">
    <h3>Sports</h3>
    <div className="small dim" style={{ marginBottom: 10 }}>Mark the exercises of yours that are sports. They count time only, and show under the Sports type.</div>
    <div className="chips wrap">
      {own.map(c => <button type="button" key={c.id} className={'chip nocap' + (c.cat === SPORTS ? ' on' : '')}
        aria-pressed={c.cat === SPORTS} onClick={() => toggleSports(c.id)}>{c.n}</button>)}
    </div>
    <div style={{ height: 16 }} />
    <Button variant="primary" onClick={close}>{t('Done')}</Button>
  </div>
}
