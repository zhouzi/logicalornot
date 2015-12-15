import evalToString from './evalToString'

export default (question, answer) => evalToString(question) === evalToString(answer)
