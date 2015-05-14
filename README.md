# Logical (Or Not)

A Game About JavaScript Logical Operators.

* [Play Now!](http://gabinaureche.com/logicalornot/)
* [Contribute](https://github.com/Zhouzi/logicalornot/blob/gh-pages/CONTRIBUTING.md)



# Change Log

## v2.0.0 - [Unreleased]

* [x] Design the mobile experience
* [x] Increase round duration from 12 to 15
* [x] Improve random pick to avoid repetition *(copy list, splice picked items)*
  * [x] Make a local copy of the questions
  * [x] When picking a random question, remove it from the local copy
  * [x] When running out of questions, show the game over modal
* [x] Make the winning and losing gap depends on the complexity of the question
  * [x] Giving a wrong answer to an easy question decrease a lot
  * [x] Giving a right answer to an easy question increase a little
  * [x] Giving a wrong answer to a hard question decrease a little
  * [x] Giving a right answer to a hard question increase a lot
* [x] Added two modes: "normal" and "hardcore"
  * [x] Both modes have a timer of 15 seconds but...
  * [x] **normal mode**: a right answer gives 15 seconds (reseting the life bar to 100%) while a wrong one has no effects
  * [x] **hardcore**: a right answer gives 1-3 seconds while a wrong one drops the life bar of 1-3 seconds (the amount depends on the complexity of the question)
* [ ] Add a `<noscript></noscript>` tag
* [ ] Display "So, what's the result of..." only the first time
* [x] Simplify the model of a question
* [x] Add spec to make sure that every questions has its correct answer
* [ ] Shuffle the answers' order
* [ ] Update CONTRIBUTING.md
* [ ] Improve some questions

## v1.1.0 - 2015-05-02

* Clarify score in the game over modal and tweet
* Display and store user's best score
* Add unit tests

## v1.0.0 - 2015-04-29

* Complete refactor to separate concerns
  * Model: RoundClass
  * View: ViewClass
  * Controller: GameClass
  * The three communicate through a shared event stream
* Life bar now change color depending on life bar's state (normal, low or critical)
* Add CONTRIBUTING.md
* Add eslint and gulp task
* Increase game duration to 12 (instead of 10)
* Add 10 "easy" questions
* The first question is now also set randomly (instead of always picking the first one) 

## v0.0.1 - 2015-04-26

* Setup repository, first version
* The first question starts the game
* Display a random question after an answer
* Added 20 questions [`src/app/data/questions`](https://github.com/Zhouzi/logicalornot/blob/gh-pages/src/app/data/questions.json)
* Added life bar
  * Takes 10 seconds to go from 100% to 0%
  * When giving a wrong answer, lose 1 second
  * When giving a right answer, win 1 second
* Added a Game Over modal
  * Display the score and offer a way to tweet it
  * The replay button, mapped to the space bar, restarts the game (you can restart the game at any moment)
* When giving a wrong answer, screen blinks with a "bloody" effect
* When giving an answer, show a random taunt depending on whether the answer is correct or not [`src/app/data/taunts.json`](https://github.com/Zhouzi/logicalornot/blob/gh-pages/src/app/data/taunts.json)



# Resources

I learned a lot while building "Logical (Or Not)" so I decided to share what I found particularly interesting here.
You definitely got to check dem out!

* [ECMAScript 6 modules: the final syntax](http://www.2ality.com/2014/09/es6-modules-final.html)
* [Animating with Robert Penner's Easing Functions](http://www.kirupa.com/html5/animating_with_easing_functions_in_javascript.htm)
* [Understanding Sass Lists](http://hugogiraudel.com/2013/07/15/understanding-sass-lists/)
* [How to Establish a Modular Typographic Scale](http://webdesign.tutsplus.com/articles/how-to-establish-a-modular-typographic-scale--webdesign-14927)
* [Modular Scale](http://www.modularscale.com/)
* [Cubic Bezier Builder](http://cubic-bezier.com/)
