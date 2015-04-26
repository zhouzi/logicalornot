import PubSubClass from './PubSubClass';
import $ from './$';

export default class ViewClass extends PubSubClass {
  constructor () {
    super();

    this.question = $.get('#question');
    this.gameOverModal = $.get('.modal');
    this.scoreBoard = $.get('#score-board');

    this.answers = {
      left: { button: $.get('#answer-left'), label: $.get('#answer-left .answer-label') },
      up: { button: $.get('#answer-up'), label: $.get('#answer-up .answer-label') },
      right: { button: $.get('#answer-right'), label: $.get('#answer-right .answer-label') }
    };

    this.bind();
  }

  static animateIntro (delay = 1000) {
    let body = document.body;

    $.addClass(body, 'u-no-transition');
    $.removeClass(document.body, 'active');
    $.removeClass(body, 'u-no-transition');

    setTimeout(function () {
      $.addClass(body, 'active');
    }, delay);
  }

  bind () {
    let self = this;
    let keys = { 37: 'left', 38: 'up', 39: 'right' };
    let answer;

    $.on(document, 'keydown', function (e) {
      answer = keys[e.which];

      if (answer) {
        $.addClass(self.answers[answer].button, 'active');
        e.preventDefault();
      }
    });

    $.on(document, 'keyup', function (e) {
      answer = keys[e.which];

      if (answer) {
        $.removeClass(self.answers[answer].button, 'active');
        self.publish('selectAnswer', answer);
        e.preventDefault();
      }
    });

    $.on(document, 'click', function (e) {
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

  renderQuestion (question) {
    $.html(this.question, question.question);

    for (let key in question.answers) {
      if (question.answers.hasOwnProperty(key) && this.answers[key]) {
        $.html(this.answers[key].label, question.answers[key].answer);
      }
    }
  }

  renderGameOverModal (score = []) {
    let i = 0;
    let len = score.length;
    let point;
    let template = '';

    for (; i < len; i++) {
      point = score[i];

      if (point === 1) template += '<span class="point point--right"></span>\n';
      else template += '<span class="point point--wrong"></span>\n';
    }

    $.html(this.scoreBoard, template);

    this.showGameOverModal();
  }

  showGameOverModal () {
    let modal = this.gameOverModal;
    $.removeClass(modal, 'u-hide');

    setTimeout(function () {
      $.addClass(modal, 'active');
    });
  }

  hideGameOverModal () {
    let modal = this.gameOverModal;

    $.addClass(modal, 'u-hide');
    $.removeClass(modal, 'active');
  }
}
