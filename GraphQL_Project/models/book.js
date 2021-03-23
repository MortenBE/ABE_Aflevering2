const mongoose = require("mongoose");
//const renter = require("./renter");
//const author = require("./author")
const Schema = mongoose.Schema;

//Obs: role could change to roles array.
const bookSchema = new Schema({
  id: String,
  title: String,
  authorId: String,
  rented: Boolean
  //pages: String,
  
  //author: author,
  //rentedBy: renter  
});

const Book = mongoose.model("Book", bookSchema);

Book.createIndexes();

module.exports = Book;
