'use strict'

const { mongo } = require('mongoose')

//packages
const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      port = (process.env.PORT || 3000),
      mongoose = require('./Database'),
      Routes = require('./Routes/Tasks.Routes'),
      fs = require('fs'),
      https = require('https')


//Settings
app.set('port',port)

//middlewares

app.use(express.urlencoded({extended:false}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.json())

app.use('/frontPanelApp/API/SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',Routes)


https.createServer({
  key: fs.readFileSync('selfsigned.key'),
  cert: fs.readFileSync('selfsigned.crt')
}, app).listen(PORT, function(){
  console.log("My https server listening on port " + PORT + "...");
});


