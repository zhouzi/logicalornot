export default (question, answer) => {
  question = eval.call(this, question);
  answer   = eval.call(this, answer);

  if (typeof question !== 'string') question = JSON.stringify(question);
  if (typeof answer !== 'string')   answer   = JSON.stringify(answer);

  return question === answer;
};
