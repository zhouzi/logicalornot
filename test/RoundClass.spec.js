import PubSubClass from '../src/app/classes/PubSubClass';
import RoundClass from '../src/app/classes/RoundClass';

let round;
let questions;
let taunts;
let stream;

beforeEach(() => {
  questions = [
    {
      "question": "false || true",
      "answers": {
        "left": { "answer": "false" },
        "up": { "answer": "true", "correct": true },
        "right": { "answer": "undefined" }
      }
    },

    {
      "question": "null && false",
      "answers": {
        "left": { "answer": "null", "correct": true },
        "up": { "answer": "false" },
        "right": { "answer": "true" }
      }
    }
  ];

  taunts = {
    "nice": ["Such skills!", "Nice one!"],
    "mean": ["Come on!","*sigh*"]
  };

  stream = new PubSubClass();
  round = new RoundClass(questions, taunts, stream);
});

it('should bootstrap the new round', () => {
  expect(round.questions.length).toBe(questions.length - 1);
  expect(round.taunts).toEqual(taunts);
  expect(round.stream).toEqual(stream);
});

it('should return the current question', () => {
  round.setQuestion(questions[0]);
  expect(round.currentQuestion).toEqual(questions[0]);
});

describe('as the time goes on', () => {
  it('should decrease life bar', () => {});
  it('should stop the round when time is over', () => {});
});

it('should make a copy of the questions object to avoid altering it', function () {
  expect(questions.length).toBe(2);
});

it('should set current question to a random one that have not be picked yet', () => {
  round.questions = [questions[0]];
  round.setRandomQuestion();
  expect(round.currentQuestion.question).toBe(questions[0].question);
});

describe('when submitting an answer', () => {
  it('should update status to playing if current status is ready', () => {
    expect(round.status).toBe('ready');

    round.submitAnswer('left');
    expect(round.status).toBe('playing');
  });

  it('should set a random question', () => {
    spyOn(round, 'setRandomQuestion');

    round.submitAnswer('left');
    expect(round.setRandomQuestion).toHaveBeenCalled();
  });

  describe('depending on the answer', () => {
    it('should drop life bar when answer is not correct', () => {
      spyOn(round, 'riseLifeBar');
      spyOn(round, 'dropLifeBar');

      round.setQuestion(questions[0]);
      round.submitAnswer('left');
      expect(round.riseLifeBar).not.toHaveBeenCalled();
      expect(round.dropLifeBar).toHaveBeenCalled();
    });

    it('should rise life bar when answer is correct', () => {
      spyOn(round, 'riseLifeBar');
      spyOn(round, 'dropLifeBar');

      round.setQuestion(questions[0]);
      round.submitAnswer('up');
      expect(round.riseLifeBar).toHaveBeenCalled();
      expect(round.dropLifeBar).not.toHaveBeenCalled();
    });

    it('should update the score', () => {
      round.setQuestion(questions[0]);
      round.submitAnswer('left');
      expect(round.score).toEqual([0]);

      round.setQuestion(questions[1]);
      round.submitAnswer('left');
      expect(round.score).toEqual([0, 1]);
    });

    it('should set a random taunt', () => {
      spyOn(round, 'setRandomTaunt');

      round.setQuestion(questions[0]);
      console.log(round.currentQuestion);
      round.submitAnswer('left');
      expect(round.setRandomTaunt).toHaveBeenCalledWith('mean');

      round.setQuestion(questions[0]);
      console.log(round.currentQuestion);
      round.submitAnswer('up');
      expect(round.setRandomTaunt).toHaveBeenCalledWith('nice');
    });
  });
});

it('should set game to game over when there\'s no more questions', function () {
  round.questions = [];
  round.submitAnswer('left');
  expect(round.status).toBe('game over');
});

it('should set taunt at given index and type', () => {
  round.setTaunt(0, 'nice');
  expect(round.taunt).toBe(taunts.nice[0]);
});

it('should set a random taunt depending on given param', () => {
  let i = 0;
  while (++i < 10) {
    round.setRandomTaunt('nice');
    expect(taunts.nice).toContain(round.taunt);
  }

  i = 0;
  while (++i < 10) {
    round.setRandomTaunt('mean');
    expect(taunts.mean).toContain(round.taunt);
  }
});

it('should set life bar hp and update life bar state', () => {
  spyOn(round, 'updateLifeBarState');

  round.setLifeBarHp(50);
  expect(round.lifeBar).toBe(50);
  expect(round.updateLifeBarState).toHaveBeenCalled();
});

describe('when updating life bar state', () => {
  beforeEach(() => round.lifeBarState = 'tralala');

  it('should set state to normal if hp > 50', () => {
    round.lifeBar = 50;
    round.updateLifeBarState();
    expect(round.lifeBarState).not.toBe('normal');

    round.lifeBar = 80;
    round.updateLifeBarState();
    expect(round.lifeBarState).toBe('normal');
  });

  it('should set state to low if hp > 20 and <= 50', () => {
    round.lifeBar = 50;
    round.updateLifeBarState();
    expect(round.lifeBarState).toBe('low');

    round.lifeBar = 21;
    round.updateLifeBarState();
    expect(round.lifeBarState).toBe('low');
  });

  it('should set state to critical if hp <= 20', () => {
    round.lifeBar = 20;
    round.updateLifeBarState();
    expect(round.lifeBarState).toBe('critical');

    round.lifeBar = 10;
    round.updateLifeBarState();
    expect(round.lifeBarState).toBe('critical');
  });
});

it('should rise life bar', () => {});
it('should drop life bar', () => {});

it('should stop the round', () => {
  expect(round.status).toBe('ready');
  round.stop();
  expect(round.status).toBe('game over');
});
