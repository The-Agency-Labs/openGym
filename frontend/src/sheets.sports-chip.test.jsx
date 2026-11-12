// @vitest-environment happy-dom
// Sports is a chip in the top row of the custom exercise form, beside the body parts. Picked, it hides
// the equipment row and the muscle rows, and the saved exercise carries `cat: SPORTS` (time only).
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'

import { SPORTS, isSport, registerCustom, EXIDX } from './lib/exercises.js'
import { DEF, useStore } from './store/useStore.js'
import { useUI } from './store/useUI.js'
import { _setLangState } from './lib/i18n-core.js'
import { bindUI } from './components/ui.jsx'
import { customExSheet, exerciseDetailSheet } from './sheets.jsx'

bindUI(useUI)

const mounted = []
const S = () => useStore.getState().S

function render(el) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  mounted.push(root)
  act(() => root.render(el))
  return host
}
const renderTop = () => {
  const sheet = useUI.getState().sheets.at(-1)
  return render(sheet.render(() => useUI.getState().closeSheet(sheet.id)))
}
const chip = (host, text) => [...host.querySelectorAll('.chip')].find(e => e.textContent.trim() === text)
const click = el => act(() => el.click())
const type = (input, value) => act(() => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const button = (host, text) => [...host.querySelectorAll('button')].find(e => e.textContent.trim() === text)

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  useUI.setState({ sheets: [], toastMsg: '' })
  useStore.setState({ S: structuredClone(DEF), user: null, config: null })
  registerCustom([])
  _setLangState('en', null, null, null)
  document.body.innerHTML = ''
})
afterEach(() => {
  act(() => { mounted.splice(0).forEach(root => root.unmount()) })
  registerCustom([])
})

describe('the Sports chip in the custom exercise form', () => {
  it('sits in the top row beside the body parts and hides the equipment row when picked', () => {
    customExSheet(null)
    const host = renderTop()
    expect(chip(host, 'cardio')).toBeTruthy()
    expect(chip(host, 'sports').parentElement).toBe(chip(host, 'cardio').parentElement)
    expect(host.querySelector('[data-tour="cx-eq"]')).toBeTruthy()
    click(chip(host, 'sports'))
    expect(chip(host, 'sports').classList.contains('on')).toBe(true)
    expect(host.querySelector('[data-tour="cx-eq"]')).toBeNull()
    expect(host.textContent).not.toContain('Primary muscle groups')
    expect(host.textContent).toContain('time only')
  })

  it('saves a sport with a name alone: cat Sports, no equipment, no body part picked', () => {
    customExSheet(null)
    const host = renderTop()
    type(host.querySelector('input.input'), 'Padel')
    click(chip(host, 'sports'))
    click(button(host, 'Create exercise'))
    const [c] = S().customEx
    expect(c.n).toBe('Padel')
    expect(c.cat).toBe(SPORTS)
    expect(c.bp).toBe('cardio')
    expect(c.sm).toEqual([])
    expect(isSport(EXIDX[c.id])).toBe(true)
  })

  it('an ordinary exercise still needs a body part and equipment, and has no cat', () => {
    customExSheet(null)
    const host = renderTop()
    type(host.querySelector('input.input'), 'My row')
    click(button(host, 'Create exercise'))
    expect(S().customEx || []).toHaveLength(0)
    click(chip(host, 'back'))
    click(button(host, 'Create exercise'))
    expect(S().customEx || []).toHaveLength(0)
    click(chip(host, 'barbell'))
    click(button(host, 'Create exercise'))
    expect(S().customEx[0].cat).toBeUndefined()
  })

  it('an exercise already marked Sports opens with the chip on, and un-picking it removes the mark', () => {
    const ex = { id: 'cx1', n: 'Padel', bp: 'cardio', eq: '', custom: true, cat: SPORTS }
    useStore.setState(s => ({ S: { ...s.S, customEx: [ex] } }))
    registerCustom([ex])
    customExSheet(ex)
    const host = renderTop()
    expect(chip(host, 'sports').classList.contains('on')).toBe(true)
    expect(chip(host, 'cardio')).toBeTruthy()
    expect(host.querySelector('.chip.on').textContent).toBe('sports')
    click(chip(host, 'cardio'))
    expect(chip(host, 'sports').classList.contains('on')).toBe(false)
    click(chip(host, 'barbell'))
    click(button(host, 'Save'))
    expect(S().customEx[0].cat).toBeUndefined()
  })
})

describe('a preloaded sport in the exercise sheet', () => {
  it('has no Edit, no Delete and no Suggest a fix link, where a catalogue exercise has the link', () => {
    exerciseDetailSheet(EXIDX['sport-golf'])
    const sport = renderTop()
    expect(sport.textContent).not.toContain('Suggest a fix')
    expect(button(sport, 'Edit')).toBeUndefined()
    expect(button(sport, 'Delete exercise')).toBeUndefined()
    exerciseDetailSheet(Object.values(EXIDX).find(e => !e.preloaded && !e.custom))
    expect(renderTop().textContent).toContain('Suggest a fix')
  })
})
