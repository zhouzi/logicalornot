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

it('should bootstrap the new round', () => {});
it('should return the current question', () => {});
it('should return a random index that have not be picked yet', () => {});

describe('as the time goes on', () => {
  it('should decrease life bar', () => {});
  it('should stop the round when time is over', () => {});
});

it('should set current question to the given index', () => {});
it('should set current question to a random one that have not be picked yet', () => {});

describe('when submitting an answer', () => {
  it('should update status to playing if current status is ready', () => {});

  describe('depending on the answer', () => {
    it('should rise and drop life bar', () => {});
    it('should update the score', () => {});
    it('should set a random taunt', () => {});
    it('should set a random question', () => {});
  });
});

it('should set taunt at given index and type', () => {});
it('should set a random taunt depending on given param', () => {});
it('should set life bar hp', () => {});

describe('when updating life bar state', () => {
  it('should set state to normal if hp > 50', () => {});
  it('should set state to low if hp > 20 and < 50', () => {});
  it('should set state to critical if hp < 20', () => {});
});

it('should rise life bar', () => {});
it('should drop life bar', () => {});
it('should stop the round', () => {});
