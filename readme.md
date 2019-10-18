# Reddit App

This is an app that gets the first 25 posts from a subreddit. It has a Rust back-end and a React front-end. It demonstrates how to:

* Make an API call to Reddit and return the response to the front-end
* Handle GET requests
* Handle GET requests with a variable in the path
* Handle POST requests with a JSON body
* Make a generic function that can handle both GET and POST requests
* Handle 404s

## Installation
1. Install Rust and Node.js
2. Install Yarn: `npm i -g yarn`
3. Clone this repo
4. `cd reddit-app` then `cargo run` (builds dependencies and starts Rust server)
5. Open a new terminal
6. `cd reddit-app/react-ui` then `yarn` then `yarn start` (builds dependencies and starts React front-end)

The Rust server will run on port `5000`, and React will run on `3000`. To route React's fetch requests to `5000` for development, we need a proxy in `package.json`, which I've already added: `"proxy": "http://localhost:5000"`.

## Usage

Type any subreddit in the input box and press enter. This will fetch posts from that subreddit. Posts that have 🔎 before the title can be expanded to show the content. Clicking the link will open that post on Reddit.

## Deploy to Heroku
`cd react-ui` then `yarn build`. This will make a production build of our React front-end and copy it to the `static/build` folder in our project root, which is where our server will look for static files:

`.service(fs::Files::new("/", "static/build").index_file("index.html"))`

Ideally, we'd have heroku build our react-ui itself so we didn't have to check this folder into our repo, but it looks like that requires making a custom buildpack, so I'll save that for another day.

Once we have this build folder, we can now run the site locally without running the React front-end and view it on port `5000`.

To deploy:
1. Install the Heroku CLI: `npm i -g heroku`
1. `heroku login`
1. `heroku create name-of-your-heroku-app`
   * If you create your app on heroku's site, you need to run this command: `heroku git:remote -a name-of-your-heroku-app`
1. `heroku buildpacks:set emk/rust`
1. `git push heroku master`

After running the last command, you will see your Rust dependencies compiling on the remote Heroku server. This will take about 10 minutes, but won't happen again unless you change your dependencies.

## License
[MIT](https://choosealicense.com/licenses/mit/)