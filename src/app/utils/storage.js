export default (localStorage => {
  return { getItem: localStorage.getItem.bind(localStorage), setItem: localStorage.setItem.bind(localStorage) };
})(window.localStorage);
