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
  // app.get('/reset', controllers.User.changePassPage);

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
  app.get('/logout', controllers.User.loginPage);

  // user / profile scene
  app.get('/get-tag-count', controllers.User.getUserTagCount);
  app.get('/get-pfp-link', controllers.User.getPfpLink);
  app.get('/get-user-crews', controllers.User.getUserCrews);
  app.post('/change-pfp', upload.single('image'), controllers.User.changePfp);
  app.get('/get-points', controllers.User.getPoints);
  app.post('/user-header', upload.single('image'), controllers.User.uploadHeader);
  app.get('/user-header', controllers.User.downloadHeader);
  app.post('/change-password', controllers.User.changePassword);
  app.get('/remove-pfp', controllers.User.removePfp);
  app.get('/remove-header', controllers.User.removeHeader);
  app.post('/flag-tag', controllers.Tag.flagTag);

  // draw scene
  app.post('/add-location', controllers.Tag.addLocation);

  // user state
  app.get('/get-id-by-username', controllers.User.getIdByUsername);
};

module.exports = router;
