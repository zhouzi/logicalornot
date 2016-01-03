import Game from './Game'
import BestScore from './BestScore'

import gameplay from '../data/gameplay.json'
import questions from '../data/questions.json'
import taunts from '../data/taunts.json'

import random from 'lodash/number/random'

export default class Presenter {
  constructor (view) {
    this.view = view
    this.game = null
    this.bestScore = new BestScore()
  }

  onViewReady () {
    // the best score is updated every time a game ends
    // so we need to update it manually the first time
    this.updateBestScore()

    this.newGame()
  }

  selectAnswer (answer) {
    if (this.game.submitAnswer(answer)) {
      this.setRandomTaunt('nice')
      this.riseLifeBar()
    } else {
      this.setRandomTaunt('mean')
      this.dropLifeBar()
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

    this.updateBestScore(wins)
    this.view.showGameOverScreen(wins, loses, total)
  }

  updateBestScore (score = 0) {
    this.bestScore.set(score)
    this.view.setBestScore(this.bestScore.get())
  }

  newGame (mode = 'normal') {
    this.view.hideGameOverScreen()

    if (this.game) this.game.stop()

    this.game = new Game(gameplay[mode], questions.slice(), {
      updateLifebar: this.updateLifeBar.bind(this),
      gameOver: this.showGameOverScreen.bind(this),
      setQuestion: this.view.setQuestion.bind(this.view)
    })

    this.updateLifeBar()
    this.setTaunt("So, what's the result of...")
  }

  // TODO: setTaunt might be useless and its usage could be replace by view.setTaunt
  setTaunt (index, type = 'nice') {
    const taunt =
      typeof index === 'string'
        ? index
        : taunts[type][index]

    this.view.setTaunt(taunt, type)
  }

  setRandomTaunt (type) {
    const typedTaunts = taunts[type]
    return this.setTaunt(random(0, typedTaunts.length - 1), type)
  }

  updateLifeBar () {
    this.view.setLifebar(this.game.lifebar.hp, this.game.lifebar.state)
  }
}
