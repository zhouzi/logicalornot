import ViewClass from './ViewClass';
import QuestionClass from './QuestionClass';

export default class AppClass {
  constructor () {
    var self = this;

    self.view = new ViewClass();
    self.question = new QuestionClass();

    self.view.renderQuestion(self.question.getQuestion(0));
    ViewClass.animateIntro(500);

    self.view.subscribe('selectAnswer', function (...args) {
      self.view.renderQuestion(self.question.randomQuestion);
    });
  }
}
