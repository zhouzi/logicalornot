import PubSubClass from './PubSubClass';
import $ from '../utils/$';

export default class LifeBarClass extends PubSubClass {
  constructor () {
    super();

    let fps = 60;

    this.$lifeBarProgress = new $('.life-bar');
    this.startingValue = 0;
    this.endingValue = 100;
    this.duration = 10; // 10 second
    this.totalIterations = this.duration * fps;
    this.gap = 1 * fps; // 1 second

    this.clear();
  }

  clear () {
    this.iteration = 0;
    this.status = 'ready';
    this.renderLifeBar();
  }

  static requestAnimationFrame (callback) {
    return requestAnimationFrame(callback);
  }

  start () {
    this.status = 'playing';
    this.animate();
  }

  animate () {
    if (this.status !== 'playing') return;

    if (this.iteration >= this.totalIterations) {
      this.status = 'end';
      this.publish('game over');

      return;
    }

    this.renderLifeBar();
    this.iteration++;

    let self = this;
    LifeBarClass.requestAnimationFrame(() => {
      self.animate.apply(self, []);
    });
  }

  renderLifeBar () {
    let easingValue = LifeBarClass.ease(this.iteration, this.startingValue, this.endingValue, this.totalIterations);
    let value = 100 - easingValue;

    this.$lifeBarProgress.css({ width: value + '%' });

    if (value > 50) {
      this.$lifeBarProgress
        .removeClass('life-bar--low')
        .removeClass('life-bar--critical');
    } else if (value > 20) {
      this.$lifeBarProgress
        .addClass('life-bar--low')
        .removeClass('life-bar--critical');
    } else {
      this.$lifeBarProgress
        .addClass('life-bar--critical')
        .removeClass('life-bar--low');
    }
  }

  drop () {
    if (this.status !== 'playing') return;

    if (this.iteration + this.gap >= this.totalIterations) this.iteration = this.totalIterations;
    else this.iteration += this.gap;
  }

  rise () {
    if (this.status !== 'playing') return;

    if (this.iteration - this.gap <= 0) this.iteration = 0;
    else this.iteration -= this.gap;
  }

  // easeOutQuad from http://kirupa.googlecode.com/svn/trunk/easing.js
  static ease (currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
  }
}
