export default (w => {
  let fn = w.requestAnimationFrame ||
           w.webkitRequestAnimationFrame ||
           w.mozRequestAnimationFrame ||
           function (callback) { w.setTimeout(callback, 1000 / 60) }

  // make sure the function is called with context set to window, otherwise it causes an illegal invocation
  return (...args) => fn.apply(w, args)
})(window)
