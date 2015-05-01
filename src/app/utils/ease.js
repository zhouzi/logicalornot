export default (currentIteration, startValue, changeInValue, totalIterations) => -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
