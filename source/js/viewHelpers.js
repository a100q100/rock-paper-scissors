/**
 * This module contains helpers for creating and manipulate DOM elements.
 */

/**
 * Creates a chat bubble.
 *
 * @param {String} side - `left` or `right`.
 * @param {String} type - `pc` or `player`.
 * @param {String} message - The message.
 * @returns {HTMLElement}
 */
export function createChatBubble(side, type, message) {
  let parent = document.createElement('div')
  parent.className = `cup-chat-row ${side}`

  let child = document.createElement('div')
  child.className = `cup-chat-bubble ${type}`
  child.innerHTML = message

  parent.appendChild(child)
  return parent
}

/**
 * Creates a chat divider.
 *
 * @param {String} message - The message.
 * @returns {HTMLElement}
 */
export function createChatDivider(message) {
  let parent = document.createElement('div')
  parent.className = `cup-chat-row center`

  let child = document.createElement('div')
  child.className = `cup-chat-divider`
  child.innerHTML = message

  parent.appendChild(child)
  return parent
}

/**
 * Creates an individual footer button.
 *
 * @param {String} id - The button value.
 * @param {String} label - The button label.
 * @returns {HTMLElement}
 */
export function createFooterButton(id, label) {
  let parent = document.createElement('a')
  parent.className = `cup-button footer`

  let child = document.createElement('i')
  child.className = `fa fa-hand-${id}-o`
  child.innerHTML = message

  parent.appendChild(child)
  return parent
}

/**
 * Adds a child element into a parent container.
 *
 * @param {HTMLElement} parent - The parent element.
 * @param {HTMLElement} chilld - The child element.
 */
export function addChild(parent, child) {
  parent.appendChild(child)
}

/**
 * Adds a class into an element. This function checks if the element already
 * have the class before applying it, in order to avoid adding more than once 
 * the same class.
 *
 * @param {HTMLElement} element - The target element.
 * @param {String} class_ - The target class.
 */
export function addClass(element, class_) {
  let regex = new RegExp(`(?:^|\\s)${class_}(?!\\S)`, 'g')
  if (element.className.match(regex)) return

  element.className += ` ${class_}`
}

/**
 * Removes a class from an element.
 *
 * @param {HTMLElement} element - The target element.
 * @param {String} class_ - The target class.
 */
export function removeClass(element, class_) {
  let regex = new RegExp(`(?:^|\\s)${class_}(?!\\S)`, 'g')
  element.className = element.className.replace(regex, '')
}

/**
 * Forces the scroll all the way down of the target element.
 * 
 * @param {HTMLElement} element - The target element.
 */
export function scrollDown(element) {
  element.scrollTop = element.scrollHeight;
}