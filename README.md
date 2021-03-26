# Takeout The Compost

> npm run start

starts the server. Navigate to localhost:3000 to see the homepage.

> npm run build

runs bundles the js into bundle.js 

> npm run buildWatch

updates the bundle whenever the js changes

## File structure
`server.js` is the entry point with the main API routes defined.

`routes.js` defines the routes that render static pages

`routes` folder holds the main server-side API logic

`views` holds the ejs views

`public` holds the client-side js, css and images

`models` holds the interactions with the database

`clientApp` folder can be ignored, it is a leftover from the forked project