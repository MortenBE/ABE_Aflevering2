var author = require("../models/author");

exports.getAuthors = async function (req, res) {
  var result = await author.find();
  res.status(200);
  res.json(result);
};


