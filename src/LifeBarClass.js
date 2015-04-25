import PubSubClass from './PubSubClass';

export default class LifeBarClass extends PubSubClass {
  constructor () {
    super();

    let fps = 60;

    this.lifeBarProgress = document.querySelector('.life-bar__progress');
    this.startingValue = 0;
    this.endingValue = 100;
    this.duration = 10; // 10 second
    this.iteration = 0;
    this.totalIterations = this.duration * fps;
    this.gap = 1 * fps; // 1 second
    this.status = 'ready';
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

    let easingValue = LifeBarClass.ease(this.iteration, this.startingValue, this.endingValue, this.totalIterations);

    this.lifeBarProgress.style.width = (100 - easingValue) + '%';
    this.iteration++;

    let self = this;

    LifeBarClass.requestAnimationFrame(() => {
      self.animate.apply(self, []);
    });
  }

  drop () {
    console.log('dropped');
    if (this.status !== 'playing') return;

    if (this.iteration + this.gap >= this.totalIterations) this.iteration = this.totalIterations;
    else this.iteration += this.gap;
  }

  rise () {
    console.log('rised');
    if (this.status !== 'playing') return;

    if (this.iteration - this.gap <= 0) this.iteration = 0;
    else this.iteration -= this.gap;
  }

  // easeOutQuad from http://kirupa.googlecode.com/svn/trunk/easing.js
  static ease (currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
  }
}
