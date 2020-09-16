const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let User = new Schema({
  phone: {
    type: String,
    required: true,
    //in auth login we use this field to find the user, so we need to ensure the phone numbers are unique
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  //this allows us to tag all todos the user created to him/her but i dont actually think there is a point
  //store the todos for each user (do i actually need this?)
  //   todos:[
  //       {
  //           type: mongoose.Schema.Types.ObjectId
  //           ref: 'Todo'
  //       }
  //   ]
});

module.exports = mongoose.model("User", User);
