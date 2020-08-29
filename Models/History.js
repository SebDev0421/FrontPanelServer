'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      HistorySchema = new Schema({
          payer:"String",
          numOrder: "String",
          concept:"String",
          uds:"String",
          process:"Array",
          createDate:"String",
          finishDate:"String",
          DepartedDate: "String",
          observations:"String",
          dateCreate: "String",
          createdId: "String",
          complete:"String"
      },{
          collection:"history"
      }),
HistoryModel = mongoose.model("History",HistorySchema)

module.exports = HistoryModel