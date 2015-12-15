import GameClass from './classes/GameClass'
import questions from './data/questions.json'
import taunts from './data/taunts.json'

let app = new GameClass(document, questions, taunts)
setTimeout(() => app.animateIntro(), 500)
