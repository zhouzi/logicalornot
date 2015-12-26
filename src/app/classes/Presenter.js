import PubSub from './PubSub'
import Game from './Game'

import gameplay from '../data/gameplay.json'
import questions from '../data/questions.json'
import taunts from '../data/taunts.json'

import rand from '../utils/rand'

export default class Presenter {
  constructor (view) {
    this.view = view
    this.mode = 'normal'

    this.game = null

    this.updateBestScore(window.localStorage.getItem('bestScore') || 0)

    PubSub
      .subscribe('selectAnswer', this.selectAnswer.bind(this))
      .subscribe('newGame', this.newGame.bind(this))
      .subscribe('updateLifebar', this.updateLifeBar.bind(this))
      .subscribe('gameOver', this.showGameOverScreen.bind(this))
      .subscribe('newQuestion', this.view.setQuestion.bind(this.view))

    this.newGame()
    this.view.animateIntro()
  }

  selectAnswer (answer) {
    if (this.game.status === 'ready') this.game.start()

    this.game.submitAnswer(answer)

    if (this.game.currentQuestion.isCorrect(answer)) {
      this.setRandomTaunt('nice')
      this.riseLifeBar()
    } else {
      this.setRandomTaunt('mean')
      this.dropLifeBar()
    }

    if (this.game.status !== 'game over' && this.game.questions.length > 0) {
      this.game.setRandomQuestion()
    } else {
      this.game.stop()
      this.showGameOverScreen()
    }
  }

  riseLifeBar () {
    const complexity = this.game.currentQuestion.complexity
    const points = this.game.gameplay.gaps.winning[complexity]
    this.game.timer.delay(points)
  }

  dropLifeBar () {
    const complexity = this.game.currentQuestion.complexity
    const points = this.game.gameplay.gaps.losing[complexity]
    this.game.timer.forward(points)
  }

  showGameOverScreen () {
    const score = this.game.score
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

  newGame (mode) {
    if (mode != null) this.mode = mode

    this.view.hideGameOverScreen()

    if (this.game) this.game.stop()

    this.game = new Game(gameplay[this.mode], questions.slice())
    this.updateLifeBar()
    this.setTaunt("So, what's the result of...")
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
