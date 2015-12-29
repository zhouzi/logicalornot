import PubSub from './PubSub'
import Timer from './Timer'
import Lifebar from './Lifebar'
import Question from './Question'

import random from 'lodash/number/random'
import shuffle from 'lodash/collection/shuffle'

export default class Game {
  constructor (gameplay, questions) {
    this.gameplay = gameplay
    this.questions = questions

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
        this.stop()
        this.lifebar.hp = 0

        PubSub.publish('gameOver')
      } else {
        this.lifebar.hp = val.currentValue
      }

      PubSub.publish('updateLifebar')
    })
  }

  stop () {
    if (this.status !== 'playing') return

    this.status = 'game over'
    if (this.timer != null) this.timer.stop()
  }

  setRandomQuestion () {
    if (this.status === 'game over') return

    const index = random(0, this.questions.length - 1)
    const question = this.questions.splice(index, 1)[0]

    if (this.gameplay.shuffleAnswers) shuffle(question.answers)
    this.currentQuestion = new Question(question.question, question.answers)

    PubSub.publish('newQuestion', this.currentQuestion)
  }

  submitAnswer (answer) {
    if (this.status === 'game over') return
    if (this.status === 'ready') this.start()

    this.score.push(Number(this.currentQuestion.isCorrect(answer)))
    if (this.questions.length === 0) this.stop()
  }
}
