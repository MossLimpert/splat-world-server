// Author: Moss Limpert

const db = require('../database.js');

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

const getFlag = (req, res) => {

};

const lowerFlag = (req, res) => {
  
};

const reviewFlag = (req, res) => {

};

const appealFlag = (req, res) => {
  let fid = null;


};

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