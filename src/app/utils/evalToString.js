export default str => typeof (str = eval.call(this, str)) !== 'string' ? JSON.stringify(str) : str
