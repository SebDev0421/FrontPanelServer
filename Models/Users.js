'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      UserSchema = new Schema({
          name:"String",
          lastName: "String",
          roll:"String",
          email:"String",
          password:"String",
          phone:"String",
          idEmployed:"String",
          auth:"String",
          tokenId : "String"
      },{
          collection:"users"
      }),
UsersModel = mongoose.model("Users",UserSchema)

module.exports = UsersModel