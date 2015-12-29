/* global describe, it, expect */

import Question from '../src/app/classes/Question'

describe('Question', function () {
  it('should determine if a answer is correct or not', function () {
    const question = new Question('1 + 1', ['0', 'null', '2'])

    expect(question.isCorrect('[]')).toBe(false)
    expect(question.isCorrect('1')).toBe(false)
    expect(question.isCorrect('2')).toBe(true)
  })

  it('should determine the complexity of a question', function () {
    expect(new Question('foo + !bar + quz').complexity).toBe(2)
    expect(new Question('foo + !bar').complexity).toBe(1)
    expect(new Question('foo').complexity).toBe(0)
  })
})
