/**
 * The Game class is the model of our MVC architecture, it handles all the game
 * rules and score management.
 */
export default class Game {
  /**
   * Constructor.
   */
  constructor() {

    /**
     * Player 1 score. Default to 0.
     * @type {Number}
     */
    this._score1 = 0

    /**
     * Player 2 score. Default to 0.
     * @type {Number}
     */
    this._score2 = 0

    /**
     * ID of the current game mode.
     * @type {String}
     */
    this._gameModeId = null

    /**
     * Name of the current game mode.
     * @type {String}
     */
    this._gameModeName = null

    /**
     * List of shapes in the current game mode.
     * @type {List}
     */
    this._gameModeShapes = null

    /**
     * List of rules in the current game mode.
     * @type {Object}
     */
    this._gameModeRules = null
  }

  /**
   * The player 1 score. Default to 0 (zero).
   * @type {Number}
   */
  get score1() {
    return this._score1
  }

  /**
   * The player 2 score. Default to 0 (zero).
   * @type {Number}
   */
  get score2() {
    return this._score2
  }

  /**
   * By receiving a game specification, this method validates and setup the 
   * game mode. 
   *
   * The specification must be an object that respects the following structure:
   *
   * - **id**: a string with the ID of the game mode.
   * - **name**: a string with the name of the game mode.
   * - **shapes**: an array of objects in the format:
   *   - **id**: a string with the ID of the shape, must be unique.
   *   - **label**: a string with the label of the shape, must be unique.
   * - **rules**: an object where keys are shape IDs and values are arrays of
   *   shape IDs. This dict represents the shapes (keys) that won over other
   *   shapes (values).
   *
   * For instance, the classical rock-paper-scissors game can be represented
   * as follows:
   *
   *     {
   *       id: 'classical',
   *       name: 'Classical',
   *       shapes: [
   *         {id:'paper', label:'Paper'},
   *         {id:'rock', label:'Rock'},
   *         {id:'scissor', label:'Scissor'}
   *       ],
   *       rules: {
   *         'paper': ['rock'],
   *         'scissor': ['paper'],
   *         'rock': ['scissor']
   *       }
   *     }
   *
   * @param {Object} mode - The game mode specification (as described above).
   */
  setGameMode(mode) {
    // Validate mode type
    if (!mode) {
      throw new Error(`Invalid mode type.`)
    }

    // Validate mode id
    if (typeof mode.id !== 'string') {
      throw new Error(`Mode id must be a string. `+
                      `You provided "${mode.id}" instead.`)
    }

    // Validate mode name
    if (typeof mode.name !== 'string') {
      throw new Error(`Mode name must be a string. `+
                      `You provided "${mode.name}" instead.`)
    }

    // Validate mode shapes
    this._validateShapes(mode)

    // Validate mode rules
    this._validateRules(mode)

    this._gameModeId = mode.id
    this._gameModeName = mode.name
    this._gameModeShapes = mode.shapes
    this._gameModeRules = mode.rules
  }

  /**
   * Returns a random possible shape id.
   *
   * @returns {String} The shape id (eg. 'paper' or 'scissor')
   */
  getRandomShapeId() {
    let i = Math.floor(Math.random()*this._gameModeShapes.length)
    return this._gameModeShapes[i].id
  }

  /**
   * Returns the list of all shapes, with id and label. For example:
   *
   *     [
   *       {id:'paper', label:'Paper'},
   *       {id:'rock', label:'Rock'},
   *       {id:'scissor', label:'Scissor'}
   *     ]
   *
   * @returns {Object} The shapes object.
   */
  getAllShapes() {
    // We copy the shape so it can't be mutated
    return JSON.parse(JSON.stringify(this._gameModeShapes))
  }

