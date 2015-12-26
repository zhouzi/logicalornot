import Model from './Model'
import Timer from './Timer'

import gameplay from '../data/gameplay.json'
import questions from '../data/questions.json'
import taunts from '../data/taunts.json'

import rand from '../utils/rand'

export default class Presenter {
  constructor (view) {
    this.view = view
    this.mode = 'normal'
    this.round = null

    this.updateBestScore(window.localStorage.getItem('bestScore') || 0)

    this.view.onSelectAnswer = answer => {
      if (this.round.status !== 'playing') {
        this.startTimer()
      }

      this.round.submitAnswer(answer)

      if (this.round.currentQuestion.isCorrect(answer)) {
        this.setRandomTaunt('nice')
        this.riseLifeBar()
      } else {
        this.setRandomTaunt('mean')
        this.dropLifeBar()
      }

      if (this.round.status !== 'game over' && this.round.questions.length > 0) {
        this.setRandomQuestion()
      } else {
        this.round.stop()
        this.timer.stop()
        this.showGameOverScreen()
      }
    }

    this.view.onNewRound = this.newRound.bind(this)

    this.newRound()
    this.view.animateIntro()
  }

  riseLifeBar () {
    const complexity = this.round.currentQuestion.complexity
    const points = this.round.gameplay.gaps.winning[complexity]
    this.timer.delay(points)
  }

  dropLifeBar () {
    const complexity = this.round.currentQuestion.complexity
    const points = this.round.gameplay.gaps.losing[complexity]
    this.timer.forward(points)
  }

  showGameOverScreen () {
    const score = this.round.score
    const total = score.length
    const wins = score.reduce((nbWins, point) => nbWins + point, 0)
    const loses = total - wins

    this.updateBestScore(Math.max(this.bestScore, wins))
    this.view.showGameOverScreen(wins, loses, total)
  }

  updateBestScore (score) {
    this.bestScore = score

    window.localStorage.setItem('bestScore', this.bestScore)
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

    if (this.timer != null) this.timer.stop()
    this.round = new Model(questions.slice(), gameplay[this.mode])
    this.setTaunt("So, what's the result of...")
    this.updateLifeBar()
    this.setRandomQuestion()
  }

  setTaunt (index, type = 'nice') {
    const taunt =
      typeof index === 'string'
        ? index
        : taunts[type][index]

    this.view.setTaunt(taunt, type)
  }

  setRandomTaunt (type) {
    let typedTaunts = taunts[type]
    return this.setTaunt(rand(0, typedTaunts.length - 1), type)
  }

  updateLifeBar () {
    this.view.setLifebar(this.round.hp, this.round.state)
  }

  startTimer () {
    this.timer = new Timer(0, 100, this.round.gameplay.duration)

    this.timer.start((val) => {
      if (this.round.status === 'game over') {
        this.timer.stop()
        return
      }

      if (val.done) {
        this.round.stop()
        this.round.lifebar = 0
        this.showGameOverScreen()
      } else {
        this.round.lifebar = val.currentValue
      }

      this.updateLifeBar()
    })
  }
}
