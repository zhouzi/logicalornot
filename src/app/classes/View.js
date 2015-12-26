import PubSub from './PubSub'

export default class View {
  constructor () {
    this.$modal = document.getElementById('modal')
    this.$lifebar = document.getElementById('life-bar')

    this.$question = document.getElementById('question')
    this.$taunt = document.getElementById('taunt')

    this.$answerLeftLabel = document.getElementById('answer-left-label')
    this.$answerLeftButton = document.getElementById('answer-left-button')

    this.$answerUpLabel = document.getElementById('answer-up-label')
    this.$answerUpButton = document.getElementById('answer-up-button')

    this.$answerRightLabel = document.getElementById('answer-right-label')
    this.$answerRightButton = document.getElementById('answer-right-button')

    this.$replayButton = document.getElementById('replay-button')

    this.$wins = document.getElementById('wins')
    this.$loses = document.getElementById('loses')

    this.$tweetMyGameButton = document.getElementById('tweet-my-game-button')
    this.$bestScore = document.getElementById('best-score')

    this.$bloody = document.getElementById('bloody')

    this.$normalModeButton = document.getElementById('normal-mode')
    this.$hardcoreModeButton = document.getElementById('hardcore-mode')

    this.bind()
  }

  bind () {
    function answerButtonListener (element) {
      if (this.isGameOverScreenVisible()) return

      const answer = element.getAttribute('data-event-data')
      PubSub.publish('selectAnswer', answer)
    }

    function replayButtonListener () {
      if (this.isGameOverScreenVisible()) PubSub.publish('newRound')
    }

    this.$answerLeftButton.addEventListener('click', answerButtonListener.bind(this, this.$answerLeftButton), false)
    this.$answerUpButton.addEventListener('click', answerButtonListener.bind(this, this.$answerUpButton), false)
    this.$answerRightButton.addEventListener('click', answerButtonListener.bind(this, this.$answerRightButton), false)

    this.$replayButton.addEventListener('click', replayButtonListener.bind(this), false)

    const keys = { 37: 'left', 38: 'up', 39: 'right', 32: 'spacebar' }
    const buttons = { left: this.$answerLeftButton, up: this.$answerUpButton, right: this.$answerRightButton, spacebar: this.$replayButton }

    document.addEventListener('keydown', event => {
      const keyName = keys[event.which]
      const button = buttons[keyName]

      if (button == null) return

      button.classList.add('active')

      // prevent scroll when pressing arrows/spacebar
      event.preventDefault()
    })

    document.addEventListener('keyup', event => {
      const keyName = keys[event.which]
      const button = buttons[keyName]

      if (button == null) return

      button.classList.remove('active')

      // those functions have no implicit this as they are called from the "window"
      if (button === this.$replayButton) replayButtonListener.call(this)
      else answerButtonListener.call(this, button)

      // prevent scroll when pressing arrows/spacebar
      event.preventDefault()
    })

    this.$normalModeButton.addEventListener('click', () => {
      if (this.$normalModeButton.classList.contains('active')) return

      this.$normalModeButton.classList.add('active')
      this.$hardcoreModeButton.classList.remove('active')

      PubSub.publish('newRound', 'normal')
    }, false)

    this.$hardcoreModeButton.addEventListener('click', () => {
      if (this.$hardcoreModeButton.classList.contains('active')) return

      this.$hardcoreModeButton.classList.add('active')
      this.$normalModeButton.classList.remove('active')

      PubSub.publish('newRound', 'hardcore')
    }, false)
  }

  setTaunt (taunt, type) {
    this.$taunt.innerHTML = taunt

    if (type === 'mean') {
      this.$bloody.classList.add('u-no-transition')
      this.$bloody.classList.add('active')
      this.$bloody.classList.remove('u-no-transition')

      setTimeout(() => this.$bloody.classList.remove('active'), 200)
    }
  }

  setQuestion (newQuestion) {
    this.$question.innerHTML = newQuestion.question

    this.$answerLeftLabel.innerHTML = newQuestion.answers[0]
    this.$answerLeftButton.setAttribute('data-event-data', newQuestion.answers[0])

    this.$answerUpLabel.innerHTML = newQuestion.answers[1]
    this.$answerUpButton.setAttribute('data-event-data', newQuestion.answers[1])

    this.$answerRightLabel.innerHTML = newQuestion.answers[2]
    this.$answerRightButton.setAttribute('data-event-data', newQuestion.answers[2])
  }

  setLifebar (hp, state) {
    this.$lifebar.style.width = hp + '%'

    if (state === 'normal') {
      this.$lifebar.classList.remove('life-bar--low')
      this.$lifebar.classList.remove('life-bar--critical')
    }

    if (state === 'low') {
      this.$lifebar.classList.remove('life-bar--critical')
      this.$lifebar.classList.add('life-bar--low')
    }

    if (state === 'critical') {
      this.$lifebar.classList.remove('life-bar--low')
      this.$lifebar.classList.add('life-bar--critical')
    }
  }

  showGameOverScreen (wins, loses, total) {
    this.$wins.innerHTML = wins
    this.$loses.innerHTML = loses

    const tweetMessage = encodeURIComponent(`Boom! Just made a score of ${wins}/${total}, come and beat me! #logicalornot http://gabinaureche.com/logicalornot via @zh0uzi`)
    this.$tweetMyGameButton.setAttribute('href', `https://twitter.com/home?status=${tweetMessage}`)

    this.$modal.classList.remove('u-hide')
    setTimeout(() => this.$modal.classList.add('active'), 100)
  }

  hideGameOverScreen () {
    this.$modal.classList.remove('active')
    setTimeout(() => this.$modal.classList.add('u-hide'), 500)
  }

  isGameOverScreenVisible () {
    return this.$modal.classList.contains('active')
  }

  setBestScore (score) {
    this.$bestScore.innerHTML = score
  }

  animateIntro () {
    setTimeout(() => document.body.classList.add('active'), 500)
  }
}
