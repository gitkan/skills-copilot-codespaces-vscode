// Create web server

// Import express library
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Comment = require('./models/comments');
var cors = require('cors')

// Connect to mongodb database
mongoose.connect('mongodb://localhost:27017/comments');

app.use(cors())

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up port
var port = process.env.PORT || 3000;

// Set up routes
var router = express.Router();

// Set up static files
app.use(express.static(__dirname + '/public'));

// Set up middleware
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// Test route
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// Get all comments
router.route('/comments')
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    })

    // Create new comment
    .post(function(req, res) {
        var comment = new Comment();
        comment.comment = req.body.comment;
        comment.author = req.body.author;
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment created!' });
        });
    });

// Get comment by id
router.route('/comments/:comment_id')
    .get(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json(comment);
        });
    })

    // Update comment by id
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            comment.comment = req.body.comment;
            comment.author = req.body.author;
            comment.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Comment updated!' });
            });
        });
    })

    // Delete comment by id
    .delete(function(req, res) {
        Comment.remove({
            _id: req.params.comment_id
        }, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment deleted!' });
        });
    })