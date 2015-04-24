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
  }

  static requestAnimationFrame (callback) {
    return requestAnimationFrame(callback);
  }

  start () {
    this.animate();
  }

  animate () {
    let self = this;

    if (self.iteration >= self.totalIterations) return;

    let easingValue = LifeBarClass.ease(self.iteration, self.startingValue, self.endingValue, self.totalIterations);

    self.lifeBarProgress.style.width = (100 - easingValue) + '%';
    self.iteration++;

    LifeBarClass.requestAnimationFrame(() => {
      self.animate.apply(self, []);
    });
  }

  drop () {
    console.log('dropped');
    if (this.iteration + this.gap >= this.totalIterations) this.iteration = this.totalIterations;
    else this.iteration += this.gap;
  }

  rise () {
    console.log('rised');
    if (this.iteration - this.gap <= 0) this.iteration = 0;
    else this.iteration -= this.gap;
  }

  // easeOutQuad from http://kirupa.googlecode.com/svn/trunk/easing.js
  static ease (currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
  }
}
