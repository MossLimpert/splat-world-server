require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const fileUpload = require('express-fileupload');
//const mysql = require('mysql2');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/Splat-World';
// mongoose.connect(dbURI).catch((err) => {
//   if (err) {
//     console.log('Could not connect to database');
//     throw err;
//   }
// });

//const dbURI = process.env.MONGODB_URI ||
// const connection = mysql.createConnection({
//   host: 'localhost',
//   database: 'splat_world',
//   user: 'root',
//   password: 'root'
// });
// connection.connect((err) => {
//   if (err) console.log(err);
//   console.log('Database connected!');
// });

const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
  const app = express();

  app.use(helmet());
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
  app.use(favicon(`${__dirname}/../hosted/img/bubbles.png`));
  app.use(compression());
  app.use(fileUpload());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // default connect key is connect.sid which implies we are using
  // express connect module which is bad security practice
  app.use(session({
    key: 'sessionid',
    store: new RedisStore({
      client: redisClient,
    }),
    secret: 'splat',
    resave: false,
    saveUninitialized: false,
  }));

  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);

  router(app);

  app.listen(port, (err) => {
    if (err) { throw err; }
    console.log(`Listening on port ${port}`);
  });
});
