// Author: Moss Limpert

const mongoose = require('mongoose');

let StatusModel = {};

// schema for a single status, contains the status's text
// as well as the user it is associated with
// and when it was posted
const StatusSchema = new mongoose.Schema({ 
    text: {
        type: String,
        required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// for storing in redis :3c
StatusSchema.statics.toAPI = (doc) => ({
    text: doc.text,
});

StatusModel = mongoose.model('Status', StatusSchema);
module.exports = StatusModel;
