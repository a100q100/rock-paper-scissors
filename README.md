# ROCK-PAPER-SCISSORS

This repository contains an implementation for a rock-paper-scissors game, made using pure JavaScript (ES6) and LESS for styling.


## Requirements (for building and testing)

- NodeJS 6.10.3+

Before building or testing the project, run:

    npm install

This will install `browserify` to handle imports, `babel` and plugins for converting ES6 code into ES5, `less` and plugins for converting LESS code into CSS, and `mocha` and `sinon` for testing. I decided to use the minimum number of dependencies as possible, so there is just a few packages.


## Building

Just run:

    npm run all

This command creates a `build/` directory in the project, and will add all processed files into it. Just open the `build/index.html` in the browser and you will have the game running.


## Testing

Just run:

    npm test

