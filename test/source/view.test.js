const View = require('../../source/js/view.js').default

/**
 * Most of these tests are only a remainder because they should be acceptance
 * tests instead of unit (i.e., they should test using the DOM elements results
 * and simulate user actions). However, these tests require more time and tools
 * to be implemented.
 */
describe('View', () => {
  it('should configure the view class')
  it('should receive reset action')
  it('should receive change player mode action')
  it('should receive play action')
  it('should receive change game mode action')
  it('should clean chat')
  it('should add a player bubble message')
  it('should add a pc bubble message')
  it('should add a chat divider')
  it('should lock footer')
  it('should unlock footer')
  it('should show footer')
  it('should hide footer')
  it('should show loading')
  it('should hide loading')

  it('should schedule animation', () => {
    let view = new View()
    let fn = sinon.spy()
    let duration = 1000

    assert.isEmpty(view._animationPool)
    view._addAnimation(fn, duration)

    assert.lengthOf(view._animationPool, 1)
    assert.hasAllKeys(view._animationPool[0], ['fn', 'duration'])
    
    view._animationPool[0].fn()
    assert.isTrue(fn.calledOnce)
    assert.equal(view._animationPool[0].duration, 1000)
  })

  it('should tick and update the animation pool', () => {
    let view = new View()
    let fn = sinon.spy()
    let duration = 1000

    let target = {fn, duration}
    view._animationPool = [target]
    view._previousTime = Date.now() - 500

    assert.isFalse(fn.called)
    assert.equal(target.duration, 1000)

    view._tick()
    assert.isFalse(fn.called)
    assert.notEqual(target.duration, 1000)
    
    view._previousTime = Date.now() - 1000
    view._tick()
    assert.isTrue(fn.calledOnce)
    assert.isBelow(target.duration, 0)
  })
})