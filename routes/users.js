var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var auth = require('../auth.js');
var User = require('../models/usermodel.js');

router.post('/create', function(req, res) {
    var newUser;

    newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save(function(err) {
        if (err) {
            if (err.code === 11000) {
                res.send('Username or Email already exists');
                return;
            }
            res.send(err);
        }
        res.json({
            message: 'User created!'
        });
    });
});

router.post('/login', function(req, res) {
    // find the user
    var criteria = { $or: [{ username: req.body.username }, { email: req.body.username }] };

    User.findOne(criteria, function(err, user) {

        if (err) {
            res.send(err);
            return;
        }

        if (!user) {
            res.status(500).json({ success: false, message: 'Authentication failed. User not found.' });
            return;
        } else if (user) {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) {
                    res.status(500).json({ success: false, message: 'Authentication failed. Wrong password.' });
                    return;
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, config.token_key, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    console.log(JSON.stringify(user));
                    console.log(JSON.stringify(req.body));

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Login successful',
                        token: token,
                        username: req.body.username
                    });
                }
            });
        }
    });
});

router.post('/fb/token', function(req, res) {
    // find the user
    User.findOne({
        facebookID: req.body.facebookID
    }, function(err, user) {

        if (!user) {
            newUser = new User({
                facebookID: req.body.facebookID
            });

            newUser.save(function(err) {
                if (err) {
                    console.log("Error saving" + JSON.stringify(err));
                }
            });
        }

        var token = jwt.sign(user, config.token_key, {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Facebook token successful',
            token: token
        });

    });
});

router.post('/verify/token', auth.isAuthorized, function(req, res) {
    res.json({
        success: true,
        message: "Authenticated token"
    });
});

module.exports = router;
