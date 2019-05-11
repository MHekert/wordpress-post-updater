var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var session = require('express-session');
var sharedConfig = require('./app/sharedConfig.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');

var port = process.env.PORT || sharedConfig.backendPort;

var redis = require('redis');
var client = redis.createClient();
var RedisStore = require('connect-redis')(session);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(
	session({
		store: new RedisStore({}),
		path: '/',
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
		httpOnly: true,
		unset: 'destroy'
	})
);
app.use(express.static('public'));

passport.use(
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
		let WPAPI = require('wpapi');
		const wpConfig = require('./app/wpConfig.json');
		let authWp = new WPAPI({
			endpoint: wpConfig.url,
			username: username,
			password: password
		});
		authWp
			.users()
			.me()
			.then((res) =>
				done(null, {
					username: username,
					password: password,
					name: res.name,
					id: res.id,
					session: req.session.id
				})
			)
			.catch((err) => {
				if (err.code === 'incorrect_password') return done(null, false);
				if (err.code === 'invalid_username') return done(null, false);
				return done(err);
			});
	})
);
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	client.get(`sess:${user.session}`, function(err, reply) {
		done(null, reply);
	});
});

app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

server.listen(port);
console.log('The magic happens on port ' + port);
