import PubSub from './PubSub'
import Timer from './Timer'
import Lifebar from './Lifebar'

export default class Game {
  constructor (gameplay) {
    this.gameplay = gameplay
    this.status = 'ready'
    this.timer = null
    this.lifebar = new Lifebar()
  }

  start () {
    this.status = 'playing'
    this.timer = new Timer(0, 100, this.gameplay.duration)

    this.timer.start((val) => {
      if (this.status === 'game over') {
        this.timer.stop()
        return
      }

      if (val.done) {
        this.status = 'game over'
        this.lifebar.hp = 0

        PubSub.publish('gameOver')
      } else {
        this.lifebar.hp = val.currentValue
      }

      PubSub.publish('updateLifebar')
    })
  }

  stop () {
    if (this.timer != null) this.timer.stop()
  }
}
