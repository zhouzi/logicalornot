/* global describe, it, jasmine, expect */

import PubSub from '../src/app/classes/PubSub'

describe('PubSub', function () {
  it('should trigger a callback for a given event name', function () {
    const spy = jasmine.createSpy()
    const arg1 = { foo: 'bar' }
    const arg2 = ['quz']

    PubSub
      .subscribe('someEvent', spy)
      .publish('someEvent', arg1, arg2)

    expect(spy).toHaveBeenCalledWith(arg1, arg2)
  })
})
