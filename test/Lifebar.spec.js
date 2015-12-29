import Lifebar from '../src/app/classes/Lifebar'

describe('Lifebar', function () {
  it('should update the state according to the amount of hps', function () {
    const lifebar = new Lifebar()

    expect(lifebar.hp).toBe(100)
    expect(lifebar.state).toBe('normal')

    lifebar.hp = 49
    expect(lifebar.hp).toBe(49)
    expect(lifebar.state).toBe('low')

    lifebar.hp = 19
    expect(lifebar.hp).toBe(19)
    expect(lifebar.state).toBe('critical')
  })
})
