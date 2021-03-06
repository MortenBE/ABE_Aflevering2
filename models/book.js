const mongoose = require("mongoose");
const renter = require("./renter");
//const author = require("./author")
const Schema = mongoose.Schema;

//Obs: role could change to roles array.
const bookSchema = new Schema({
  id: String,
  title: String,
  authorId: String,
  //pages: String,
  rented: Boolean,
  //author: author,
  renterId: String  
});

const Book = mongoose.model("Book", bookSchema);

Book.createIndexes();

module.exports = Book;
