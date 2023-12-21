// Author: Moss Limpert

const db = require('../database.js');

// flag a tag as having objectionable content
const flag = (userId, itemId, res) => {
    const sql = `INSERT INTO ${process.env.DATABASE}.flagged SET ?`;
  
    try {
      db.query(
        sql,
        {
          author_ref: userId,
          item_ref: itemId,
        },
        (err) => {
          if (err) throw err;
  
          res.json({message: 'Success!'});
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: 'Failed to update flagged table with new flagged tag',
        message: err
      });
    }
  }

// unimplemented
// get a flagged tag for review
const getFlag = (req, res) => {

};

// unimplemented
// lowers a tag's flag, marking in its notes that it has been flagged
const lowerFlag = (req, res) => {
  
};

// unimplemented
// submits a review for a flagged tag
const reviewFlag = (req, res) => {

};

// unimplemented
// allows a user to appeal the decision on a flagged tag
const appealFlag = (req, res) => {
  let fid = null;


};

// unimplemented
// allows an admin to mark a flag for deletion
const markFlagForDeletion = () => {

};

module.exports = {
    flag,
    lowerFlag,
    reviewFlag,
    appealFlag,
    markFlagForDeletion,
    getFlag,
    
}