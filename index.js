const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const redis = require('redis')
const dotenv = require('dotenv').config()
const uuid = require('uuid/v4')

const app = express();
app.use(bodyParser)

const client = redis.createClient();
client.on('error', error => {
  console.log(error)
})

app.get('/points', (req, res) => { // Get all points
  client.get('points', (err, data) => {
    if(data) {
      res.set('Content-Type', 'text/json')
      res.status(200).send(data)
    } else {
      res.status(403).end(err)
    }
  })
})

app.get('/points:uuid', (req, res) => { // Get a single point
  client.get(req.params.uuid, (err, data) => {
    if(data) {
      res.set('Content-Type', 'text/json')
      res.status(200).send(data)
    } else {
      res.status(403).end(err)
    }
  })
})

app.post('points', (req, res) => { // Post a new point
  console.log(req)
  if(req.body) { // If request has data
    const point = req.body;
    const uuid = uuidv4() // Generate UUID
    point.uuid = uuid;
    client.set(uuid, point, (err, data) => { // Save to redis
      if(data) {
        client.get(uuid, (err, data) => { // Get saved point from redis
          if(data) {
            res.set('Content-Type', 'text/json')
            res.status(200).end(data)
          } else {
            res.status(500).end('Could not get saved point - save was fine though')
          }
        })
      } else {
        res.status(500).end('Could not save point')
      }
    });
  }
})

app.listen(process.env.PORT || 3000)