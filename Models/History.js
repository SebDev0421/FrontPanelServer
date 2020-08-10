'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      HistorySchema = new Schema({
          payer:"String",
          numOrder: "String",
          concept:"String",
          uds:"String",
          process:"Array",
          finishDate:"String",
          observations:"String",
          dateCreate: "String",
          createdId: "String",
          complete:"String"
      },{
          collection:"history"
      }),
HistoryModel = mongoose.model("History",HistorySchema)

module.exports = HistoryModel