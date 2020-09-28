const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//{ todo_text: "one", editing: false, edited: false }
let Todo = new Schema({
  todo_text: String,
  // editing: false,
  // edited: false,
  //to allow each todo to be tagged to the user that created it
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Todo", Todo);
