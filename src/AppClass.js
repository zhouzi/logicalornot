import ViewClass from './ViewClass';
import LifeBarClass from './LifeBarClass';
import QuestionClass from './QuestionClass';

export default class AppClass {
  constructor () {
    this.view = new ViewClass();
    this.question = new QuestionClass();
    this.lifeBar = new LifeBarClass();
    this.clear();

    this.bind();
    this.start();
    this.view.animateIntro();
  }

  bind () {
    let self = this;

    self.view.subscribe('selectAnswer', function (answer) {
      if (self.question.pickedIndexes.length === 1) self.lifeBar.start();
      if (self.lifeBar.status !== 'playing') return;

      if (self.question.currentQuestion.answers[answer].correct) {
        self.score.push(1);
        self.lifeBar.rise();
        self.view.renderRandomTaunt('nice');
      } else {
        self.score.push(0);
        self.lifeBar.drop();
        self.view.renderRandomTaunt('mean');
      }

      self.view.renderQuestion(self.question.randomQuestion);
    });

    self.lifeBar.subscribe('game over', function () {
      self.view.renderGameOverModal(self.score);
    });

    self.view.subscribe('replay game', function () {
      self.start();
    });
  }

  start () {
    this.view.clear();
    this.question.clear();
    this.lifeBar.clear();
    this.clear();
  }

  clear () {
    this.score = [];
    this.view.renderQuestion(this.question.getQuestion(0));
  }
}
