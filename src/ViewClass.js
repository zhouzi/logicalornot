export default class ViewClass {
  constructor () {
    this.question = document.getElementById('question');

    this.answers = {
      left: { button: document.getElementById('answer-left'), label: document.querySelector('#answer-left .answer-label') },
      up: { button: document.getElementById('answer-up'), label: document.querySelector('#answer-up .answer-label') },
      right: { button: document.getElementById('answer-right'), label: document.querySelector('#answer-right .answer-label') }
    };

    this.events = {};

    this.bind();
  }

  static animateIntro (delay = 1000) {
    document.body.className = '';

    setTimeout(function () {
      document.body.className = 'active';
    }, delay);
  }

  bind () {
    let self = this;
    let keys = { 37: 'left', 38: 'up', 39: 'right' };
    let answer;

    document.addEventListener('keydown', function (e) {
      answer = keys[e.which];

      if (answer) {
        self.answers[answer].button.className = 'active';
        e.preventDefault();
      }
    });

    document.addEventListener('keyup', function (e) {
      answer = keys[e.which];

      if (answer) {
        self.answers[answer].button.className = '';
        self.publish('selectAnswer', answer);
        e.preventDefault();
      }
    });

    document.addEventListener('click', function (e) {
      let target = e.target;

      for (let key in self.answers) {
        if (self.answers.hasOwnProperty(key) && self.answers[key].button === target) {
          self.publish('selectAnswer', key);
          e.preventDefault();
          return;
        }
      }
    });
  }

  subscribe (eventName, callback) {
    (this.events[eventName] || (this.events[eventName] = [])).push(callback);
  }

  publish (eventName, ...args) {
    let subscribers = this.events[eventName];

    if (!subscribers) return;

    for (let i = 0, subscriber; subscriber = subscribers[i]; i++) {
      subscriber.apply(this, args);
    }
  }

  renderQuestion (question) {
    this.question.innerHTML = question.question;
    this.answers.left.label.innerHTML = question.answers.left.answer;
    this.answers.up.label.innerHTML = question.answers.up.answer;
    this.answers.right.label.innerHTML = question.answers.right.answer;
  }
}
