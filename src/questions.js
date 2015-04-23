const questions = [
  {
    question: 'false || true',
    answers: {
      left: { answer: 'false', correct: true },
      up: { answer: 'undefined' },
      right: { answer: 'true' }
    }
  },

  {
    question: 'null && false',
    answers: {
      left: { answer: 'false' },
      up: { answer: 'true' },
      right: { answer: 'null', correct: true }
    }
  },

  {
    question: '(false && "bar") || "foo"',
    answers: {
      left: { answer: '"bar"' },
      up: { answer: '"foo"', correct: true },
      right: { answer: 'false' }
    }
  },

  {
    question: '"foo" || "bar"',
    answers: {
      left: { answer: 'true' },
      up: { answer: '"bar"' },
      right: { answer: '"foo"', correct: true }
    }
  },

  {
    question: '"foo" && "bar" || "quz"',
    answers: {
      left: { answer: '"bar"', correct: true },
      up: { answer: '"foo"' },
      right: { answer: '"quz"' }
    }
  },

  {
    question: '!"foo" && "bar"',
    answers: {
      left: { answer: '"bar"' },
      up: { answer: 'false', correct: true },
      right: { answer: '"foo"' }
    }
  },

  {
    question: '"foo" && !(false && null)',
    answers: {
      left: { answer: 'false' },
      up: { answer: '"foo"' },
      right: { answer: 'true', correct: true }
    }
  },

  {
    question: '!undefined || "foo"',
    answers: {
      left: { answer: 'true', correct: true },
      up: { answer: '"foo"' },
      right: { answer: 'false' }
    }
  },

  {
    question: '"foo" || !!"bar"',
    answers: {
      left: { answer: 'false' },
      up: { answer: '"foo"', correct: true },
      right: { answer: 'true' }
    }
  },

  {
    question: '(null && "foo") || "bar"',
    answers: {
      left: { answer: '"foo"' },
      up: { answer: 'null' },
      right: { answer: '"bar"', correct: true }
    }
  },

  {
    question: '(null || []).push("foo")',
    answers: {
      left: { answer: '["foo"]' },
      up: { answer: 'Error' },
      right: { answer: '1', correct: true }
    }
  },

  {
    question: '("foo" || "bar").indexOf("f")',
    answers: {
      left: { answer: '0', correct: true },
      up: { answer: '-1' },
      right: { answer: '1' }
    }
  },

  {
    question: 'null || "foo" && "bar"',
    answers: {
      left: { answer: '"foo"' },
      up: { answer: '"bar"', correct: true },
      right: { answer: 'null' }
    }
  },

  {
    question: '[] && [].push("foo")',
    answers: {
      left: { answer: '"foo"' },
      up: { answer: '["foo"]' },
      right: { answer: '1', correct: true }
    }
  },

  {
    question: 'null || [] || {}',
    answers: {
      left: { answer: '"{}"' },
      up: { answer: '[]', correct: true },
      right: { answer: 'null' }
    }
  },

  {
    question: '!!!"foo"',
    answers: {
      left: { answer: 'true' },
      up: { answer: '"foo"' },
      right: { answer: 'false', correct: true }
    }
  },

  {
    question: '![].length',
    answers: {
      left: { answer: 'true', correct: true },
      up: { answer: '1' },
      right: { answer: 'false' }
    }
  },

  {
    question: '"foo" && ("bar" || null)',
    answers: {
      left: { answer: '"foo"' },
      up: { answer: '"bar"', correct: true },
      right: { answer: 'null' }
    }
  },

  {
    question: '"foo" !== ("foo" && "bar")',
    answers: {
      left: { answer: 'true', correct: true },
      up: { answer: 'false' },
      right: { answer: '"foo"' }
    }
  },

  {
    question: '2 > (3 && 0)',
    answers: {
      left: { answer: 'false' },
      up: { answer: '0' },
      right: { answer: 'true', correct: true }
    }
  }
];

export default questions;