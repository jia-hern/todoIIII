const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//{ todo_text: "one", editing: false, edited: false }
let Todo = new Schema({
  todo_text: String,
  editing: false,
  edited: false,
});

module.exports = mongoose.model("Todo", Todo);
