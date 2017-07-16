const Game = require('../../source/js/game.js').default
const MODES = require('../../source/js/gameModes.js').default

function _createMode() {
  return JSON.parse(JSON.stringify(MODES.classical))
}

describe('Game', () => {
  it('should have score property (for both players)', () => {
    let game = new Game()

    // Testing existance and initial value
    assert.equal(game.score1, 0)
    assert.equal(game.score2, 0)

    // Testing read only
    assert.throws(() => {
      game.score1 = 10
    })
    assert.equal(game.score1, 0)

    // Testing non-initial value
    game._score1 = 5
    assert.equal(game.score1, 5)
    assert.equal(game.score2, 0)
  })

  describe('#setGameMode', () => {
    it('should load a game mode (from rule specification)', () => {
      let game = new Game()
      let mode = MODES.classical

      game.setGameMode(mode)
      assert.equal(game._gameModeId, mode.id)
      assert.equal(game._gameModeName, mode.name)
      assert.deepEqual(game._gameModeShapes, mode.shapes)
      assert.deepEqual(game._gameModeRules, mode.rules)
    })

    it('should validate invalid mode type', () => {
      let game = new Game()

      assert.throws(() => {
        game.setGameMode(null)
      }, 'Invalid mode type')
    })

    it('should validate mode ID', () => {
      let game = new Game()
      let mode = _createMode()
      mode.id = 1

      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Mode id must be a string')
    })

    it('should validate mode name', () => {
      let game = new Game()
      let mode = _createMode()
      mode.name = 1

      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Mode name must be a string')
    })

    it('should validate mode shapes', () => {
      let game = new Game()
      let mode = _createMode()

      mode.shapes = {}
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Invalid shape type', null, 'Did not throw on invalid shape type.')

      mode.shapes = [{id:'a', label:'A'}, {id:'b', label:'B'}]
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Mode must have at least 3 shapes', null, 'Did not throw on invalid shape length.')

      mode.shapes = [{id:'a', label:'A'}, {invaliid:'b', label:'B'}, {id:'c', label:'C'}]
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Invalid shape element', null, 'Did not throw on invalid shape element.')

      mode.shapes = [{id:'a', label:'A'}, {id:'a', label:'B'}, {id:'c', label:'C'}]
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Duplicated shape id', null, 'Did not throw on duplicated shape id.')

      mode.shapes = [{id:'a', label:'A'}, {id:'b', label:'B'}, {id:'c', label:'B'}]
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Duplicated shape label', null, 'Did not throw on duplicated shape label.')
    })

    it('should validate mode rules', () => {
      let game = new Game()
      let mode = _createMode()

      mode.rules = null
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Invalid rules type', null, 'Did not throw on invalid rules type.')

      mode.rules = {'invalid': ['']}
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Invalid rules element', null, 'Did not throw on invalid rules element.')

      mode.rules = {'paper': ['invalid'], 'rock':['scissor'], 'scissor':['paper']}
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Invalid rules element', null, 'Did not throw on invalid rules element.')

      mode.rules = {'paper': ['scissor'], 'rock':['scissor'], 'scissor':['paper']}
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Missing shape', null, 'Did not throw on missing shape.')

      mode.rules = {'rock':['scissor'], 'scissor':['paper']}
      assert.throws(() => {
        game.setGameMode(mode)
      }, 'Missing shape', null, 'Did not throw on missing shape.')
    })
  })

  it('should generate a random play', () => {
    /**
     * Theorethically, this test have `0.666^1000` or `7.33e-177` of chance to 
     * fail due to randomness of the choice.
     */
    let game = new Game()
    game.setGameMode(MODES.classical)

    let shapes = new Set()
    for (let i=0; i<1000; i++) {
      let shape = game.getRandomShapeId()
      shapes.add(shape)
    }

    assert.isTrue(shapes.has('paper'))
    assert.isTrue(shapes.has('rock'))
    assert.isTrue(shapes.has('scissor'))
    assert.equal(shapes.size, 3)
  })

  it('should return list of all possible plays', () => {
    let game = new Game()
    game.setGameMode(MODES.classical)

    let shapes = game.getAllShapes()
    assert.deepEqual(shapes, MODES.classical.shapes)
  })

  it('should check which player won the round', () => {
    let game = new Game()
    game.setGameMode(MODES.classical)

    assert.equal(game.check('paper', 'scissor'), 1)
    assert.equal(game.check('paper', 'rock'), 0)
    assert.equal(game.check('scissor', 'rock'), 1)
    assert.equal(game.check('scissor', 'paper'), 0)
    assert.equal(game.check('rock', 'paper'), 1)
    assert.equal(game.check('rock', 'scissor'), 0)
    assert.equal(game.check('rock', 'rock'), -1)
    assert.equal(game.check('paper', 'paper'), -1)
    assert.equal(game.check('scissor', 'scissor'), -1)
  })

  it('should reset the game', () => {
    let game = new Game()

    game._score1 = 10
    game._score2 = 10
    game.reset()
    assert.equal(game.score1, 0)
    assert.equal(game.score2, 0)
  })

  it('should register a play and update score', () => {
    let game = new Game()

    let fn = () => 1
    sinon.stub(game, 'check').callsFake(() => fn())

    game.play('paper', 'scissor')
    assert.equal(game.score1, 0)
    assert.equal(game.score2, 1)

    fn = () => 0
    game.play('rock', 'scissor')
    assert.equal(game.score1, 1)
    assert.equal(game.score2, 1)

    fn = () => 0
    game.play('paper', 'rock')
    assert.equal(game.score1, 2)
    assert.equal(game.score2, 1)

    fn = () => -1
    game.play('paper', 'paper')
    assert.equal(game.score1, 2)
    assert.equal(game.score2, 1)

  })
  
})  