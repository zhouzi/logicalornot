/* global describe, beforeEach, it, spyOn, expect */

import Presenter from '../src/app/classes/Presenter'
import evalToString from '../src/app/utils/evalToString'

let view
let presenter

describe('Presenter', function () {
  beforeEach(function () {
    view = {
      showGameOverScreen () {},
      hideGameOverScreen () {},
      setLifebar () {},
      setTaunt () {},
      setBestScore () {},
      setQuestion () {}
    }

    presenter = new Presenter(view)
  })

  it('should update the best score and create a new game onViewReady', function () {
    const spy = spyOn(presenter, 'updateBestScore')

    expect(presenter.game).toBe(null)

    presenter.onViewReady()

    expect(spy).toHaveBeenCalled()
    expect(presenter.game).not.toBe(null)
  })

  describe('when view is ready...', function () {
    beforeEach(function () {
      presenter.onViewReady()
    })

    it('should submit an answer and update taunt/lifebar accordingly', function () {
      const riseLifebarSpy = spyOn(presenter, 'riseLifeBar')
      const dropLifebarSpy = spyOn(presenter, 'dropLifeBar')
      const tauntSpy = spyOn(presenter, 'setRandomTaunt')

      presenter.selectAnswer('0.1')

      expect(dropLifebarSpy).toHaveBeenCalled()
      expect(tauntSpy).toHaveBeenCalledWith('mean')

      const rightAnswer = evalToString(presenter.game.currentQuestion.question)
      presenter.selectAnswer(rightAnswer)

      expect(riseLifebarSpy).toHaveBeenCalled()
      expect(tauntSpy).toHaveBeenCalledWith('nice')
    })

    it('should update best score and show the game over screen', function () {
      presenter.onViewReady()

      const bestScoreSpy = spyOn(presenter, 'updateBestScore')
      const bestScoreViewSpy = spyOn(presenter.view, 'showGameOverScreen')

      presenter.game.score = [0, 1, 1, 0]
      presenter.showGameOverScreen()

      expect(bestScoreSpy).toHaveBeenCalledWith(2)
      expect(bestScoreViewSpy).toHaveBeenCalledWith(2, 2, 4)
    })

    it('should update the best score', function () {
      const bestScoreSpy = spyOn(presenter.bestScore, 'set')
      const bestScoreViewSpy = spyOn(view, 'setBestScore')

      spyOn(presenter.bestScore, 'get').and.returnValue(12)

      presenter.updateBestScore(10)

      expect(bestScoreSpy).toHaveBeenCalledWith(10)
      expect(bestScoreViewSpy).toHaveBeenCalledWith(12)
    })

    it('should create a new game', function () {
      const oldGame = presenter.game
      const gameOverScreenSpy = spyOn(view, 'hideGameOverScreen')
      const setQuestionSpy = spyOn(view, 'setQuestion')
      const updateLifebarSpy = spyOn(presenter, 'updateLifeBar')
      const setTauntSpy = spyOn(presenter, 'setTaunt')

      expect(presenter.game).toBe(oldGame)

      presenter.newGame()

      expect(presenter.game).not.toBe(oldGame)
      expect(gameOverScreenSpy).toHaveBeenCalled()
      expect(setQuestionSpy).toHaveBeenCalled()
      expect(updateLifebarSpy).toHaveBeenCalled()
      expect(setTauntSpy).toHaveBeenCalledWith("So, what's the result of...")
    })

    it('should set taunt at given index and type', function () {
      const viewSpy = spyOn(view, 'setTaunt')
      presenter.setTaunt(2, 'nice')

      expect(presenter.taunt).not.toBe("So, what's the result of...")
      expect(viewSpy).toHaveBeenCalled()
    })

    it('should set a given taunt', function () {
      const viewSpy = spyOn(view, 'setTaunt')
      presenter.setTaunt('Hello there!')

      expect(viewSpy).toHaveBeenCalledWith('Hello there!', 'nice')
    })
  })
})
