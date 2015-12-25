const noop = () => {}

export default class View {
  constructor () {
    this.$modal = document.getElementById('bind-modal')
    this.$lifeBar = document.getElementById('bind-life-bar')
    this.$elements = {}
    this.$buttons = {}

    this.onSelectAnswer = noop
    this.onNewRound = noop

    this.bind()
  }

  bind () {
    let self = this
    let keys = { 37: 'left', 38: 'up', 39: 'right', 32: 'spacebar' }

    // map data-bind buttons
    let buttons = document.querySelectorAll('[data-bind]')

    for (let i = 0, len = buttons.length, button; i < len; i++) {
      button = buttons[i]

      let keyShortcut = View.getAttribute(button, 'data-bind')

      self.$buttons[keyShortcut] = {
        element: button,
        eventName: View.getAttribute(button, 'data-event')
      }
    }

    document.addEventListener('keydown', event => {
      let keyName = keys[event.which]
      if (!keyName) return

      let button = self.$buttons[keyName]
      View.addClass(button.element, 'active')

      event.preventDefault()
    })

    document.addEventListener('keyup', event => {
      let keyName = keys[event.which]
      if (!keyName) return

      let button = self.$buttons[keyName]
      View.removeClass(button.element, 'active')
      self.publishButtonData(button)

      event.preventDefault()
    })

    document.addEventListener('click', event => {
      for (let key in self.$buttons) {
        if (!self.$buttons.hasOwnProperty(key)) continue

        if (self.$buttons[key].element.contains(event.target)) {
          event.preventDefault()
          return self.publishButtonData(self.$buttons[key])
        }
      }
    })

    this.on('normal-mode', 'click', function () {
      if (!this.render('normal-mode', 'hasClass', 'active')) {
        this.render('normal-mode', 'addClass', 'active')
        this.render('hardcore-mode', 'removeClass', 'active')

        this.onNewRound('normal')
      }
    }, this)

    this.on('hardcore-mode', 'click', function () {
      if (!this.render('hardcore-mode', 'hasClass', 'active')) {
        this.render('hardcore-mode', 'addClass', 'active')
        this.render('normal-mode', 'removeClass', 'active')

        this.onNewRound('hardcore')
      }
    }, this)
  }

  publishButtonData (button) {
    if (button.eventName === 'view:newRound') {
      if (this.isGameOverScreenVisible()) this.onNewRound()
      return
    }

    const data = button.element.getAttribute('data-event-data')
    this.onSelectAnswer(data)
  }

  $get (selector) {
    selector = 'bind-' + selector

    if (!this.$elements[selector]) {
      this.$elements[selector] = document.getElementById(selector)
    }

    return this.$elements[selector]
  }

  render (selector, method, ...args) {
    args.unshift(this.$get(selector))
    return View[method].apply(this, args)
  }

  setLifeBarState (lifeBarState) {
    if (lifeBarState === 'normal') {
      this.$lifeBar.classList.remove('life-bar--low')
      this.$lifeBar.classList.remove('life-bar--critical')
    }

    if (lifeBarState === 'low') {
      this.$lifeBar.classList.remove('life-bar--critical')
      this.$lifeBar.classList.add('life-bar--low')
    }

    if (lifeBarState === 'critical') {
      this.$lifeBar.classList.remove('life-bar--low')
      this.$lifeBar.classList.add('life-bar--critical')
    }
  }

  setTaunt (taunt, type) {
    this.render('taunt', 'html', taunt)

    if (type === 'mean') {
      this.render('bloody', 'addClass', 'u-no-transition')
      this.render('bloody', 'addClass', 'active')
      this.render('bloody', 'removeClass', 'u-no-transition')
      setTimeout(() => this.render('bloody', 'removeClass', 'active'), 200)
    }
  }

  setQuestion (newQuestion) {
    this.render('question', 'html', newQuestion.question)

    this.render('answer-left-label', 'html', newQuestion.answers[0])
    this.render('answer-left-button', 'attr', {'data-event-data': newQuestion.answers[0].toString()})

    this.render('answer-up-label', 'html', newQuestion.answers[1])
    this.render('answer-up-button', 'attr', {'data-event-data': newQuestion.answers[1].toString()})

    this.render('answer-right-label', 'html', newQuestion.answers[2])
    this.render('answer-right-button', 'attr', {'data-event-data': newQuestion.answers[2].toString()})
  }

  setLifeBarHp (hp) {
    this.$lifeBar.style.width = hp + '%'
  }

  showGameOverScreen (wins, loses, total) {
    this.render('wins', 'html', wins)
    this.render('loses', 'html', loses)

    const tweetMessage = encodeURIComponent(`Boom! Just made a score of ${wins}/${total}, come and beat me! #logicalornot http://gabinaureche.com/logicalornot via @zh0uzi`)
    this.render('tweet-my-game-button', 'attr', { href: `https://twitter.com/home?status=${tweetMessage}` })

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
    this.render('best-score', 'html', score)
  }

  animateIntro () {
    setTimeout(() => document.body.classList.add('active'), 500)
  }

  on (selector, eventName, handler, context = this) {
    let cb = handler.bind(context)

    document.addEventListener(eventName, function (event) {
      let target = event.target
      let matcher = target.matches || target.matchesSelector || target.webkitMatchesSelector || target.msMatchesSelector

      if (matcher.call(target, '#bind-' + selector)) {
        cb(event)
        event.preventDefault()
      }
    })
  }

  // statics (DOM manipulators)
  static html (element, html) {
    element.innerHTML = html
  }

  static css (element, styles) {
    for (let prop in styles) {
      if (styles.hasOwnProperty(prop)) {
        element.style[prop] = styles[prop]
      }
    }

    return element
  }

  static hasClass (element, className) {
    return element.classList.contains(className)
  }

  static addClass (element, className) {
    return element.classList.add(className)
  }

  static removeClass (element, className) {
    return element.classList.remove(className)
  }

  static attr (element, attrs) {
    for (let prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        element.setAttribute(prop, attrs[prop])
      }
    }

    return element
  }

  static getAttribute (element, attrName) {
    return element.getAttribute(attrName)
  }
}
