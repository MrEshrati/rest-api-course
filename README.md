# REST API Course

A mini-blog course project split into a React client and an Express API. The code covers signup and login, token-based authentication, and creating, viewing, updating, and deleting feed posts with images.

## Run locally

1. Start MongoDB on `127.0.0.1:27017`. The API uses the `mini-Blog` database.
2. In [ServerSide](ServerSide/), run `npm ci` and `node app.js`. Express listens on port `8080`.
3. In [ClientSide](ClientSide/), run `npm ci` and `npm start` to launch the React development server.

The client currently targets `https://localhost:8080`, while the API serves HTTP. Use a local HTTPS reverse proxy or point a local copy of the client at the HTTP API before trying the integrated flow. Use a development database and a freshly configured signing secret for any shared environment.
