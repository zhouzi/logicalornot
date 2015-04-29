import gameplay from '../data/gameplay.json';

import requestAnimationFrame from '../utils/requestAnimationFrame';
import cancelAnimationFrame from '../utils/cancelAnimationFrame';
import rand from '../utils/rand';
import ease from '../utils/ease';

const FPS = 60;

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
    this.lifeBar       = 100;
    this.lifeBarState  = null;
    this._animateId    = null;

    this.config = {
      minValue:        0,
      maxValue:        100,
      iteration:       0,
      totalIterations: gameplay.duration   * FPS,
      winningGap:      gameplay.winningGap * FPS,
      losingGap:       gameplay.losingGap  * FPS
    };

    this.setLifeBarHp(this.config.maxValue);
    this.updateLifeBarState();
    this.setTaunt(0, 'nice');
    this.setQuestion(0);
    this.animate();
  }



  /*-------------------------------------------*\
    question
  \*-------------------------------------------*/

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



  /*-------------------------------------------*\
    animation
  \*-------------------------------------------*/

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

  stop () {
    this.status = 'game over';
    cancelAnimationFrame(this._animateId);
  }



  /*-------------------------------------------*\
    question, answer
  \*-------------------------------------------*/

  setQuestion (index) {
    this.pickedIndexes.push(index);
    this.currentIndex = index;

    this.stream.publish('round:newQuestion', this.currentQuestion);
    return this.currentQuestion;
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
  }



  /*-------------------------------------------*\
    taunt
  \*-------------------------------------------*/

  setTaunt (index, type = 'nice') {
    this.stream.publish('round:newTaunt', this.taunt = this.taunts[type][index], type);
  }

  setRandomTaunt (isCorrect) {
    let type   = isCorrect ? 'nice' : 'mean';
    let taunts = this.taunts[type];

    return this.setTaunt(rand(0, taunts.length - 1), type);
  }



  /*-------------------------------------------*\
    life bar
  \*-------------------------------------------*/

  setLifeBarHp (hp) {
    this.lifeBar = hp;

    this.updateLifeBarState();
    this.stream.publish('round:updateLifeBar', hp);
  }

  updateLifeBarState () {
    let state;
    if (this.lifeBar > 50) {
      state = 'normal';
    } else if (this.lifeBar > 20) {
      state = 'low';
    } else {
      state = 'critical';
    }

    if (this.lifeBarState !== state) {
      this.lifeBarState = state;
      this.stream.publish('round:updateLifeBarState', state);
    }
  }

  riseLifeBar () {
    if (this.config.iteration - this.config.winningGap <= 0) this.config.iteration = 0;
    else this.config.iteration -= this.config.winningGap;
  }

  dropLifeBar () {
    if (this.config.iteration + this.config.losingGap >= this.config.totalIterations) this.config.iteration = this.config.totalIterations;
    else this.config.iteration += this.config.losingGap;
  }
}
