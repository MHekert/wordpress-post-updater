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

module.exports = (app) => {
	app.all('*', (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
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

	app.post('/update/post', upload.array('file'), async (req, res) => {
		try {
			const categories = JSON.parse(req.body.categories);
			const uploadedFilesLinks = req.files.map(
				async (el) =>
					(await wp.media().file(el.path, el.originalname).create({
						title: el.originalname
					})).source_url
			);

			Promise.all(uploadedFilesLinks)
				.then((links) =>
					links.reduce((previousValue, currentValue, index, array) => {
						return previousValue.replace('LINK_PLACEHOLDER', currentValue);
					}, req.body.content)
				)
				.then(async (newContent) => {
					//update post
					if (req.body.id != null) {
						return await wp.posts().id(req.body.id).update({
							title: req.body.title,
							status: 'publish',
							categories: categories,
							content: newContent
						});
					}
				})
				.then((response) => res.status(200).send({ link: response.link }));
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});
};
