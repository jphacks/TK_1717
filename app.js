require('dotenv').config();
const express = require('express');

const app = express();
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

const passport = require('./server/login')(app);
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login/facebook');
const messages = require('./server/messages');

app.use(ensureLoggedIn, express.static('static'));
app.use('/messages', messages);

const port = (process.argv.length > 2) ? process.argv[2] : 3000;
app.listen(port, () => console.log('jphacks app listening on port:', port));
