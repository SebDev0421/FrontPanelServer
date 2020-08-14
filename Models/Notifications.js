'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      NotificationsSchema = new Schema({
          numOrder: "String",
          status : "String"
      },{
          collection:"notifications"
      }),
NotificationsModel = mongoose.model("Notifications",NotificationsSchema)

module.exports = NotificationsModel