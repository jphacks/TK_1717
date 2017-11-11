const lib = require('./lib');
const {It, it, them, compareBy, prepareSQL, templateSQL, cl} = lib;

const db = require('sqlite');
db.open('./database.db', {Promise});
const sql = prepareSQL;

const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login/facebook');

const asyncMiddleware = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

router.get('/', ensureLoggedIn, asyncMiddleware(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.json({
		messages: ["login and logging api", "hello world."],
		user: req.user.displayName
	});
}));

router.get('/:pkey', ensureLoggedIn, asyncMiddleware(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const pkey = req.params.pkey;
	const messages = await db.all(...sql`SELECT * FROM message WHERE pkey = ${pkey}`);
	res.json({messages});
}));

router.post('/:pkey', ensureLoggedIn, asyncMiddleware(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const pkey = req.params.pkey;
	const userId = req.user.id;
	const userName = req.user.displayName;
	const body = req.body.message.body;
	const createdAt = req.body.message.createdAt.toString();
	console.log(await db.run(...sql`INSERT INTO message(pkey, userId, userName, body, createdAt) VALUES (${pkey}, ${userId}, ${userName}, ${body}, ${createdAt})`));
	res.json({pkey, userId, userName, body, createdAt});
}));

module.exports = router;
