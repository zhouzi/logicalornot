import ViewClass from './ViewClass';

export default class AppClass {
  constructor () {
    this.view = new ViewClass();

    this.view.renderQuestion({
      question: 'null && "foo"',
      answers: {
        left: { answer: 'null', correct: true },
        up: { answer: 'false' },
        right: { answer: '"foo"' }
      }
    });

    ViewClass.animateIntro(500);

    /*
    this.view.subscribe('selectAnswer', function (...args) {
      console.log(args);
    });
    */
  }
}
