import evalToString from '../utils/evalToString'

export default class Question {
  constructor (question, answers) {
    this.question = question
    this.answers = answers
  }

  isCorrect (answer) {
    return evalToString(this.question) === evalToString(answer)
  }

  get complexity () {
    const len = this.question.length
    return len >= 15
      ? 2
      : len >= 10
        ? 1
        : 0
  }
}
