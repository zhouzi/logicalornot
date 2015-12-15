/* global jasmine, beforeEach, it, expect */

import evalToString from '../src/app/utils/evalToString'
import questions from '../src/app/data/questions.json'
import matchers from './matchers'

beforeEach(function () {
  jasmine.addMatchers(matchers)
})

it('should have 1 question with a list of 3 answers, the right one included', () => {
  questions.forEach(function (q) {
    expect(typeof q.question).toBe('string')
    expect(q.answers.length).toBe(3)
    expect(q.answers).toContainAnswer(evalToString(q.question))
  })
})
