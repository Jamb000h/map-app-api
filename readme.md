# Map App API

A simple API that implements CRUD for [map app](https://github.com/Jamb000h/map-app) points of interest.

Features:
- Node.js
- Express
- ES6
- Redis

## Installation

Requires Node.js.

The application uses Redis as a database. Refer to the [Redis Quick Start](https://redis.io/topics/quickstart) on how to install Redis.

After installing, run redis:

```
redis-server
```

## Running the application

Install the dependencies with

```
npm install
```

### Environment variables

Supply your own .env file with the following

```
PORT=PORT
```

or the process will try to run on port 3000

```
npm start
```

runs the application