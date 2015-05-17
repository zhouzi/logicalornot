# Logical (Or Not)

A Game About JavaScript Logical Operators.

* [Play Now!](http://gabinaureche.com/logicalornot/)
* [Contribute](https://github.com/Zhouzi/logicalornot/blob/gh-pages/CONTRIBUTING.md)



# Change Log

## v2.1.0 - 2015-05-17

* Set back restriction to "logical operators"
* `shuffleAnswers` is now part of the gameplay's options, the answers are no more shuffled in hardcore mode

## v2.0.0 - 2015-05-14

* The game is now responsive, meaning it works on smartphones as well as desktop computers
* The timer for a round has been increased from 12 to 15
* Improved the random pick of questions to avoid repetition
* The game now also ends when the player answered all the questions
* There is now two modes:
 * **normal**: A right answer rise the timer to its maximum
 * **normal**: A wrong answer doesn't affect the timer
 * **hardcore**: A right answer rise the timer of 1 to 3 seconds
 * **hardcore**: A wrong answer drop the timer of 1 to 3 seconds
 * **hardcore**: The amount of the "gap" depends on the complexity of the question
* The answers are now displayed randomly
* The structure of a question is now pretty simple and tested
* Fixed and improved some questions
* Fixed taunts to display "So, what's the result of..." only at the start of a new round
* Added a `<noscript>` tag
* Updated description to remove restriction to JavaScript "logical operators"
* Updated CONTRIBUTING.md according to the new changes

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
