import Model from './Model'
import PubSubClass from './PubSubClass'

import questions from '../data/questions.json'
import taunts from '../data/taunts.json'

export default class Presenter {
  constructor (stream, view) {
    this.questions = questions
    this.taunts = taunts
    this.stream = stream
    this.view = view
    this.mode = 'normal'
    this.round = null

    stream.context = this

    this.updateBestScore(localStorage.getItem('bestScore') || 0)

    this.bind()

    this.view.onSelectAnswer = answer => {
      this.round.submitAnswer(answer)

      if (this.round.status !== 'game over' && this.round.questions.length > 0) {
        this.setRandomQuestion()
      } else {
        this.round.stop(true)
      }
    }

    this.view.onNewRound = this.newRound.bind(this)

    this.newRound()
    this.view.animateIntro()
  }

  bind () {
    this
      .stream
      .subscribe('round:updateLifeBar', hp => this.view.setLifeBarHp(hp))
      .subscribe('round:updateLifeBarState', lifeBarState => this.view.setLifeBarState(lifeBarState))
      .subscribe('round:newTaunt', (taunt, type) => this.view.setTaunt(taunt, type))
      .subscribe('round:gameOver', score => {
        const total = score.length
        const wins = score.reduce((nbWins, point) => point == 1 ? nbWins + 1 : nbWins, 0)
        const loses = total - wins

        this.updateBestScore(Math.max(this.bestScore, wins))
        this.view.showGameOverScreen(wins, loses, total)
      })
  }

  updateBestScore (score) {
    this.bestScore = score

    localStorage.setItem('bestScore', this.bestScore)
    this.view.setBestScore(this.bestScore)
  }

  setRandomQuestion () {
    this.round.setRandomQuestion()
    this.view.setQuestion(this.round.currentQuestion)
  }

  newRound (mode) {
    if (mode != null) this.mode = mode

    if (this.round) {
      if (this.round.status === 'game over') {
        this.view.hideGameOverScreen()
      }

      this.round.stop()
    }

    this.round = new Model(this.questions, this.taunts, this.stream, this.mode)
    this.setRandomQuestion()
  }
}
