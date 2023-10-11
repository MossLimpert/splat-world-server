// Author: Moss Limpert

const controllers = require('./controllers');

const router = (app) => {

  // splat world
  // add test user data
  app.post('/add-user', controllers.Account.addUser);
  // add test crew data
  app.post('/add-crew', controllers.Crew.addCrew);
  // add test tag data
  app.post('/add-tag', controllers.Tag.addTag);

  // retrieve test tag data
  app.get('/tag', controllers.Tag.getTag);
  //retrieve test user data
  app.get('/get-user', controllers.User.getUser);
  // retrieve test crew data
  app.get('/get-crew', controllers.Crew.getCrew);
  // retrieve tags by user
  app.get('/tags', controllers.Tag.getTags);
  // save tag to saved tags
  app.post('/save-tag', controllers.Tag.saveTag);

  // homepage
  app.get('/home', controllers.Tag.home);
  app.get('/', controllers.User.loginPage);

  // change password
  app.get('/change-password', controllers.User.changePassPage);
  // login
  app.get('/login', controllers.User.loginPage);
  app.post('/login', controllers.User.verifyUser);
  // signup
  app.post('/signup', controllers.User.signup);
  // logout
  app.get('/logout', controllers.User.logout);

};

module.exports = router;
