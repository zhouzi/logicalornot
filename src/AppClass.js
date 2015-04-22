import ViewClass from './ViewClass';
import QuestionClass from './QuestionClass';

export default class AppClass {
  constructor () {
    this.view = new ViewClass();
    this.question = new QuestionClass();

    this.view.renderQuestion(this.question.getQuestion(0));
    ViewClass.animateIntro(500);

    /*
    this.view.subscribe('selectAnswer', function (...args) {
      console.log(args);
    });
    */
  }
}
