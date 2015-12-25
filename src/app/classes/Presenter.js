import Model from './Model'
import Timer from './Timer'

import gameplay from '../data/gameplay.json'
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

    this.updateBestScore(window.localStorage.getItem('bestScore') || 0)

    this.bind()

    this.view.onSelectAnswer = answer => {
      if (this.round.status !== 'playing') {
        this.startTimer()
      }

      this.round.submitAnswer(answer)

      if (this.round.isCorrect(answer)) this.riseLifeBar()
      else this.dropLifeBar()

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
    const complexity = Model.getQuestionComplexity(this.round.currentQuestion.question)
    this.timer.delay(this.round.gameplay.gaps.winning[complexity])
  }

  dropLifeBar () {
    const complexity = Model.getQuestionComplexity(this.round.currentQuestion.question)
    this.timer.forward(this.round.gameplay.gaps.losing[complexity])
  }

  bind () {
    this
      .stream
      .subscribe('round:updateLifeBar', hp => this.view.setLifeBarHp(hp))
      .subscribe('round:updateLifeBarState', lifeBarState => this.view.setLifeBarState(lifeBarState))
      .subscribe('round:newTaunt', (taunt, type) => this.view.setTaunt(taunt, type))
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
    this.round = new Model(this.questions, this.taunts, this.stream, gameplay[this.mode])
    this.setRandomQuestion()
  }

  startTimer () {
    this.timer = new Timer(0, 100, this.round.gameplay.duration)

    this.timer.start((val) => {
      if (this.round.status === 'game over') {
        this.timer.stop()
        return
      }

      if (val.done) {
        this.round.setLifeBarHp(0)
        this.round.updateLifeBarState()
        this.round.stop()
        this.showGameOverScreen()
        return
      }

      this.round.setLifeBarHp(val.currentValue)
    })
  }
}
