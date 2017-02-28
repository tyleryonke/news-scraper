// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// Create a CommentSchema with the Schema class
var CommentSchema = new Schema({
  // body: a string
  text: {
    type: String
  }
});

// Make a Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;
