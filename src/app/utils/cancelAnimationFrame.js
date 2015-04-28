let cancelAnimationFrame = (function (w) {
  let fn = w.cancelAnimationFrame       ||
           w.mozCancelAnimationFrame    ||
           w.webkitCancelAnimationFrame ||
           w.msCancelAnimationFrame     ||
           w.clearTimeout;

  // make sure the function is called with context set to window, otherwise it causes an illegal invocation
  return (...args) => fn.apply(w, args);
})(window);

export default cancelAnimationFrame;
