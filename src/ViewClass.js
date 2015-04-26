import PubSubClass from './PubSubClass';
import $ from './$';

export default class ViewClass extends PubSubClass {
  constructor () {
    super();

    this.$document = new $(document);
    this.$body = new $('body');
    this.$question = new $('#question');
    this.$gameOverModal = new $('.modal');
    this.$scoreBoard = new $('#score-board');

    this.answers = {
      left: { $button: new $('#answer-left'), $label: new $('#answer-left .answer-label') },
      up: { $button: new $('#answer-up'), $label: new $('#answer-up .answer-label') },
      right: { $button: new $('#answer-right'), $label: new $('#answer-right .answer-label') }
    };

    this.bind();
  }

  animateIntro (delay = 1000) {
    let $body = this.$body;

    $body
      .addClass('u-no-transition')
      .removeClass('active')
      .removeClass('u-no-transition');

    setTimeout(function () {
      $body.addClass('active');
    }, delay);
  }

  bind () {
    let self = this;
    let keys = { 37: 'left', 38: 'up', 39: 'right' };
    let answer;

    this.$document
      .on('keydown', function (e) {
        answer = keys[e.which];

        if (answer) {
          self.answers[answer].$button.addClass('active');
          e.preventDefault();
        }
      })
      .on('keyup', function (e) {
        answer = keys[e.which];

        if (answer) {
          self.answers[answer].$button.removeClass('active');
          self.publish('selectAnswer', answer);
          e.preventDefault();
        }
      })
      .on('click', function (e) {
        let target = e.target;

        for (let key in self.answers) {
          if (self.answers.hasOwnProperty(key) && self.answers[key].$button.node === target) {
            self.publish('selectAnswer', key);
            e.preventDefault();
            return;
          }
        }
      });
  }

  renderQuestion (question) {
    this.$question.html(question.question);

    for (let key in question.answers) {
      if (question.answers.hasOwnProperty(key) && this.answers[key]) {
        this.answers[key].$label.html(question.answers[key].answer);
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

    this.$scoreBoard.html(template);
    this.showGameOverModal();
  }

  showGameOverModal () {
    let $modal = this.$gameOverModal;
    $modal.removeClass('u-hide');

    setTimeout(function () {
      $modal.addClass('active');
    }, 0);
  }

  hideGameOverModal () {
    let $modal = this.$gameOverModal;

    $modal
      .addClass('u-hide')
      .removeClass('active');
  }
}
