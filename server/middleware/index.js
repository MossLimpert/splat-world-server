// middleware functions recieve req, res, and next middleware func to call
// make decisions to chain into the next middleware call
// MUST call the next function

// const requiresLogin = (req, res, next) => {
//   if (!req.session.account) {
//     return res.redirect('/');
//   }
//   return next();
// };

// const requiresLogout = (req, res, next) => {
//   if (req.session.account) {
//     return res.redirect('/app');
//   }
//   return next();
// };

// if user is trying to do something securely, check for https
// heroku encrypts everything so we have to check x-forwarded-proto instead

const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

// module.exports.requiresLogin = requiresLogin;
// module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
