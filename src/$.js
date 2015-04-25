export default {
  on: function (el, eventName, callback) {
    el.addEventListener(eventName, callback);
  },

  get: function (selector) {
    return document.querySelector(selector);
  },

  css: function (el, rules) {
    for (let prop in rules) {
      if (!rules.hasOwnProperty(prop)) continue;
      el.style[prop] = rules[prop];
    }
  },

  addClass: function (el, className) {
    el.classList.add(className);
  },

  removeClass: function (el, className) {
    el.classList.remove(className);
  },

  html: function (el, html = null) {
    if (!html) return el.innerHTML;
    el.innerHTML = html;
  }
};
