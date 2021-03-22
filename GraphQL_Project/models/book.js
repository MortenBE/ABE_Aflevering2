const mongoose = require("mongoose");
const renter = require("./renter");
const author = require("./author")
const Schema = mongoose.Schema;

//Obs: role could change to roles array.
const bookSchema = new Schema({
  title: String,
  pages: String,
  rented: Boolean,
  author: author,
  rentedBy: renter  
});

const Book = mongoose.model("Book", bookSchema);

Book.createIndexes();

module.exports = Book;
