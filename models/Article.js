// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// Create a ArticleSchema with the Schema class
var ArticleSchema = new Schema({
  // name: a unique String
  title: {
    type: String,
    trim: true,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // notes property for the user
  comments: [{
    // Store ObjectIds in the array
    type: Schema.ObjectId,
    // The ObjectIds will refer to the ids in the Comment model
    ref: "Comment"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the user model
module.exports = Article;
