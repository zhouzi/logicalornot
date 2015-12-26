import equals from '../utils/equals'

export default class Question {
  constructor (question, answers) {
    this.question = question
    this.answers = answers
  }

  isCorrect (answer) {
    return equals(this.question, answer)
  }
}
