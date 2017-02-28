var Article = require("../models/Article.js");
var CommentOb = require("../models/Comment.js");
var cheerio = require("cheerio");
var request = require("request");

// Export app routes
module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("home");
    });

    app.get("/scrape", function(req, res) {

      Article.remove({}, function(err) {
          if (err) {
              res.send(err);
          } else {
            request("https://www.bbc.com/news/", function(err, res2, html) {
                // Load the html body from request into cheerio
                var $ = cheerio.load(html);

                // For each a with correct class
                $("a.gs-c-promo-heading").each(function(i, element) {

                    Article.create({
                      title: $(this).children().text(),
                      link: $(this).attr("href")
                    }, function(err) {
                      if (err) {
                        console.log(err);
                      }
                      else {
                        console.log("Article scraped.")
                      }
                    })
                });
                res.redirect("/articles");
            });
          }
      });

    });

    app.get("/articles", function(req, res) {
        // Grab every doc in Articles
        Article.find({})
            // Populate any and all associated comments
            .populate("comments")
            // Execute the callback
            .exec(function(err, articles) {
                if (err) {
                    // If error send error
                    res.send(err);
                } else {
                    // Save each article document into an array
                    var allArticles = articles.map(function(article) {
                        return article;
                    });
                    // Render the array in the articles route for handlebars
                    res.render("articles", { articles: allArticles });
                }
            });
    });

    app.get("/comments/:article", function(req, res) {
        Article.find({id: req.params.article})
        .exec(function(err, article) {
          if (err) {
            res.send(err);
          } else {
            CommentOb.find({v: article.v})
            .exec(function(err, comments) {
            if (err) {
              res.send(err);
            } else {
              var allComments = comments.map(function(comment) {
                  return comment;
              });
              res.render("comments", { comments: allComments });
            }
          })
        }})
    });

    app.post("/comments", function(req, res) {
      // Use our Comment model to make a new comment from the req.body
      var newComment = new CommentOb({text: req.body.commentText});
      // Save the new comment to mongoose
      newComment.save(function(error, doc) {
        // Send errors to the browser
        if (error) {
          res.send(error);
        }
        // Otherwise
        else {
          // Find the article and push the new comment id into the Article's comments array
          Article.findOneAndUpdate({}, { $push: { "comments": doc._id } }, { new: true }, function(err, newdoc) {
            // Send any errors to the browser
            if (err) {
              res.send(err);
            } else {
              res.redirect("/articles");
            }
          });
        }
      });

    });

    // methodOverride not working properly - using a post until fixed
    app.post("/delete/:id", function(req, res) {
        var commentId = req.params.id;
        CommentOb.remove({ _id: commentId }, function(err, comment) {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/articles");
            }
        });
    });
};
