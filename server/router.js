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

  // homepage
  app.get('/home', controllers.Status.home);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // change password
  app.get('/change-password', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassPage);
  app.post('/change-password', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  // login
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  // signup
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  // logout
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

};

module.exports = router;
