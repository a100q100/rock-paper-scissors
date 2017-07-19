const App = require('../../source/js/app.js').default

describe('App', () => {
  it('should configure the app', () => {
    let app = new App()
    let view = {configure: sinon.spy()}
    let game = {setGameMode: sinon.spy()}

    app.configure(view, game)

    assert.equal(app._view, view)
    assert.equal(app._game, game)
    assert.isTrue(view.configure.calledOnce)
    assert.isTrue(game.setGameMode.calledOnce)
  })

  it('should initialize the game', () => {
    let app = new App()
    let view = {
      run: sinon.spy(),
      reset: sinon.spy(),
      doCleanChat: sinon.spy(),
      doShowLoading: sinon.spy(),
      doHideLoading: sinon.spy(),
      doAddPcMessage: sinon.spy(),
      doAddDivider: sinon.spy(),
      doShowFooter: sinon.spy(),
      doHideFooter: sinon.spy(),
      doUnlockFooter: sinon.spy()
    }
    let game = {
      reset: sinon.spy(),
      getAllShapes: sinon.spy()
    }
    app._view = view
    app._game = game

    app.run()
    assert.isTrue(view.run.calledOnce, 'Failed at `view.run`')
    assert.isTrue(view.reset.calledOnce, 'Failed at `view.reset`')
    assert.isTrue(view.doCleanChat.calledOnce, 'Failed at `view.doCleanChat`')
    assert.isTrue(view.doShowLoading.calledOnce, 'Failed at `view.doShowLoading`')
    assert.isTrue(view.doHideLoading.calledOnce, 'Failed at `view.doHideLoading`')
    assert.isTrue(view.doAddPcMessage.called, 'Failed at `view.doAddPcMessage`')
    assert.isTrue(view.doAddDivider.calledOnce, 'Failed at `view.doAddDivider`')
    assert.isTrue(view.doShowFooter.calledOnce, 'Failed at `view.doShowFooter`')
    assert.isTrue(view.doUnlockFooter.calledOnce, 'Failed at `view.doUnlockFooter`')
    assert.isTrue(view.doHideFooter.calledOnce, 'Failed at `view.doHideFooter`')
    assert.isTrue(game.reset.calledOnce, 'Failed at `game.reset`')
    assert.isTrue(game.getAllShapes.calledOnce, 'Failed at `game.getAllShapes`')
  })

  it('should reset the game', () => {
    let app = new App()
    let view = {
      reset: sinon.spy(),
      doCleanChat: sinon.spy(),
      doShowLoading: sinon.spy(),
      doHideLoading: sinon.spy(),
      doAddPcMessage: sinon.spy(),
      doAddDivider: sinon.spy(),
      doShowFooter: sinon.spy(),
      doUnlockFooter: sinon.spy(),
      doHideFooter: sinon.spy()
    }
    let game = {
      reset: sinon.spy(),
      getAllShapes: sinon.spy()
    }
    app._view = view
    app._game = game

    app.reset()
    assert.isTrue(view.reset.calledOnce, 'Failed at `view.reset`')
    assert.isTrue(view.doCleanChat.calledOnce, 'Failed at `view.doCleanChat`')
    assert.isTrue(view.doShowLoading.calledOnce, 'Failed at `view.doShowLoading`')
    assert.isTrue(view.doHideLoading.calledOnce, 'Failed at `view.doHideLoading`')
    assert.isTrue(view.doAddPcMessage.called, 'Failed at `view.doAddPcMessage`')
    assert.isTrue(view.doAddDivider.calledOnce, 'Failed at `view.doAddDivider`')
    assert.isTrue(view.doShowFooter.calledOnce, 'Failed at `view.doShowFooter`')
    assert.isTrue(view.doUnlockFooter.calledOnce, 'Failed at `view.doUnlockFooter`')
    assert.isTrue(view.doHideFooter.calledOnce, 'Failed at `view.doHideFooter`')
    assert.isTrue(game.reset.calledOnce, 'Failed at `game.reset`')
    assert.isTrue(game.getAllShapes.calledOnce, 'Failed at `game.getAllShapes`')
  })

  it('should receive the play and compute score', () => {
    let app = new App()
    let view = {
      doLockFooter: sinon.spy(),
      doAddPlayerMessage: sinon.spy(),
      doAddPcMessage: sinon.spy(),
      doAddDivider: sinon.spy(),
      doUnlockFooter: sinon.spy(),
    }
    let game = {
      getRandomShapeId: sinon.stub(),
      getLabel: sinon.spy(),
      play: sinon.spy()
    }
    game.getRandomShapeId.returns('paper')
    app._view = view
    app._game = game

    app.play('scissor')
    assert.isTrue(view.doLockFooter.calledOnce, 'Failed at `view.doLockFooter`')
    assert.isTrue(view.doAddPlayerMessage.calledOnce, 'Failed at `view.doAddPlayerMessage`')
    assert.isTrue(view.doAddPcMessage.calledOnce, 'Failed at `view.doAddPcMessage`')
    assert.isTrue(view.doAddDivider.calledOnce, 'Failed at `view.doAddDivider`')
    assert.isTrue(view.doUnlockFooter.calledOnce, 'Failed at `view.doUnlockFooter`')
    assert.isTrue(game.getRandomShapeId.called, 'Failed at `game.getRandomShapeId`')
    assert.isTrue(game.getLabel.called, 'Failed at `game.getLabel`')
    assert.isTrue(game.play.calledOnce, 'Failed at `game.play`')
    assert.isTrue(game.play.calledWith('paper', 'scissor'), 'Failed at `game.play` -args')
  })

  it('should change the player mode', () => {
    
  })

})