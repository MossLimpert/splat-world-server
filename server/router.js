// Author: Moss Limpert

const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {

  // splat world
  // add test user data
  app.post('/add-user', mid.requiresSecure, controllers.Account.addUser);
  // add test crew data
  app.post('/add-crew', mid.requiresSecure, controllers.Bubble.addCrew);
  // add test tag data
  app.post('/add-tag', mid.requiresSecure, controllers.Status.addTag);

  // retrieve test tag data
  app.get('/tag', mid.requiresSecure, controllers.Status.getTag);
  //retrieve test user data
  app.get('/get-user', mid.requiresSecure, controllers.Account.getUser);
  // retrieve test crew data
  app.get('/get-crew', mid.requiresSecure, controllers.Bubble.getCrew);
  // retrieve tags by user
  app.get('/tags', mid.requiresSecure, controllers.Status.getTags);
  // save tag to saved tags
  app.post('/save-tag', mid.requiresSecure, controllers.Status.saveTag);

  // homepage
  app.get('/home', controllers.Status.home);
  app.get('/', mid.requiresSecure, controllers.Account.loginPage);

  // change password
  app.get('/change-password', mid.requiresSecure, controllers.Account.changePassPage);
  app.post('/change-password', mid.requiresSecure, controllers.Account.changePassword);
  // login
  app.get('/login', mid.requiresSecure, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, controllers.Account.login);
  // signup
  app.post('/signup', mid.requiresSecure, controllers.Account.signup);
  // logout
  app.get('/logout', controllers.Account.logout);

};

module.exports = router;
