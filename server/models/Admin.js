// Author: Moss Limpert

const bcrypt = require('bcrypt');

const saltRounds = 11;

// Converts a doc to something we can store in redis later on.
const toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// Helper function to hash a password
const generateHash = (password) => bcrypt.hash(password, saltRounds);

const authenticatePassword = async (pass, ecryptedPass) => {
  let match;
  console.log('authenticating password');
  await bcrypt.compare(pass, ecryptedPass, (err, result) => {
    match = result;
  });
  return match;
}

module.exports = {
  toAPI,
  generateHash,
  authenticatePassword
};
