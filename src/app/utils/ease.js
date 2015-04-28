export default function (currentIteration, startValue, changeInValue, totalIterations) {
  return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}
