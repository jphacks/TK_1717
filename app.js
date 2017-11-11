require('dotenv').config();
const express = require('express');

const asyncMiddleware = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

const app = express();
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

const ensureLoggedIn = require('./server/login')(app);
app.use(ensureLoggedIn, express.static('static'));

app.get('/test', ensureLoggedIn,
	asyncMiddleware(async (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.json({ message: "login and logging api", user: req.user.displayName});
	}
));

app.get('/messages', ensureLoggedIn,
	asyncMiddleware(async (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.json({ messages: ["login and logging api", "hello world."] });
	})
);

const port = (process.argv.length > 2) ? process.argv[2] : 3000;
app.listen(port, () => console.log('jphacks app listening on port:', port));
