import Timer from './Timer'
import Lifebar from './Lifebar'
import Question from './Question'

import random from 'lodash/number/random'
import shuffle from 'lodash/collection/shuffle'

export default class Game {
  constructor (gameplay, questions, callbacks) {
    this.gameplay = gameplay
    this.questions = questions
    this.callbacks = callbacks

    this.lifebar = new Lifebar()

    this.status = 'ready'
    this.timer = null
    this.currentQuestion = {}
    this.score = []

    this.setRandomQuestion()
  }

  start () {
    if (this.status !== 'ready') return

    this.status = 'playing'
    this.timer = new Timer(0, 100, this.gameplay.duration)

    this.timer.start((val) => {
      if (val.done) {
        this.lifebar.hp = 0
        this.stop()
      } else {
        this.lifebar.hp = val.currentValue
      }

      this.callbacks.updateLifebar()
    })
  }

  stop () {
    if (this.status !== 'playing') return

    this.status = 'game over'

    if (this.timer != null) this.timer.stop()

    this.callbacks.gameOver()
  }

  setRandomQuestion () {
    if (this.status === 'game over') return

    const index = random(0, this.questions.length - 1)
    const question = this.questions.splice(index, 1)[0]

    if (this.gameplay.shuffleAnswers) shuffle(question.answers)
    this.currentQuestion = new Question(question.question, question.answers)
  }

  submitAnswer (answer) {
    if (this.status === 'game over') return
    if (this.status === 'ready') this.start()

    const score = Number(this.currentQuestion.isCorrect(answer))
    this.score.push(score)

    if (this.questions.length === 0) this.stop()

    return score
  }
}
