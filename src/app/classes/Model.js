import copy from '../utils/copy'
import rand from '../utils/rand'
import equals from '../utils/equals'
import shuffle from '../utils/shuffle'

export default class Model {
  constructor (questions, taunts, stream, gameplay) {
    this.questions = copy(questions)
    this.taunts = taunts
    this.stream = stream
    this.gameplay = gameplay
    this.status = 'ready'
    this.taunt = null
    this.score = []
    this.currentQuestion = {}
    this.lifeBar = 100
    this.lifeBarState = null

    this.setLifeBarHp(100)
    this.updateLifeBarState()
    this.setTaunt("So, what's the result of...")
  }

  stop () {
    this.status = 'game over'
  }

  // question, answer
  setQuestion (question) {
    if (this.gameplay.shuffleAnswers) shuffle(question.answers)
    this.currentQuestion = question

    this.stream.publish('round:newQuestion', this.currentQuestion)
    return this.currentQuestion
  }

  setRandomQuestion () {
    let index = rand(0, this.questions.length - 1)
    let question = this.questions.splice(index, 1)[0]

    this.setQuestion(question)
  }

  static getQuestionComplexity (question) {
    let complexity

    if (question.length >= 15) complexity = 2
    else if (question.length >= 10) complexity = 1
    else complexity = 0

    return complexity
  }

  isCorrect (answer) {
    return equals(this.currentQuestion.question, answer)
  }

  submitAnswer (answer) {
    if (this.status === 'game over') return

    this.status = 'playing'

    if (this.isCorrect(answer)) {
      this.score.push(1)
      this.setRandomTaunt('nice')
    } else {
      this.score.push(0)
      this.setRandomTaunt('mean')
    }
  }

  // taunt
  setTaunt (index, type = 'nice') {
    this.taunt = typeof index === 'string' ? index : this.taunts[type][index]
    this.stream.publish('round:newTaunt', this.taunt, type)
  }

  setRandomTaunt (type) {
    let taunts = this.taunts[type]
    return this.setTaunt(rand(0, taunts.length - 1), type)
  }

  // life bar
  setLifeBarHp (hp) {
    this.lifeBar = hp

    this.updateLifeBarState()
    this.stream.publish('round:updateLifeBar', hp)
  }

  updateLifeBarState () {
    let state
    if (this.lifeBar > 50) {
      state = 'normal'
    } else if (this.lifeBar > 20) {
      state = 'low'
    } else {
      state = 'critical'
    }

    if (this.lifeBarState !== state) {
      this.lifeBarState = state
      this.stream.publish('round:updateLifeBarState', state)
    }
  }
}
