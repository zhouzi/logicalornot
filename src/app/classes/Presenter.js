import PubSub from './PubSub'
import Model from './Model'
import Game from './Game'

import gameplay from '../data/gameplay.json'
import questions from '../data/questions.json'
import taunts from '../data/taunts.json'

import rand from '../utils/rand'

export default class Presenter {
  constructor (view) {
    this.view = view
    this.mode = 'normal'

    this.round = null
    this.game = null

    this.updateBestScore(window.localStorage.getItem('bestScore') || 0)

    PubSub
      .subscribe('selectAnswer', this.selectAnswer.bind(this))
      .subscribe('newRound', this.newRound.bind(this))
      .subscribe('updateLifebar', this.updateLifeBar.bind(this))
      .subscribe('gameOver', this.showGameOverScreen.bind(this))

    this.newRound()
    this.view.animateIntro()
  }

  selectAnswer (answer) {
    if (this.game.status === 'ready') this.game.start()

    this.round.submitAnswer(answer)

    if (this.round.currentQuestion.isCorrect(answer)) {
      this.setRandomTaunt('nice')
      this.riseLifeBar()
    } else {
      this.setRandomTaunt('mean')
      this.dropLifeBar()
    }

    if (this.game.status !== 'game over' && this.round.questions.length > 0) {
      this.setRandomQuestion()
    } else {
      this.game.stop()
      this.showGameOverScreen()
    }
  }

  riseLifeBar () {
    const complexity = this.round.currentQuestion.complexity
    const points = this.round.gameplay.gaps.winning[complexity]
    this.game.timer.delay(points)
  }

  dropLifeBar () {
    const complexity = this.round.currentQuestion.complexity
    const points = this.round.gameplay.gaps.losing[complexity]
    this.game.timer.forward(points)
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

    this.view.hideGameOverScreen()

    if (this.game) this.game.stop()

    this.round = new Model(questions.slice(), gameplay[this.mode])
    this.game = new Game(gameplay[this.mode])

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
    this.view.setLifebar(this.game.lifebar.hp, this.game.lifebar.state)
  }
}
