/* global describe, beforeEach, it, spyOn, expect */

import BestScore from '../src/app/classes/BestScore'

describe('BestScore', function () {
  beforeEach(function () {
    window.localStorage.clear()
  })

  it('should init with a score taken from localStorage and default to 0', function () {
    spyOn(window.localStorage, 'getItem').and.returnValue(null)
    expect(new BestScore().get()).toBe(0)

    window.localStorage.getItem.and.returnValue(12)
    expect(new BestScore().get()).toBe(12)
  })

  it('should set the value if it\'s higher than the current one', function () {
    const bestScore = new BestScore()
    expect(bestScore.get()).toBe(0)

    bestScore.set(12)
    expect(bestScore.get()).toBe(12)

    bestScore.set(2)
    expect(bestScore.get()).toBe(12)
  })

  it('should not set invalid value', function () {
    const bestScore = new BestScore()
    expect(bestScore.get()).toBe(0)

    bestScore.set(null)
    expect(bestScore.get()).toBe(0)

    bestScore.set('foo')
    expect(bestScore.get()).toBe(0)

    bestScore.set([])
    expect(bestScore.get()).toBe(0)
  })
})
