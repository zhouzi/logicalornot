import animationFrame from '../utils/animationFrame'

const FPS = 60
const ease = (currentIteration, startValue, changeInValue, totalIterations) => -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue

export default class Timer {
  constructor (minValue, maxValue, duration) {
    this._timerId = null
    this.minValue = minValue
    this.maxValue = maxValue
    this.iteration = 0
    this.totalIterations = duration * FPS
  }

  start (callback) {
    (function cycle () {
      if (this.iteration >= this.totalIterations) {
        callback({ currentValue: this.maxValue, done: true })
        this._timerId = null
        return
      }

      const easingValue = ease(this.iteration, this.minValue, this.maxValue, this.totalIterations)
      const currentValue = this.maxValue - easingValue
      callback({ currentValue, done: false })

      this.iteration++
      this._timerId = animationFrame.request(cycle.bind(this, callback))
    }.bind(this))()
  }

  stop () {
    animationFrame.cancel(this._timerId)
  }

  delay (frames) {
    this.iteration = Math.max(this.iteration - (frames * FPS), 0)
  }

  forward (frames) {
    this.iteration = Math.min(this.iteration + (frames * FPS), this.totalIterations)
  }
}
