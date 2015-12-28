/* global it, expect */

import evalToString from '../src/app/utils/evalToString'
import questions from '../src/app/data/questions.json'

describe('questions', function () {
  it('should have a question with a list of 3 answers (the right one included)', () => {
    questions.forEach(function (q) {
      expect(typeof q.question).toBe('string')
      expect(q.answers.length).toBe(3)

      const rightAnswer = evalToString(q.question)
      expect(q.answers.some(answer => evalToString(answer) === rightAnswer)).toBe(true)
    })
  })
})
