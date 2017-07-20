/**
 * Game modes.
 */
const MODES = {
  // Classical mode, using rock, paper and scissors
  classical: {
    id: 'classical',
    name: 'Classical',
    shapes: [
      {id:'paper', label:'Paper'},
      {id:'rock', label:'Rock'},
      {id:'scissor', label:'Scissor'}
    ],
    rules: {
      'paper': ['rock'],
      'scissor': ['paper'],
      'rock': ['scissor']
    }
  },
}
export default MODES