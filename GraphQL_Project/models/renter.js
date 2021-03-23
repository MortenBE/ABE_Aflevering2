const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const renterSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String
});

const Renter = mongoose.model("Renter", renterSchema);

Renter.createIndexes();

module.exports = Renter;
