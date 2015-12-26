export default class Lifebar {
  constructor () {
    this.hp = 100
  }

  set hp (hp) {
    this._hp = hp

    this.state =
      hp > 50
        ? 'normal'
        : hp > 20
          ? 'low'
          : 'critical'
  }

  get hp () {
    return this._hp
  }
}
