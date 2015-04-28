import requestAnimationFrame from '../utils/requestAnimationFrame';
import cancelAnimationFrame from '../utils/cancelAnimationFrame';
import rand from '../utils/rand';
import ease from '../utils/ease';

const FPS      = 60;
const DURATION = 10; // 10 seconds
const GAP      = 1; // lose or win 1 second

export default class RoundClass {
  constructor (questions, taunts, stream) {
    this.questions     = questions;
    this.taunts        = taunts;
    this.stream        = stream;
    this.status        = 'ready';
    this.taunt         = null;
    this.score         = [];
    this.currentIndex  = null;
    this.pickedIndexes = [];
    this.config        = { minValue: 0, maxValue: 100, duration: DURATION, iteration: 0, totalIterations: DURATION * FPS, gap: GAP * FPS };
    this.lifeBar       = 100;
    this._animateId    = null;

    this.setLifeBarHp(this.config.maxValue);
    this.setTaunt(0, 'nice');
    this.setQuestion(0);
    this.animate();
  }

  stop () {
    this.status = 'game over';
    cancelAnimationFrame(this._animateId);
  }

  animate () {
    if (this.status === 'game over') return;

    if (this.status === 'playing') {
      if (this.config.iteration >= this.config.totalIterations) {
        this.status = 'game over';
        this.stream.publish('round:gameOver', this.score);
        return;
      }

      let easingValue = ease(this.config.iteration, this.config.minValue, this.config.maxValue, this.config.totalIterations);
      this.setLifeBarHp(this.config.maxValue - easingValue);
      this.config.iteration++;
    }

    let self = this;
    this._animateId = requestAnimationFrame(() => self.animate.apply(self, []));
  }

  setLifeBarHp (hp) {
    this.lifeBar = hp;
    this.stream.publish('round:updateLifeBar', hp);
  }

  get currentQuestion () {
    return this.questions[this.currentIndex];
  }

  get randomIndex () {
    let index   = rand(0, this.questions.length - 1);
    let maxExec = 10;

    while (this.pickedIndexes.indexOf(index) > -1 && --maxExec > 0) {
      index = rand(0, this.questions.length - 1);
    }

    return index;
  }

  setQuestion (index) {
    this.pickedIndexes.push(index);
    this.currentIndex = index;

    this.stream.publish('new question', this.currentQuestion);
    return this.currentQuestion;
  }

  setTaunt (index, type = 'nice') {
    this.stream.publish('round:newTaunt', this.taunt = this.taunts[type][index], type);
  }

  setRandomTaunt (isCorrect) {
    let type   = isCorrect ? 'nice' : 'mean';
    let taunts = this.taunts[type];

    return this.setTaunt(rand(0, taunts.length - 1), type);
  }

  submitAnswer (answer) {
    if (this.status === 'game over') return;

    this.status = 'playing';

    let isCorrect = this.currentQuestion.answers[answer].correct === true;

    if (isCorrect) {
      this.riseLifeBar();
      this.score.push(1);
    } else {
      this.dropLifeBar();
      this.score.push(0);
    }

    this.setRandomTaunt(isCorrect);
    this.setQuestion(this.randomIndex);
    this.stream.publish('answer question', isCorrect, this.currentQuestion);
  }

  riseLifeBar () {
    if (this.config.iteration - this.config.gap <= 0) this.config.iteration = 0;
    else this.config.iteration -= this.config.gap;
  }

  dropLifeBar () {
    if (this.config.iteration + this.config.gap >= this.config.totalIterations) this.config.iteration = this.config.totalIterations;
    else this.config.iteration += this.config.gap;
  }
}
