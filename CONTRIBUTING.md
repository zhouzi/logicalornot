# Contributing

Thank you very much for your interest in Logical (Or Not)!
Below are the different ways you can contribute to the project.



## Questions

Logical (Or Not) is a question based game.
The questions are stored in the [`src/app/data/questions`](https://github.com/Zhouzi/logicalornot/blob/gh-pages/src/app/data/questions.json) file.
If you want to submit new ones, please make sure that:

* It doesn't involve any external context (`'foo' || 'bar'` is ok while `!variable || func()` is not)
* It is short and not too complex



## Taunts

"Taunts" are the little sentences that are displayed above the questions ([`src/app/data/taunts.json`](https://github.com/Zhouzi/logicalornot/blob/gh-pages/src/app/data/taunts.json)).
There is two types of taunts: the "nice" ones (when submitting a right answer) and the mean ones (when submitting a wrong answer).
So if you have some funny slang you want to share, please ensure that:

* It is funny but not trashy
* It doesn't contain insults



## Issues and Suggestions

If you faced a bug or have some feedback, suggestions, hints, or whatever, do not hesitate to [submit an "issue"](https://github.com/Zhouzi/logicalornot/issues).
I am also reachable on twitter: [@zh0uzi](http://twitter.com/zh0uzi).



## The Game

### Installation

* [Fork](https://help.github.com/articles/fork-a-repo/) this repository
* Install gulp globally: `npm install --global gulp`
* Run `npm install` (in the repository's directory)

### Workflow

To take full advantages of the ES6 capabilities, this project uses:

* [Gulp](http://gulpjs.com/) as build system
* [Babel](http://babeljs.io/) to transpile ES6 to ES5
* [webpack](http://webpack.github.io/) to use the ES6 modules syntax

#### Gulp tasks

* `gulp styles`: compile the sass files to css
* `gulp scripts`: transpile and minify ES6 files thanks to webpack
* `gulp lint`: lint the javascript source files
* `gulp watch`: watch for changes and run `styles` or `scripts`
* `gulp serve`: serve the game, watch for changes and reload the browser automatically


#### Guidelines

There's no real guidelines but just two rules to avoid getting too messy:

* Make sure that your editor uses the `.editorconfig` file
* A commit should be of the form `[type] short description` where type can be:
  * **feat**: a new feature
  * **fix**: a bug fix
  * **docs**: documentation only changes
  * **style**: changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  * **refactor**: a code change that neither fixes a bug or adds a feature
  * **test**: adding missing tests
  * **chore**: changes to the build process or auxiliary tools and libraries such as documentation generation
  * **design**: changes in the templates or sass, css files

**Note:** shamelessly stolen from the Angular [commit guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit).
