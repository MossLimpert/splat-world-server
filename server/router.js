// Author: Moss Limpert

const multer = require('multer');
const path = require('path');
const controllers = require('./controllers');

//
// MULTER
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req, file);
    cb(null, path.resolve(path.join(__dirname, '..', 'hosted', 'downloads')));
  },
  filename: (req, file, cb) => {
    console.log(req.body.pfpname + path.extname(file.originalname));
    cb(null, req.body.pfpname + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  onFileUploadStart: (file) => {
    console.log(file);
    console.log('in file upload start');
  },
});

//
// ROUTER
//
const router = (app) => {
  //
  // SQL
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

  //
  // ADMIN PAGE NAV
  //
  // homepage
  app.get('/home', controllers.Tag.home);
  app.get('/', controllers.User.loginPage);
  // login
  app.get('/login', controllers.User.loginPage);
  // change password
  app.get('/reset', controllers.User.changePassPage);

  // minio
  app.post('/user-pfp', upload.single('image'), controllers.User.uploadPfp);
  app.get('/user-pfp', controllers.User.downloadPfp);

  //
  // UNITY ROUTES
  //
  app.post('/login', controllers.User.verifyUser);
  // signup
  app.post('/signup', controllers.User.signup);
  // logout - doesnt work bc of redis session removal
  app.get('/logout', controllers.User.logout);

  // user / profile scene
  app.get('/get-tag-count', controllers.User.getUserTagCount);
};

module.exports = router;
