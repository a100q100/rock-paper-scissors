import * as helpers from './viewHelpers.js'

/**
 * This class is the view of our MVC architecture. It handles all interaction 
 * within the DOM, including DOM manipulation and receiving events.
 *
 * Internally, this class implements an animation scheduler, so the app 
 * (controller) can send asynchronous commands to be performed on the DOM.
 *
 * The methods in this class use the following nomenclature patterns:
 *
 * - **actionX**: are methods called by the DOM elements on click events.
 * - **doY**: are methods that will schedule an animation and, generally, are 
 *   called by the App.
 */
export default class View {
  /**
   * Constructor.
   */
  constructor() {

    /**
     * Stack of all scheduled animations. The elements are objects in the 
     * format: `{fn: <target function>, duration: <duration in milliseconds>}`.
     * @type {Array}
     */
    this._animationPool = []

    /**
     * Reference to the DOM chat container.
     * @type {HTMLElement}
     */
    this._chatElement = null

    /**
     * Reference to the DOM footer container.
     * @type {HTMLElement}
     */
    this._footerElement = null

    /**
     * Previous timestamp (used on the _tick method).
     * @type {Number}
     */
    this._previousTime = null
  }

  /**
   * Configuration method, called by the App to register the app reference on
   * this class. This method also stores the chat and footer DOM elements in 
   * order to use afterwards.
   *
   * @param {App} app - The App reference.
   */
  configure(app) {
    this._app = app
    this._chatElement = document.getElementsByClassName('cup-chat')[0]
    this._footerElement = document.getElementsByClassName('cup-game-footer')[0]
  }

  /**
   * Action to reset the game.
   */
  actionReset() {
    this._app.reset()
  }

  /**
   * Action to change the player mode (i.e., player vs computer and computer vs
   * computer).
   */
  actionChangePlayerMode() {
    this._app.changePlayerMode()
  }

  /**
   * Action to register a user play.
   *
   * @param {String} move - The move.
   */
  actionPlay(move) {
    this._app.play(move)
  }

  /**
   * Clean all chat log.
   *
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doCleanChat(time=0) {
    this._addAnimation(() => {
      this._chatElement.innerHTML = ''
    }, time)
  }

  /**
   * Add a player bubble message (on the right side).
   *
   * @param {String} message - The player message.
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doAddPlayerMessage(message, time=0) {
    this._addAnimation(() => {
      let item = helpers.createChatBubble('right', 'player', message)
      helpers.addChild(this._chatElement, item)
      helpers.scrollDown(this._chatElement)
    }, time)
  }

  /**
   * Add a pc bubble message (on the left side).
   *
   * @param {String} message - The player message.
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doAddPcMessage(message, time=0) {
    this._addAnimation(() => {
      let item = helpers.createChatBubble('left', 'pc', message)
      helpers.addChild(this._chatElement, item)
      helpers.scrollDown(this._chatElement)
    }, time)
  }

  /**
   * Add a divider after the last chat bubble.
   *
   * @param {String} message - The player message.
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doAddDivider(message, time=0) {
    this._addAnimation(() => {
      let item = helpers.createChatDivider(message)
      helpers.addChild(this._chatElement, item)
      helpers.scrollDown(this._chatElement)
    }, time)
  }

  /**
   * Lock the footer, so the user can't play any shape.
   * 
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doLockFooter(time=0) {
    this._addAnimation(() => {
      helpers.addClass(this._footerElement, 'locked')
    }, time)
  }

  /**
   * Unlock the footer, so the user can play again.
   * 
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doUnlockFooter(time=0) {
    this._addAnimation(() => {
      helpers.removeClass(this._footerElement, 'locked')
    }, time)
  }

  /**
   * Show the footer buttons.
   * 
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doShowFooter(time=0) {
    this._addAnimation(() => {
      helpers.removeClass(this._footerElement, 'hidden')
    }, time)
  }

  /**
   * Hide the footer buttons.
   * 
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doHideFooter(time=0) {
    this._addAnimation(() => {
      helpers.addClass(this._footerElement, 'hidden')
    }, time)
  }

  /**
   * Show a loading message on the chat.
   * 
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doShowLoading(time=0) {
    this._addAnimation(() => {
      let elements = document.getElementsByClassName('loading')
      if (!elements.length) {
        let html = `<i class="fa fa-spinner fa-fw fa-spin"></i>`
        let item = helpers.createChatBubble('left loading', 'pc', html)
        helpers.addChild(this._chatElement, item)
        helpers.scrollDown(this._chatElement)
      }
    }, time)
  }

  /**
   * Hide the loading message on the chat.
   * 
   * @param {Number} [time=0] - The interval to perform the command.
   */
  doHideLoading(time=0) {
    this._addAnimation(() => {
      let elements = document.getElementsByClassName('loading')
      for (let i=0; i<elements.length; i++) {
        this._chatElement.removeChild(elements[i])
      }
    }, time)
  }

  /**
   * Clean up the animation pool, canceling all pending animations.
   */
  reset() {
    this._animationPool = []
  }

  /**
   * Start the view internal update logic. This is required to update the 
   * registered animations.
   */
  run() {
    this._previousTime = Date.now()
    this._update()
  }

  /**
   * Schedule a new command. This method receives a time duration and a 
   * function. The function will be called after the <duration> time.
   *
   * @param {Function} fn - The function reference.
   * @param {Number} duration - The time in milliseconds to call the function.
   */
  _addAnimation(fn, duration) {
    this._animationPool.push({
      fn: () => fn(),
      duration: duration
    })
  }

  /**
   * Perform a single tick, updating the scheduled animation.
   */
  _tick() {
    let time = Date.now()
    if (this._animationPool.length) {
      let item = this._animationPool[0]
      let elapsed = time - this._previousTime
      item.duration -= elapsed

      if (item.duration <= 0) {
        item.fn()
        this._animationPool.shift()
      }
    }
    this._previousTime = time
  }

  /**
   * Wrapper for the tick function.
   */
  _update() {
    window.requestAnimationFrame(() => { this._update() })
    this._tick()
  }
}