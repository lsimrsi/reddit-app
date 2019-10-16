# Reddit App

This is an app that gets the first 25 posts from a subreddit input by the user. It has a Rust back-end and a React front-end. It demonstrates how to:

* Make an API call to Reddit and return the response to the front-end
* Handle GET requests
* Handle GET requests with a variable in the path
* Handle POST requests with a JSON body
* Make a generic function that can handle both GET and POST requests

## Installation
1. Install Rust and Node.js
1. Install Yarn: `npm i -g yarn`
2. Clone this repo
3. `cd reddit-app` then `cargo run` (starts Rust server)
4. Open a new terminal
4. `cd reddit-app/react-ui` then `yarn` then `yarn start` (starts React front-end)

The Rust server will run on port `8000`, and React will run on `3000`. In order to route React's fetch requests to `8000`, I added a proxy to `package.json`.

## Usage

Type any subreddit in the input box and press enter to submit. Click on a post to see an ugly version of the content.

## License
[MIT](https://choosealicense.com/licenses/mit/)