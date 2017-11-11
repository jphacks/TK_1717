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
	const pkeys = await db.all(...sql`SELECT DISTINCT pkey FROM message WHERE userId = ${req.user.id}`);
	res.json({pkeys});
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

// router.get('/newchannel/:pkey', ensureLoggedIn, asyncMiddleware(async (req, res) => {
// 	const pkey = req.params.pkey;
// 	const users = req.body.users;
// 	console.log(await db.run(...sql`INSERT INTO channel(pkey) VALUES(${pkey})`));
// }));

// router.get('/channel/:channelId', ensureLoggedIn, asyncMiddleware(async (req, res) => {
// 	const [channel, users, messages] = await Promise.all([
// 		db.all(...sql`SELECT * FROM channel WHERE id = ${channelId}`),
// 		db.all(...sql`SELECT * FROM channel_user WHERE channelId = ${channelId}`),
// 		db.all(...sql`SELECT * FROM channel_message WHERE channelId = ${channelId}`),
// 	]);

// 	if (!users.find(user => user.userId === req.user.id)) {
// 		res.json({error: 'you are not a member of channel'});
// 	} else {
// 		res.json({channel, users, messages});
// 	}
// }));

// router.post('/channel/:channelId', ensureLoggedIn, asyncMiddleware(async (req, res) => {
// 	res.setHeader('Content-Type', 'application/json');
// 	const channelId = req.params.channelId;
// 	const userId = req.user.id;
// 	const userName = req.user.displayName;
// 	const body = req.body.message.body;
// 	const createdAt = req.body.message.createdAt.toString();
// 	console.log(await db.run(...sql`INSERT INTO channel_message(channelId, userId, userName, body, createdAt) VALUES (${channelId}, ${userId}, ${userName}, ${body}, ${createdAt})`));
// 	res.json({channelId, userId, userName, body, createdAt});
// }));


module.exports = router;
