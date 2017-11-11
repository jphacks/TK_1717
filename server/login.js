require('dotenv').config();

module.exports = function (app) {
	const passport = require('passport');
	const FacebookStrategy = require('passport-facebook').Strategy;

	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: process.env.FACEBOOK_CALLBACK_URL ||  "/login/facebook/return"
	}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}));

	passport.serializeUser(function(user, cb) { cb(null, user); });
	passport.deserializeUser(function(obj, cb) { cb(null, obj); });
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/login/facebook', passport.authenticate('facebook'));
	app.get('/login/facebook/return',
		passport.authenticate('facebook', {failureRedirect: '/login' }),
		function(req, res) { res.redirect(req.session.returnTo || '/'); }
	);

	return require('connect-ensure-login').ensureLoggedIn('/login/facebook');
}

