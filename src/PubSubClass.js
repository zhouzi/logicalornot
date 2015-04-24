export default class EventStreamClass {
  constructor () {
    this.events = {};
  }

  subscribe (eventName, callback) {
    (this.events[eventName] || (this.events[eventName] = [])).push(callback);
  }

  publish (eventName, ...args) {
    let subscribers = this.events[eventName];

    if (!subscribers) return;

    for (let i = 0, subscriber; subscriber = subscribers[i]; i++) {
      subscriber.apply(this, args);
    }
  }
}
