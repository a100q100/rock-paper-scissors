import App from './app.js'
import Game from './game.js'
import View from './view.js'


const app = new App()
const view = new View()
const game = new Game()

app.configure(view, game)
app.run()

global.$view = view