const MODES = require('../../source/js/gameModes.js').default

function _createMode() {
  return JSON.parse(JSON.stringify(MODES.classical))
}

describe('Game', () => {
  let Game = null

  before(() => {
    Game = require('../../source/js/game.js').default
  })

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

  it('should generate a random play')
  it('should return list of all possible plays')
  it('should check which player won the round')
  it('should register a play and update score')
  it('should reset the game')
})