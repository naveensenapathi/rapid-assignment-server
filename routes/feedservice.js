var express = require('express');
var router = express.Router();
var feedModel = require('../models/feedmodel.js');
var auth = require('../auth.js');


router.post('/savefeed', auth.isAuthorized, function(req, res) {
    var posts = req.body;
    var userID = req.query.userID;

    for (var n = 0; n < posts.length; n++) {
        posts[n].userID = userID;
    }

    feedModel.create(posts, function(err) {
        if (err) {
            res.send(err);
        }

        for (var i = 1; i < arguments.length; ++i) {
            var insertedPosts = arguments[i];
            res.send(insertedPosts);
        }
    });
});

router.get('/getfeed', auth.isAuthorized, function(req, res) {
    var query = req.query.query;
    var limit = req.query.limit;
    var userID = req.query.userID;
    if (query) {
        feedModel.find({ userID: userID })
            .and([{
                $or: [{
                    $text: {
                        $search: query
                    }
                }, { link: { $regex: query, $options: 'i' } }]
            }])
            .exec(function(err, feeds) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.send(feeds);
            });
    } else {
        feedModel.find({ userID: userID })
            .exec(function(err, feeds) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.send(feeds);
            });
    }
});

module.exports = router;
