# quizzyWeb

Web server repository

## Technologies

-   ReactJs
-   Socket.io
-   MaterialUI
-   React-Redux
-   React-Router
-   and more to come...

## Setup

**NOTE:** Requires Node.js LTS version

Go to the repository folder's root and enter this in the command line:

```bash
npm install
```

This will install all the packages and development dependencies for the project
in order to work properly.

Now, create a .env file with the following variables:

- REACT_APP_API_ENDPOINT : The URL of the API
- ENABLE_PROXY : Set a local proxy for local development. Use "yes" if you deployed the backend on your local machine

For example:

```
REACT_APP_API_ENDPOINT=quizzyappweb.herokuapp.com
ENABLE_PROXY="no"
```

Now you should be able to start the development server with the options provided by the `npm` scripts:

-   `npm run start`: Start the server in development mode

## Testing

The testing framework used in this project is Jest (and Supertest for testing API requests).

Each route should have its own unit test file. In order to execute tests, launch

```bash
npm run test
```

Or if you want to test individual routes and modules:

```bash
npm run test -- <filename>
```

## Deployment

This repo is linked to the Heroku app. The [web server](https://quizzyappweb.herokuapp.com) listens on port 80
