/* global describe, beforeEach, jasmine, it, expect, spyOn */

import './polyfills'
import Game from '../src/app/classes/Game'

let game
let updateLifebarCallback
let gameOverCallback
let setQuestionCallback

const gameplay = {}
const questions = [
  { question: '1 + 1', answers: ['0', '1', '2'] },
  { question: '2 + 2', answers: ['2', '4', '6'] }
]

describe('Game', function () {
  beforeEach(function () {
    updateLifebarCallback = jasmine.createSpy('updateLifebar callback')
    gameOverCallback = jasmine.createSpy('gameOver callback')
    setQuestionCallback = jasmine.createSpy('setQuestion callback')

    game = new Game(gameplay, questions.slice(), {
      updateLifebar: updateLifebarCallback,
      gameOver: gameOverCallback,
      setQuestion: setQuestionCallback
    })
  })

  it('should set a random question', function () {
    const oldQuestion = game.currentQuestion
    game.setRandomQuestion()

    expect(game.currentQuestion).not.toBe(oldQuestion)

    const question = { question: game.currentQuestion.question, answers: game.currentQuestion.answers }
    expect(questions).toContain(question)
  })

  it('should set a random question on instantiation', function () {
    const question = { question: game.currentQuestion.question, answers: game.currentQuestion.answers }
    expect(questions).toContain(question)
  })

  it('should be ready by default', function () {
    expect(game.status).toBe('ready')
    expect(game.timer).toBe(null)
  })

  it('should start the game', function () {
    game.start()

    expect(game.status).toBe('playing')
    expect(game.timer).not.toBe(null)
  })

  it('should not start he game if it has already started', function () {
    game.status = 'playing'

    expect(game.timer).toBe(null)

    game.start()

    expect(game.timer).toBe(null)
  })

  it('should stop the game', function () {
    game.start()
    game.stop()

    expect(game.status).toBe('game over')
  })

  it('should not stop the game if it is not started', function () {
    game.stop()

    expect(game.status).toBe('ready')
    expect(game.timer).toBe(null)
  })

  it('should be instantiated with an empty score', function () {
    expect(game.score).toEqual([])
  })

  it('should start the game when submitting an answer', function () {
    const spy = spyOn(game, 'start').and.callThrough()

    game.submitAnswer('')

    expect(spy).toHaveBeenCalled()
    expect(game.score).toEqual([0])
    expect(updateLifebarCallback).toHaveBeenCalled()
  })

  it('should stop the game if there are no questions left', function () {
    const spy = spyOn(game, 'stop').and.callThrough()

    game.submitAnswer('')
    game.submitAnswer('')

    expect(game.score).toEqual([0, 0])
    expect(game.questions).toEqual([])
    expect(spy).toHaveBeenCalled()
    expect(gameOverCallback).toHaveBeenCalled()
  })

  it('should return the score for given answer', function () {
    expect(game.submitAnswer('')).toBe(0)
  })

  it('should submit an answer and set a random question', function () {
    const randomQuestionSpy = spyOn(game, 'setRandomQuestion')

    game.submitAnswer('')

    expect(randomQuestionSpy).toHaveBeenCalled()
  })
})
