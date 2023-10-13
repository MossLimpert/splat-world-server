// Author: Moss Limpert

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
// const db = require('../database.js');

const saltRounds = 11;

let AccountModel = {};

/* Our schema defines the data we will store. A username (string of alphanumeric
   characters), a password (actually the hashed version of the password created
   by bcrypt), and the created date.
*/
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/^[A-Za-z0-9_\-.]{1,16}$/, 'Usernames can be between 1 and 16 characters long, and contain numbers, underscores, and hyphens. You submitted {VALUE}'],
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  currentStatus: {
    type: mongoose.Schema.Types.ObjectId,
  },
  premiumMembership: {
    type: Boolean,
    default: false,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

/* Helper function for authenticating a password against one already in the
   database. Essentially when a user logs in, we need to verify that the password
   they entered matches the one in the database. Since the database stores hashed
   passwords, we need to get the hash they have stored. We then pass the given password
   and hashed password to bcrypt's compare function. The compare function hashes the
   given password the same number of times as the stored password and compares the result.
*/
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
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

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
