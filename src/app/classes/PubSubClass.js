export default class PubSubClass {
  constructor (context = this) {
    this.context = context;
    this.events  = {};
  }

  subscribe (eventName, callback) {
    //console.log('subscribe');
    (this.events[eventName] || (this.events[eventName] = [])).push(callback);

    return this;
  }

  publish (eventName, ...args) {
    //console.log('publish');
    let subscribers = this.events[eventName] || [];
    let context     = this.context;

    subscribers.forEach((callback) => {
      callback.apply(context, args);
    });

    return this;
  }
}
