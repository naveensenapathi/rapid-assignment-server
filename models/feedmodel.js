var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var feedSchema = new Schema({
    message: {
        type: String,
        index: "text"
    },
    link: {
        type: String,
        unique: true
    },
    id: {
        type: String,
        unique: true,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: String,
        required: true
    },
    full_picture: String
});

module.exports = mongoose.model('feedModel', feedSchema);
