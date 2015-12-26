import PubSub from './PubSub'
import Timer from './Timer'
import Lifebar from './Lifebar'
import Question from './Question'

import rand from '../utils/rand'
import shuffle from '../utils/shuffle'

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
    this.status = 'playing'
    this.timer = new Timer(0, 100, this.gameplay.duration)

    this.timer.start((val) => {
      if (this.status === 'game over') {
        this.timer.stop()
        return
      }

      if (val.done) {
        this.status = 'game over'
        this.lifebar.hp = 0

        PubSub.publish('gameOver')
      } else {
        this.lifebar.hp = val.currentValue
      }

      PubSub.publish('updateLifebar')
    })
  }

  stop () {
    if (this.timer != null) this.timer.stop()
  }

  setRandomQuestion () {
    const index = rand(0, this.questions.length - 1)
    const question = this.questions.splice(index, 1)[0]

    if (this.gameplay.shuffleAnswers) shuffle(question.answers)
    this.currentQuestion = new Question(question.question, question.answers)

    PubSub.publish('newQuestion', this.currentQuestion)
  }

  submitAnswer (answer) {
    if (this.status === 'game over') return

    this.status = 'playing'
    this.score.push(Number(this.currentQuestion.isCorrect(answer)))
  }
}
