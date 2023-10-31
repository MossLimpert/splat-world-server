// Author: Moss Limpert

const controllers = require('./controllers');
//const { multer } = controllers.User.multer;
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // USE SHARP HERE TO THUMBNAIL IT I THINK
    console.log("Inside multer storage destination")
    cb(null, path.resolve('hosted/downloads')); 
  },
  filename: (req, file, cb) => {
    console.log(file);
    console.log("inside multer filename")
    cb(null, file.fieldname + path.extname(file.originalname));
  }
});
const upload = multer({storage:storage});

const router = (app) => {
  //
  // ADMIN SITE ROUTES
  //
  // add SQL entries
  // add test user data
  app.post('/add-user', controllers.User.addUser);
  // add test crew data
  app.post('/add-crew', controllers.Crew.addCrew);
  // add test tag data
  app.post('/add-tag', controllers.Tag.addTag);

  // get SQL entries
  // retrieve test tag data
  app.get('/tag', controllers.Tag.getTag);
  // retrieve test user data
  app.get('/get-user', controllers.User.getUser);
  // retrieve test crew data
  app.get('/get-crew', controllers.Crew.getCrew);
  // retrieve tags by user
  app.get('/tags', controllers.Tag.getTags);
  // save tag to saved tags
  app.post('/save-tag', controllers.Tag.saveTag);

  // Page navigation
  // homepage
  app.get('/home', controllers.Tag.home);
  app.get('/', controllers.User.loginPage);
  // login
  app.get('/login', controllers.User.loginPage);
  // change password
  app.get('/reset', controllers.User.changePassPage);

  // minio
  app.post('/user-pfp', upload.single("image"), controllers.User.uploadPfp);
  app.get('/user-pfp', controllers.User.downloadPfp);

  //
  // UNITY ROUTES
  //
  app.post('/login', controllers.User.verifyUser);
  // signup
  app.post('/signup', controllers.User.signup);
  // logout - doesnt work bc of redis session removal
  app.get('/logout', controllers.User.logout);
};

module.exports = router;