  /**
   * Checks which player won for a given set of shapes. It returns `0` if the
   * player 1 won, `1` if the player 2 won, and `-1` if it is tied.
   *
   * @param {String} shape1 - The player 1 chosed shape.
   * @param {String} shape2 - The player 2 chosed shape.
   * @returns {Number}
   */
  check(shape1, shape2) {
    let cond1 = this._gameModeRules[shape1]
    let cond2 = this._gameModeRules[shape2]

    if (cond1 && cond1.indexOf(shape2) >= 0) {
      return 0
    } else if (cond2 && cond2.indexOf(shape1) >= 0) {
      return 1
    } else {
      return -1
    }
  }

  /**
   * Resets the game by setting the score to 0 for both players.
   */
  reset() {
    this._score1 = 0
    this._score2 = 0
  }

  /**
   * Checks which player won for a given set of shapes and updates the score of
   * the winner. It returns the same values of {@check} function.
   *
   * @param {String} shape1 - The player 1 chosed shape.
   * @param {String} shape2 - The player 2 chosed shape.
   * @returns {Number}
   */
  play(shape1, shape2) {
    let won = this.check(shape1, shape2)

    if (won === 0) {
      this._score1 += 1
    }
    else if (won === 1) {
      this._score2 += 1
    }

    return won
  }

  /**
   * Internal method to help the `mode.shapes` validation. It receives the mode
   * specification and throws an error if the specification is invalid.
   *
   * @param {Object} mode - The game mode specification.
   */
  _validateShapes(mode) {
    // Validate shape type
    if (!Array.isArray(mode.shapes)) {
      throw new Error(`Invalid shape type.`)
    }

    // Validate shape length
    if (mode.shapes.length <= 2) {
      throw new Error(`Mode must have at least 3 shapes.`)
    }

    // Validate shape elements
    let shapesIds = []
    let shapesLabels = []
    for (let i=0; i<mode.shapes.length; i++) {
      let shape = mode.shapes[i]

      // Validate element type and required fields
      if (!shape || !shape.id || !shape.label) {
        throw new Error(`Invalid shape element.`)
      }

      // Validate duplicated shape id 
      if (shapesIds.indexOf(shape.id) >= 0) {
        throw new Error(`Duplicated shape id "${shape.id}".`)
      }

      // Validate duplicated shape label
      if (shapesLabels.indexOf(shape.label) >= 0) {
        throw new Error(`Duplicated shape label "${shape.label}".`)
      }

      shapesIds.push(shape.id)
      shapesLabels.push(shape.label)
    }
  }

  /**
   * Internal method to help the `mode.rules` validation. It receives the mode
   * specification and throws an error if the specification is invalid.
   * 
   * @param {Object} mode - The game mode specification.
   */
  _validateRules(mode) {
    // Validate rules type
    if (!mode.rules || !Object.keys(mode.rules)) {
      throw new Error(`Invalid rules type.`)
    }

    const shapes = mode.shapes.map(x => x.id)
    let keyPool = shapes.map(x => x)
    let valuePool = shapes.map(x => x)

    // Validate rules elements
    // eg: rules = {'a': [...], 'b': [...]}
    let keys = Object.keys(mode.rules)
    for (let i=0; i<keys.length; i++) {
      // eg: key = 'a'
      // eg: values = ['b', 'c']
      let key = keys[i]
      let values = mode.rules[key]

      // Validate rule id
      if (shapes.indexOf(key) === -1) {
        throw new Error(`Invalid rules element.`)
      }
      let keyIndex = keyPool.indexOf(key)
      if (keyIndex >= 0) {
        keyPool.splice(keyIndex, 1)
      }

      // Validate rule values
      for (let j=0; j<values.length; j++) {
        let value = values[j]

        if (shapes.indexOf(value) === -1) {
          throw new Error(`Invalid rules element.`)
        }
        let valueIndex = valuePool.indexOf(value)
        if (valueIndex >= 0) {
          valuePool.splice(valueIndex, 1)
        }
      }
    }

    // Validate unused shapes
    if (keyPool.length || valuePool.length) {
      throw new Error(`Missing shape.`)
    }
  }
}