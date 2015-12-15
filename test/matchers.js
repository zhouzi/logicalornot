import evalToString from '../src/app/utils/evalToString'

export default {
  toContainAnswer: function (util, customEqualityTesters) {
    return {
      compare: function (answers, rightAnswer) {
        let result = { pass: false }

        for (let i = 0; i < answers.length; i++) {
          if (evalToString(answers[i]) === rightAnswer) {
            result.pass = true
            break
          }
        }

        if (result.pass) result.message = `Expected ${answers} to contain answer ${rightAnswer}`
        else result.message = `Expected ${answers} to contain answer ${rightAnswer}, but wasn't found`

        return result
      }
    }
  }
}
