// @vitest-environment happy-dom
// Marking your own exercises as Sports: one tap sets the exercise's `cat`, and the Type filter
// (byCategory, shared by the Library and the picker) then offers and applies it.
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import { DEF, useStore } from '../store/useStore.js'
import SportsSheet from './SportsSheet.jsx'
import { CATEGORIES, SPORTS, allExercises, byCategory, categoriesOf } from '../lib/exercises.js'

const clone = v => JSON.parse(JSON.stringify(v))
let root, host

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host)
  const S = clone(DEF)
  S.customEx = [
    { id: 'cx1', n: 'Padel', bp: 'cardio', eq: '', custom: true },
    { id: 'cx2', n: 'My row', bp: 'back', eq: '', custom: true },
  ]
  useStore.setState({ S, user: null })
})
afterEach(() => { act(() => root.unmount()); host.remove() })

const buttons = () => Array.from(host.querySelectorAll('.chips button'))
const customs = () => useStore.getState().S.customEx

describe('SportsSheet', () => {
  it('lists your own exercises and marks one as Sports with a tap', () => {
    function Sheet() { return <SportsSheet close={() => {}} /> }
    act(() => root.render(<Sheet />))
    expect(buttons().map(b => b.textContent)).toEqual(['Padel', 'My row'])
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('false')
    act(() => { buttons()[0].click() })
    expect(customs()[0].cat).toBe(SPORTS)
    expect(customs()[1].cat).toBeUndefined()
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true')
  })

  it('a second tap takes the mark off again', () => {
    act(() => root.render(<SportsSheet close={() => {}} />))
    act(() => { buttons()[0].click() })
    act(() => { buttons()[0].click() })
    expect(customs()[0].cat).toBeUndefined()
  })
})

describe('the Sports type in the filter', () => {
  it('is offered only once something is marked, and narrows to the marked ones', () => {
    const S = useStore.getState().S
    expect(CATEGORIES).toContain(SPORTS)
    expect(categoriesOf(allExercises(S))).not.toContain(SPORTS)
    const marked = { ...S, customEx: [{ ...S.customEx[0], cat: SPORTS }, S.customEx[1]] }
    const all = allExercises(marked)
    expect(categoriesOf(all)).toContain(SPORTS)
    const { on, list } = byCategory(all, SPORTS)
    expect(on).toBe(SPORTS)
    expect(list.map(e => e.id)).toEqual(['cx1'])
  })
})
