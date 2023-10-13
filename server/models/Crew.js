// Author: Moss Limpert

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 7;

let BubbleModel = {};

// bubbles are groups, and they have a name
// as well as an array of user ids
// and the hashed version of a password used by new users to join
const BubbleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  // https://mongoosejs.com/docs/populate.html
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  password: {
    type: String,
    required: true,
  },
});

// so we can have the bubble names and users in redis
BubbleSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  users: doc.users,
  _id: doc._id,
});

// hashes the password
BubbleSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// authenticates a password against the one in the database
BubbleSchema.statics.authenticate = async (bubblename, password, callback) => {
  try {
    const doc = await BubbleModel.findOne({ name: bubblename }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

// remove user
// add user

BubbleModel = mongoose.model('Bubble', BubbleSchema);
module.exports = BubbleModel;
