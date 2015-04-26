import PubSubClass from './PubSubClass';
import $ from './$';
import rand from './rand';
import taunts from './taunts.json';

export default class ViewClass extends PubSubClass {
  constructor () {
    super();

    this.$document = new $(document);
    this.$body = new $('body');
    this.$bloody = new $('.bloody');
    this.$question = new $('#question');
    this.$gameOverModal = new $('.modal');
    this.$scoreBoard = new $('#score-board');
    this.$replayButton = new $('#replay-button');
    this.$tweetMyGameButton = new $('#tweet-my-game-button');
    this.$taunt = new $('#taunt');

    this.tweetMyGameMessage = 'Boom! Just made a score of {score}, come and beat me! #logicalornot http://gabinaureche.com/logicalornot via @zh0uzi';

    this.answers = {
      left: { $button: new $('#answer-left'), $label: new $('#answer-left .answer-label') },
      up: { $button: new $('#answer-up'), $label: new $('#answer-up .answer-label') },
      right: { $button: new $('#answer-right'), $label: new $('#answer-right .answer-label') }
    };

    this.bind();
    this.clear();
  }

  bind () {
    let self = this;
    let keys = { 37: 'left', 38: 'up', 39: 'right' };
    let spacebar = 32;
    let answer;

    this.$document
      .on('keydown', function (e) {
        if (e.which === spacebar) {
          self.$replayButton.addClass('active');
          e.preventDefault();
        } else {
          answer = keys[e.which];

          if (answer) {
            self.answers[answer].$button.addClass('active');
            e.preventDefault();
          }
        }
      })
      .on('keyup', function (e) {
        if (e.which === spacebar) {
          self.$replayButton.removeClass('active');
          self.publish('replay game', answer);
          e.preventDefault();
        } else {
          answer = keys[e.which];

          if (answer) {
            self.answers[answer].$button.removeClass('active');
            self.publish('selectAnswer', answer);
            e.preventDefault();
          }
        }
      })
      .on('click', function (e) {
        let target = e.target;

        if (target === self.$replayButton.node) {
          self.publish('replay game', answer);
          e.preventDefault();
        } else {
          for (let key in self.answers) {
            if (self.answers.hasOwnProperty(key) && self.answers[key].$button.node === target) {
              self.publish('selectAnswer', key);
              e.preventDefault();
              return;
            }
          }
        }
      });
  }

  clear () {
    this.hideGameOverModal();
    this.$taunt.html(this.$taunt.attr('data-initial-message'));
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

  renderQuestion (question) {
    this.$question.html(question.question);

    for (let key in question.answers) {
      if (question.answers.hasOwnProperty(key) && this.answers[key]) {
        this.answers[key].$label.html(question.answers[key].answer);
      }
    }
  }

  renderGameOverModal (score = []) {
    let template = '';

    for (let i = 0; i < score.length; i++) {
      if (score[i] === 1) template += '<span class="point point--right"></span>\n';
      else template += '<span class="point point--wrong"></span>\n';
    }

    this.$scoreBoard.html(template);
    this.renderTweetMyGameButton(score.join(''));
    this.showGameOverModal();
  }

  renderTweetMyGameButton (binaryScore) {
    let message =
      'https://twitter.com/home?status=' +
      encodeURIComponent(this.tweetMyGameMessage.replace(/\{score\}/g, binaryScore));

    this.$tweetMyGameButton.attr('href', message);
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
    $modal.removeClass('active');

    setTimeout(function () {
      $modal.addClass('u-hide');
    }, 500);
  }

  renderRandomTaunt (type = 'nice') {
    let index = rand(0, taunts[type].length - 1);
    let taunt = taunts[type][index];
    let $taunt = this.$taunt;
    let $bloody = this.$bloody;

    $taunt
      .removeClass('active')
      .html(taunt);

    if (type === 'mean') {
      $bloody
        .addClass('u-no-transition')
        .addClass('active')
        .removeClass('u-no-transition');
    }

    setTimeout(function () {
      $bloody.removeClass('active');
      $taunt.addClass('active');
    }, 150);
  }
}
