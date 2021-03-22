const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Obs: role could change to roles array.
const authorSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String
});

const Author = mongoose.model("Author", authorSchema);

Author.createIndexes();

module.exports = Author;
