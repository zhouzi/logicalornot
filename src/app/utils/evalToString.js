export default function (str) {
  str = eval(str)
  return typeof str !== 'string' ? JSON.stringify(str) : str
}
