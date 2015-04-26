import questions from './questions';
import rand from './rand';

export default class QuestionClass {
  constructor () {
    this.questions = questions;
    this.clear();
  }

  clear () {
    this.pickedIndexes = [];
    this.currentIndex = null;
  }

  getQuestion (index) {
    this.pickedIndexes.push(index);
    this.currentIndex = index;

    return this.questions[index];
  }

  get currentQuestion () {
    if (this.currentIndex === null) return {};
    return this.questions[this.currentIndex];
  }

  get randomQuestion () {
    let index = rand(0, this.questions.length - 1);
    let i = 0;

    while (this.pickedIndexes.indexOf(index) >= 0 && ++i < 10) {
      index = rand(0, this.questions.length - 1);
    }

    return this.getQuestion(index);
  }
}
