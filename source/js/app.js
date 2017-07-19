import MODES from './gameModes.js'

const WIN_MESSAGES = [
  'I won!',
  'that goes to me!',
  'my point!',
  'one more to me.',
  'I won =)',
]

const LOSE_MESSAGES = [
  'you won!',
  'you won :C',
  'your point',
  'I lost!',
  'I lost :\'(',
]

const TIE_MESSAGES = [
  'tied!',
  'that\'s a tie!',
  'tie!'
]

/**
 * This class is the controller of our MVC architecture, and it is reponsible
 * to transport the actions from view to the model and to handle the order of
 * commands that will be executed by the view.
 */
export default class App {
  constructor() {
    this._view = null
    this._game = null
    this._inPlayerMode = true
  }
  
  configure(view, game) {
    this._view = view
    this._game = game

    this._game.setGameMode(MODES.classical)
    this._view.configure(this)
  }

  run() {
    this._view.run()
    this.reset()
  }

  reset() {
    let buttons = this._getFooterButtons()

    this._game.reset()

    this._view.reset()
    this._view.doCleanChat()
    this._view.doHideFooter()
    this._view.doShowLoading(0)
    this._view.doHideLoading(1000)
    this._view.doAddPcMessage('Let\'s play!', 100)
    this._view.doAddPcMessage('Your move...', 1500)
    this._view.doAddDivider(`0 x 0`, 1000)
    this._view.doShowFooter(buttons, 1000)
    this._view.doUnlockFooter()
  }

  play(playerShape) {
    let playerLabel = null

    // Check player shape and get player label
    if (playerShape === 'random') {
      playerShape = this._game.getRandomShapeId()
      playerLabel = this._game.getLabel(playerShape)
    } else {
      playerLabel = this._game.getLabel(playerShape)
    }

    // Generate pc shape and label
    let pcShape = this._game.getRandomShapeId()
    let pcLabel = this._game.getLabel(pcShape)

    // Updates the game
    let winner = this._game.play(pcShape, playerShape)

    // Format the pc message
    let resultMessage = this._getResultMessage(winner)
    let message = `${pcLabel}, ${resultMessage}`

    // Send commands to view
    this._view.doLockFooter()
    this._view.doAddPlayerMessage(playerLabel)
    this._view.doAddPcMessage(message, 100)
    this._view.doAddDivider(`${this._game.score1} x ${this._game.score2}`, 750)
    this._view.doUnlockFooter(0)
  }

  changePlayerMode() {
    this._inPlayerMode = !this._inPlayerMode
    this.reset()
  }

  changeGameMode() {

  }

  _getFooterButtons() {
    if (this._inPlayerMode) {
      return this._game.getAllShapes()
    } else {
      return [{id:'random', label:'Play'}]
    }
  }

  _getResultMessage(winner) {
    let list = []
    if (winner === -1) {
      list = TIE_MESSAGES
    } else if (winner === 0) {
      list = WIN_MESSAGES
    } else {
      list = LOSE_MESSAGES
    }

    return list[Math.floor(Math.random() * list.length)]
  }
}