import ViewClass from './ViewClass';
import LifeBarClass from './LifeBarClass';
import QuestionClass from './QuestionClass';

export default class AppClass {
  constructor () {
    var self = this;

    self.view = new ViewClass();
    self.question = new QuestionClass();
    self.lifeBar = new LifeBarClass();
    self.score = [];

    self.view.renderQuestion(self.question.getQuestion(0));
    ViewClass.animateIntro(500);

    self.view.subscribe('selectAnswer', function (answer) {
      if (self.question.pickedIndexes.length === 1) self.lifeBar.start();

      if (self.question.currentQuestion.answers[answer].correct) {
        self.score.push(1);
        self.lifeBar.rise();
      } else {
        self.score.push(0);
        self.lifeBar.drop();
      }

      self.view.renderQuestion(self.question.randomQuestion);
    });

    self.lifeBar.subscribe('game over', function () {
      self.view.renderGameOverModal(self.score);
    });
  }
}
