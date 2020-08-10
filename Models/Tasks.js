'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      TasksSchema = new Schema({
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
          collection:"task"
      }),
TasksModel = mongoose.model("Tasks",TasksSchema)

module.exports = TasksModel