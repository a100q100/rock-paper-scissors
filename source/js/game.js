export default class Game {
  constructor() {
    this._score1 = 0
    this._score2 = 0

    this._gameModeId = null
    this._gameModeName = null
    this._gameModeShapes = null
    this._gameModeRules = null
  }

  get score1() {
    return this._score1
  }

  get score2() {
    return this._score2
  }

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