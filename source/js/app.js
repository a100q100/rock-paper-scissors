import MODES from './gameModes.js'

// Possible return messages, depending on the result of the match.
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
  /**
   * Constructor.
   */
  constructor() {
    /**
     * Instance of View.
     * @type {View}
     */
    this._view = null

    /**
     * Instance of Game.
     * @type {Game}
     */
    this._game = null
    
    /**
     * Whether the player is on or not (if false, the pc is playing against 
     * pc). Defaults to true.
     * @type {Boolean}
     */
    this._inPlayerMode = true
  }
  
  /**
   * Configure the App with the references to view and game.
   *
   * @param {View} view - The view instance.
   * @param {Game} game - The game instance.
   */
  configure(view, game) {
    this._view = view
    this._game = game

    this._game.setGameMode(MODES.classical)
    this._view.configure(this)
  }

  /**
   * Start the game. This method will send the initialization commands to the 
   * view.
   */
  run() {
    this._view.run()
    this.reset()
  }

  /**
   * Reset the game, erasing all history of plays (the chat) and the scores.
   */
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

  /**
   * Register a player move. You must send a game mode shape or 'random' string
   * for random plays. This method will send the commands to view to animate
   * the results of the play.
   *
   * @param {String} playerShape - The shape of the current game mode or 
   *        'random'.
   */
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

  /**
   * Change the player mode (player vs pc OR pc vs pc), toggling between them.
   */
  changePlayerMode() {
    this._inPlayerMode = !this._inPlayerMode
    this.reset()
  }

  /**
   * Helper to get the footer button specifications. It will return the game
   * mode shapes or a specification for a random button, depending on the 
   * player mode.
   *
   * @returns {Array} Array of {id, label} objects.
   */
  _getFooterButtons() {
    if (this._inPlayerMode) {
      return this._game.getAllShapes()
    } else {
      return [{id:'random', label:'Play'}]
    }
  }

  /**
   * Helper to create a result message, e.g., "You lose".
   *
   * @param {Number} winner - 0 for pc, 1 for player, -1 for tie
   * @return {String}
   */
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