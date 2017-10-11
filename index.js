const express = require('express');
const fs = require('fs')
const redis = require('redis')
const dotenv = require('dotenv').config()

const app = express();
const client = redis.createClient();

client.on('error', error => {
  console.log(error)
})

const mockData = fs.readFile('mockData.json', (err, data) => {
  if(data) {
    client.set('points', data, 'EX', 60*60*24);
  }
})

app.get('/points', (req, res) => {
  client.get('points', (err, data) => {
    if(data) {
      res.set('Content-Type', 'text/json')
      res.status(200).send(data)
    } else {
      res.status(403).end(err)
    }
  })
})

app.listen(process.env.PORT || 3000)