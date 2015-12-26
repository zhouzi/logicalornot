const subscribers = {}

export default {
  subscribe (eventName, callback) {
    if (subscribers[eventName] == null) subscribers[eventName] = []
    subscribers[eventName].push(callback)

    return this
  },

  publish (eventName, ...args) {
    const callbacks = subscribers[eventName] || []
    callbacks.forEach((callback) => { callback(...args) })

    return this
  }
}
