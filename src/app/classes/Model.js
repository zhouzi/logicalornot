import Question from './Question'

import rand from '../utils/rand'
import shuffle from '../utils/shuffle'

export default class Model {
  constructor (questions, gameplay) {
    this.questions = questions
    this.gameplay = gameplay
    this.status = 'ready'
    this.score = []
    this.currentQuestion = {}
  }

  setQuestion (question) {
    if (this.gameplay.shuffleAnswers) shuffle(question.answers)
    this.currentQuestion = new Question(question.question, question.answers)

    return this.currentQuestion
  }

  setRandomQuestion () {
    let index = rand(0, this.questions.length - 1)
    let question = this.questions.splice(index, 1)[0]

    this.setQuestion(question)
  }

  submitAnswer (answer) {
    if (this.status === 'game over') return

    this.status = 'playing'
    this.score.push(Number(this.currentQuestion.isCorrect(answer)))
  }
}
