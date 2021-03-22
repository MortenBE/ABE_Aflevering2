const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Obs: role could change to roles array.
const renterSchema = new Schema({
  firstname: String,
  lastname: String
});

const Renter = mongoose.model("Renter", renterSchema);

Renter.createIndexes();

module.exports = Renter;
