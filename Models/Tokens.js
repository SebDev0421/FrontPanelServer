'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      TokensSchema = new Schema({
          TokenDevice: "String",
      },{
          collection:"tokens"
      }),
TokensModel = mongoose.model("Token",TokensSchema)

module.exports = TokensModel