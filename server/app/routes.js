var WPAPI = require('wpapi');
const wpConfig = require('./wpConfig.json');
var sharedConfig = require('./sharedConfig.json');

var wp = new WPAPI({
	endpoint: wpConfig.url,
	username: wpConfig.username,
	password: wpConfig.password
});

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

module.exports = (app, passport) => {
	app.all('*', (_req, res, next) => {
		res.header('Access-Control-Allow-Origin', 'http://app.local:3000');
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
		res.header(
			'Access-Control-Allow-Headers',
			'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
		);
		next();
	});

	app.get('/posts/:pageNumber', async (req, res) => {
		const page = parseInt(req.params.pageNumber, 10);
		try {
			const wpResponse = await wp.posts().perPage(sharedConfig.postsPerPage).page(page);
			const responseObj = { posts: wpResponse, totalPages: wpResponse._paging.totalPages };
			res.json(responseObj);
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});

	app.get('/post/:postId', async (req, res) => {
		const postId = parseInt(req.params.postId, 10);
		try {
			const wpResponse = await wp.posts().id(postId);
			res.json(wpResponse);
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});

	app.get('/categories', async (req, res) => {
		try {
			res.json(await wp.categories().perPage(100));
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});

	app.get('/authors', async (req, res) => {
		try {
			res.json(await wp.users().perPage(100));
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});

	app.post('/post/update', upload.array('file'), uploadFiles, async (req, res) => {
		try {
			const newContent = req.newContent;
			const categories = JSON.parse(req.body.categories);
			if (req.body.id != null) {
				response = await wp.posts().id(req.body.id).update({
					title: req.body.title,
					status: 'publish',
					categories: categories,
					content: newContent
				});
			} else {
				response = await wp.posts().create({
					title: req.body.title,
					status: 'publish',
					categories: categories,
					content: newContent
				});
			}
			res.status(200).send({ link: response.link, id: response.id });
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});

	app.post('/login', isNotLoggedIn, function(req, res, next) {
		passport.authenticate('local', (err, user) => {
			if (err) res.status(500).send('something broke');
			if (!user) res.status(404).send('wrong credentials');
			if (user)
				req.login(user, function(err) {
					if (err) {
						return next(err);
					}
					res.status(200).send({ name: user.name, id: user.id });
				});
		})(req, res, next);
	});
};

uploadFiles = async (req, res, next) => {
	const uploadedFilesLinks = req.files.map(async (el) => {
		try {
			return (await wp.media().file(el.path, el.originalname).create({
				title: el.originalname
			})).source_url;
		} catch (e) {
			return null;
		}
	});
	Promise.all(uploadedFilesLinks)
		.then((links) => {
			if (links.some((el) => el === null)) {
				res.status(500).send(`Can't upload this file!`);
				throw new Error('Not allowed file');
			} else {
				return links;
			}
		})
		.then((links) => {
			const newContent = links.reduce((previousValue, currentValue, index, array) => {
				return previousValue.replace('LINK_PLACEHOLDER', currentValue);
			}, req.body.content);
			req.newContent = newContent;
			next();
		})
		.catch((err) => {
			console.log(err);
		});
};

function isNotLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) return next();
	let user = JSON.parse(req.user);
	res.status(200).send({ name: user.passport.user.name, id: user.passport.user.id });
}
