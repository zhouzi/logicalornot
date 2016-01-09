export default class BestScore {
  constructor () {
    this.value = 0
    this.set(window.localStorage.getItem('bestScore'))
  }

  set (val) {
    val = Math.max(this.value, Number(val) || 0)

    // avoid setting localStorage item if value didn't change
    if (val !== this.value) {
      this.value = val
      window.localStorage.setItem('bestScore', val)
    }
  }

  get () {
    return this.value
  }
}
