const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const redis = require('redis')
const dotenv = require('dotenv').config()
const uuidv4 = require('uuid/v4')
const cors = require('cors')

const app = express();
app.use(bodyParser.json())
app.use(cors())

const client = redis.createClient();
client.on('error', error => {
  console.log(error)
})

app.get('/points', (req, res) => { // Get all points
  client.hgetall('points', (err, data) => { // Returns single object
    if(data) {
      const points = Object.values(data).map( point => { // Scrap return object keys
        return JSON.parse(point)
      }) 
      res.set('Content-Type', 'text/json')
      res.status(200).send(points)
    } else {
      res.status(204).end(err)
    }
  })
})

app.get('/points/:uuid', (req, res) => { // Get a single point
  console.log(req)
  if(req.params.uuid) { // If request has data
    client.hget('points', req.params.uuid, (err, data) => {
      if(data) {
        res.set('Content-Type', 'text/json')
        res.status(200).end(data)
      } else {
        res.status(204).end('Could not get point')
      }
    })
  } else {
     res.status(400).end("No UUID supplied")
  }
})

app.post('/points', (req, res) => { // Post a new point OR update an existing one
  console.log(req)
  if(req.body) { // If request has data
    const point = req.body;
    const uuid = uuidv4() // Generate UUID
    point.uuid = uuid;
    client.hset('points', uuid, JSON.stringify(point, null, 2), (err, data) => { // Save to redis
      if(data) {
        client.hget('points', uuid, (err, data) => { // Get saved point from redis
          if(data) {
            res.set('Content-Type', 'text/json')
            res.status(200).end(data)
          } else {
            res.status(204).end('Could not get saved point - save was fine though')
          }
        })
      } else {
        res.status(500).end('Could not save point')
      }
    });
  }
})

app.patch('/points/:uuid', (req, res) => {
  console.log(req)
  if(req.params.uuid && req.body) {
    const point = req.body
    const uuid = req.params.uuid
    client.hset('points', uuid, JSON.stringify(point, null, 2), (err, data) => { // Save to redis
      if(data) {
        client.hget('points', uuid, (err, data) => { // Get saved point from redis
          if(data) {
            res.set('Content-Type', 'text/json')
            res.status(200).end(data)
          } else {
            res.status(204).end('Could not get saved point - save was fine though')
          }
        })
      } else {
        res.status(500).end('Could not save point')
      }
    });
  }
})

app.delete('/points/:uuid', (req, res) => {
  console.log(req)
  if(req.params.uuid) { // If request has data
    client.hdel('points', req.params.uuid, (err, data) => {
      if(data) {
        res.status(200).end("Point deleted")
      } else {
        res.status(204).end('Point not found')
      }
    })
  } else {
     res.status(400).end("No UUID supplied")
  }
})

app.listen(process.env.PORT || 3000)