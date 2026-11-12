// @vitest-environment happy-dom
// A preloaded sport is logged as minutes and nothing else, in the list and in the focus view; a bike
// still shows its speed.
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Workout from './Workout.jsx'
import { DEF, useStore } from '../store/useStore.js'

vi.mock('../lib/sound.js', () => ({ beep: vi.fn(), vibrate: vi.fn(), alertBuzz: vi.fn(), unlock: vi.fn() }))
vi.mock('../lib/api.js', () => ({ api: vi.fn(() => Promise.resolve({})) }))

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let root, container

function mount(id, speed, view) {
  const S = JSON.parse(JSON.stringify(DEF))
  S.active = {
    id: 'sport-test', d: '2026-11-11', start: Date.now(), routineId: null, name: 'Sport', bw: null, cur: 0,
    workoutView: view,
    entries: [{ id, target: { sets: 1, min: 20, speed }, sets: [{ min: 20, speed, done: false }] }],
  }
  useStore.setState({ S, user: null })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root.render(<MemoryRouter><Workout /></MemoryRouter>))
}
afterEach(() => {
  if (root) act(() => root.unmount())
  if (container) container.remove()
  root = container = null
})

describe('a sport in the set row', () => {
  it('has a minutes stepper and no speed column', () => {
    mount('sport-golf', 0, 'list')
    expect(container.querySelector('.setrow').querySelectorAll('.stp')).toHaveLength(1)
    expect(container.querySelector('.sethead .r-sp')).toBeNull()
  })
  it('keeps the speed column on a bike', () => {
    mount('2138', 8, 'list')
    expect(container.querySelector('.setrow').querySelectorAll('.stp')).toHaveLength(2)
  })
})

describe('a sport in the focus view', () => {
  it('has a duration stepper and no speed stepper', () => {
    mount('sport-golf', 0, 'focus')
    expect(container.querySelector('button[aria-label="Increase duration"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Increase speed"]')).toBeNull()
  })
  it('keeps the speed stepper on a bike', () => {
    mount('2138', 8, 'focus')
    expect(container.querySelector('button[aria-label="Increase speed"]')).not.toBeNull()
  })
})
