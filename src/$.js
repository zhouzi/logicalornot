export default class $ {
  constructor (selector) {
    if (typeof selector === 'string') this.node = document.querySelector(selector);
    else this.node = selector;
  }

  on (eventName, callback) {
    this.node.addEventListener(eventName, callback);

    return this;
  }

  css (rules) {
    for (let prop in rules) {
      if (!rules.hasOwnProperty(prop)) continue;
      this.node.style[prop] = rules[prop];
    }

    return this;
  }

  addClass (className) {
    this.node.classList.add(className);

    return this;
  }

  removeClass (className) {
    this.node.classList.remove(className);

    return this;
  }

  html (html) {
    if (html === undefined) return this.node.innerHTML;
    this.node.innerHTML = html;

    return this;
  }

  attr (attrName, value) {
    if (value === undefined) return this.node.getAttribute(attrName);
    else this.node.setAttribute(attrName, value);

    return this;
  }
}
