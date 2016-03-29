var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fbschema = new Schema({
    user_access_token: {
        type: String,
        required: true
    }
});

var fbmodel = mongoose.model('fbmodel', fbschema);

module.exports = fbmodel;
