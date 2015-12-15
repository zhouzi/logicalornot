import RoundClass from './RoundClass'
import ViewClass from './ViewClass'
import PubSubClass from './PubSubClass'
import storage from '../utils/storage'

export default class GameClass {
  constructor (proxy, questions, taunts) {
    this.questions = questions
    this.taunts = taunts
    this.stream = new PubSubClass(this)
    this.view = new ViewClass(proxy, this.stream)
    this.mode = 'normal'
    this.round = null
    this.bestScore = storage.getItem('bestScore') || 0

    this.updateBestScore()
    this.bind()
    this.newRound()
  }

  animateIntro () {
    this.view.render('body', 'addClass', 'active')
  }

  bind () {
    this
      .stream
      .subscribe('round:newQuestion', newQuestion => {
        this.view.render('question', 'html', newQuestion.question)

        this.view.render('answer-left-label', 'html', newQuestion.answers[0])
        this.view.render('answer-left-button', 'attr', {'data-event-data': newQuestion.answers[0].toString()})

        this.view.render('answer-up-label', 'html', newQuestion.answers[1])
        this.view.render('answer-up-button', 'attr', {'data-event-data': newQuestion.answers[1].toString()})

        this.view.render('answer-right-label', 'html', newQuestion.answers[2])
        this.view.render('answer-right-button', 'attr', {'data-event-data': newQuestion.answers[2].toString()})
      })
      .subscribe('round:updateLifeBar', hp => {
        this.view.render('life-bar', 'css', { width: `${hp}%` })
      })
      .subscribe('round:updateLifeBarState', lifeBarState => {
        if (lifeBarState === 'normal') {
          this.view.render('life-bar', 'removeClass', 'life-bar--low')
          this.view.render('life-bar', 'removeClass', 'life-bar--critical')
        } else if (lifeBarState === 'low') {
          this.view.render('life-bar', 'removeClass', 'life-bar--critical')
          this.view.render('life-bar', 'addClass', 'life-bar--low')
        } else if (lifeBarState === 'critical') {
          this.view.render('life-bar', 'removeClass', 'life-bar--low')
          this.view.render('life-bar', 'addClass', 'life-bar--critical')
        }
      })
      .subscribe('round:newTaunt', (taunt, type) => {
        this.view.render('taunt', 'html', taunt)

        if (type === 'mean') {
          this.view.render('bloody', 'addClass', 'u-no-transition')
          this.view.render('bloody', 'addClass', 'active')
          this.view.render('bloody', 'removeClass', 'u-no-transition')
        }

        let self = this
        setTimeout(() => {
          if (type === 'mean') self.view.render('bloody', 'removeClass', 'active')
        }, 200)
      })
      .subscribe('round:gameOver', score => {
        // update score board
        let wins = score.join('').match(/1/g)
        wins = wins ? wins.length : 0

        let loses = score.length - wins

        this.view.render('wins', 'html', wins)
        this.view.render('loses', 'html', loses)

        // update tweet my game button
        let baseUrl = 'https://twitter.com/home?status='
        let tweetMessage = encodeURIComponent(`Boom! Just made a score of ${wins}/${score.length}, come and beat me! #logicalornot http://gabinaureche.com/logicalornot via @zh0uzi`)

        this.view.render('tweet-my-game-button', 'attr', { href: baseUrl + tweetMessage })

        // update best score
        this.bestScore = Math.max(this.bestScore, wins)
        this.updateBestScore()

        // show game over modal
        this.view.render('modal', 'removeClass', 'u-hide')

        let self = this
        setTimeout(() => self.view.render('modal', 'addClass', 'active'), 100)
      })
      .subscribe('view:newRound', this.newRound.bind(this))
      .subscribe('view:selectAnswer', answer => this.round.submitAnswer(answer))
      .subscribe('view:normal-mode', () => {
        this.mode = 'normal'
        this.newRound('normal')
      })
      .subscribe('view:hardcore-mode', () => {
        this.mode = 'hardcore'
        this.newRound('hardcore')
      })
  }

  updateBestScore () {
    storage.setItem('bestScore', this.bestScore)
    this.view.render('best-score', 'html', this.bestScore)
  }

  newRound () {
    if (this.round) {
      if (this.round.status === 'game over') {
        this.view.render('modal', 'removeClass', 'active')

        let self = this
        setTimeout(() => self.view.render('modal', 'addClass', 'u-hide'), 500)
      }

      this.round.stop()
    }

    this.round = new RoundClass(this.questions, this.taunts, this.stream, this.mode)
  }
}
