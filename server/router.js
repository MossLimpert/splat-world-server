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
  // create status
  app.post('/home', controllers.Status.makeStatus);
  app.get('/maker', controllers.Status.home);
  app.post('/maker', controllers.Status.makeStatus);
  app.get('/app', controllers.Status.home);
  app.post('/app', controllers.Status.makeStatus);


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

  

  // login / homepage
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // documentation
  app.get('/docs', mid.requiresLogin, controllers.Account.docPage);

  // monetization
  app.get('/buy-premium', mid.requiresSecure, mid.requiresLogin, controllers.Account.buyPremiumPage);
  app.post('/buy-premium', mid.requiresSecure, mid.requiresLogin, controllers.Account.buyPremium);

  // get current user status
  app.get('/get-current-status', mid.requiresSecure, mid.requiresLogin, controllers.Status.getCurrentUserStatus);
  // get all user statuses
  app.get('/get-user-statuses', mid.requiresSecure, mid.requiresLogin, controllers.Status.getUserStatuses);
};

module.exports = router;
