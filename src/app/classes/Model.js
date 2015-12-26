import rand from '../utils/rand'
import equals from '../utils/equals'
import shuffle from '../utils/shuffle'

export default class Model {
  constructor (questions, gameplay) {
    this.questions = questions
    this.gameplay = gameplay
    this.status = 'ready'
    this.taunt = null
    this.score = []
    this.currentQuestion = {}
    this.lifebar = 100
  }

  stop () {
    this.status = 'game over'
  }

  // question, answer
  setQuestion (question) {
    if (this.gameplay.shuffleAnswers) shuffle(question.answers)
    this.currentQuestion = question

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
    this.score.push(Number(this.isCorrect(answer)))
  }

  set lifebar (hp) {
    this.hp = hp
    this.state =
      this.hp > 50
        ? 'normal'
        : this.hp > 20
          ? 'low'
          : 'critical'
  }
}
