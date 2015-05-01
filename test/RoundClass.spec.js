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

it('should fail', () => {
  expect(true).toBe(false);
});
