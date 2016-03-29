var express = require('express');
var router = express.Router();
var fbmodel = require('../models/fbmodel.js');
var FB = require('fb');
var accessToken;
var page_details;
router.get('/search/:query/:access_token', function(req, res, next) {
    FB.api('oauth/access_token', {
        client_id: '246272682383473',
        client_secret: '588d9a828d490d487e7ef89b6cc3d4fd',
        grant_type: 'client_credentials'
    }, function(response) {
        if (!response || response.error) {
            res.send(!res ? 'Error occurred - App token' : res.error);
            return;
        }
        accessToken = response.access_token;
        FB.setAccessToken(accessToken);
        next();
    });
});

router.get('/search/:query/:access_token', function(req, res, next) {
    FB.api("/search", {
        "type": "page",
        "q": req.params.query,
        "limit": 2,
        "fields": "id,name,page"
    }, function(response) {
        if (!response || response.error) {
            res.send('Error occurred - Search API: ' + JSON.stringify(response));
            return;
        } else {
            page_details = response.data[0];
            next();
            // res.send(response);
        }
    });
});

router.get('/search/:query/:access_token', function(req, res) {
    FB.api(
        "/" + page_details.id + "/posts", {
            "limit": 10,
            "fields": "message, link, full_picture, place, tags, id"
        },
        function(response) {
            if (!response && response.error) {
                res.send('Error occurred - Page feed API: ' + JSON.stringify(response));
                return;
            } else {
                res.send(response);
            }
        }
    );
});

module.exports = router;
