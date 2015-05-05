import gameplay from '../data/gameplay.json';

import requestAnimationFrame from '../utils/requestAnimationFrame';
import cancelAnimationFrame from '../utils/cancelAnimationFrame';
import copy from '../utils/copy';
import rand from '../utils/rand';
import ease from '../utils/ease';

const FPS = 60;

export default class RoundClass {
  constructor (questions, taunts, stream, mode) {
    this.questions       = copy(questions);
    this.taunts          = taunts;
    this.stream          = stream;
    this.gameplay        = gameplay[mode];
    this.status          = 'ready';
    this.taunt           = null;
    this.score           = [];
    this.currentQuestion = {};
    this.lifeBar         = 100;
    this.lifeBarState    = null;
    this._animateId      = null;

    this.config = {
      timer:           this.gameplay.timer,
      minValue:        0,
      maxValue:        100,
      iteration:       0,
      totalIterations: this.gameplay.duration * FPS
    };

    this.setLifeBarHp(this.config.maxValue);
    this.updateLifeBarState();
    this.setTaunt(0, 'nice');
    this.setRandomQuestion();
    this.animate();
  }



  /*-------------------------------------------*\
    animation
  \*-------------------------------------------*/

  animate () {
    if (this.status === 'game over') return;

    if (this.status === 'playing') {
      if (this.config.iteration >= this.config.totalIterations) {
        this.stop(true);
        return;
      }

      let easingValue = ease(this.config.iteration, this.config.minValue, this.config.maxValue, this.config.totalIterations);
      this.setLifeBarHp(this.config.maxValue - easingValue);

      if (this.config.timer) this.config.iteration++;
    }

    this._animateId = requestAnimationFrame(this.animate.bind(this));
  }

  stop (notify = false) {
    this.status = 'game over';
    cancelAnimationFrame(this._animateId);

    if (notify) {
      this.setLifeBarHp(0);
      this.updateLifeBarState();
      this.stream.publish('round:gameOver', this.score);
    }
  }



  /*-------------------------------------------*\
    question, answer
  \*-------------------------------------------*/

  setQuestion (question) {
    this.currentQuestion = question;

    this.stream.publish('round:newQuestion', this.currentQuestion);
    return this.currentQuestion;
  }

  setRandomQuestion () {
    let index = rand(0, this.questions.length - 1);
    let question = this.questions.splice(index, 1)[0];

    this.setQuestion(question);
  }

  static getQuestionComplexity (question) {
    let complexity;

    if (question.length >= 15) complexity = 2;
    else if (question.length >= 10) complexity = 1;
    else complexity = 0;

    return complexity;
  }

  submitAnswer (answer) {
    if (this.status === 'game over') return;

    this.status = 'playing';

    if (this.currentQuestion.answers[answer].correct === true) {
      this.riseLifeBar();
      this.score.push(1);
      this.setRandomTaunt('nice');
    } else {
      this.dropLifeBar();
      this.score.push(0);
      this.setRandomTaunt('mean');
    }

    if (this.status !== 'game over' && this.questions.length > 0) this.setRandomQuestion();
    else this.stop(true);
  }



  /*-------------------------------------------*\
    taunt
  \*-------------------------------------------*/

  setTaunt (index, type = 'nice') {
    this.stream.publish('round:newTaunt', this.taunt = this.taunts[type][index], type);
  }

  setRandomTaunt (type) {
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
    let complexity = RoundClass.getQuestionComplexity(this.currentQuestion.question);
    let gap = this.gameplay.gaps.winning[complexity] * FPS;

    this.config.iteration = Math.max(this.config.iteration - gap, 0);
  }

  dropLifeBar () {
    let complexity = RoundClass.getQuestionComplexity(this.currentQuestion.question);
    let gap = this.gameplay.gaps.losing[complexity] * FPS;

    this.config.iteration = Math.min(this.config.iteration + gap, this.config.totalIterations);
  }
}
