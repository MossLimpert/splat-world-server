// Author: Moss Limpert

const controllers = require('./controllers');

const router = (app) => {

  // splat world
  // add test user data
  app.post('/add-user', controllers.Account.addUser);
  // add test crew data
  app.post('/add-crew', controllers.Bubble.addCrew);
  // add test tag data
  app.post('/add-tag', controllers.Tag.addTag);

  // retrieve test tag data
  app.get('/tag', controllers.Tag.getTag);
  //retrieve test user data
  app.get('/get-user', controllers.Account.getUser);
  // retrieve test crew data
  app.get('/get-crew', controllers.Bubble.getCrew);
  // retrieve tags by user
  app.get('/tags', controllers.Tag.getTags);
  // save tag to saved tags
  app.post('/save-tag', controllers.Tag.saveTag);

  // homepage
  app.get('/home', controllers.Tag.home);
  app.get('/', controllers.Account.loginPage);

  // change password
  app.get('/change-password', controllers.Account.changePassPage);
  // login
  app.get('/login', controllers.Account.loginPage);
  app.post('/login', controllers.Account.verifyUser);
  // signup
  app.post('/signup', controllers.Account.signup);
  // logout
  app.get('/logout', controllers.Account.logout);

};

module.exports = router;
