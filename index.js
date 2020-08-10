'use strict'

const { mongo } = require('mongoose')

//packages
const express = require('express'),
      morgan = require('morgan'),
      app = express(),
      server = require('http').createServer(app),
      port = (process.env.PORT || 3000),
      mongoose = require('./Database'),
      Routes = require('./Routes/Tasks.Routes')



//Settings
app.set('port',port)

//middlewares

app.use(morgan('dev'))
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



app.listen(app.get('port'),()=>{
    console.log('[STARTING] server Frot panel in port: ',app.get('port'))
})

