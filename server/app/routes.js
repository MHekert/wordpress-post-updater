var WPAPI = require('wpapi');
const wpConfig = require('./wpConfig.json');
var sharedConfig = require('./sharedConfig.json');

var wp = new WPAPI({
	endpoint: wpConfig.url,
	username: wpConfig.username,
	password: wpConfig.password
});

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

module.exports = (app) => {
	app.all('*', (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		// res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    	res.header("Access-Control-Allow-Credentials", "true");
    	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
		next();
	});

	app.get('/posts/:pageNumber', async (req, res) => {
		let page = parseInt(req.params.pageNumber, 10);
		try {
			let wpResponse = await wp.posts().perPage(sharedConfig.postsPerPage).page(page);
			let responseObj = { posts: wpResponse, totalPages: wpResponse._paging.totalPages };
			res.json(responseObj);
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


	app.post('/update/post', upload.array('file', 12), (req, res) => {
		try {
			console.log(req.files);
			console.log(req.body);
			res.status(200).send('post updated');
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});
};
