var WPAPI = require('wpapi');
const wpConfig = require('./wpConfig.json');
var sharedConfig = require('./sharedConfig.json');
console.log(sharedConfig);

var wp = new WPAPI({
	endpoint: wpConfig.url,
	username: wpConfig.username,
	password: wpConfig.password
});
const getUsers = require('./getUsers.js');

module.exports = (app) => {
	app.all('*', (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	});

	app.get('/posts/:pageNumber', async (req, res, err) => {
		let page = parseInt(req.params.pageNumber, 10);
		if (err) res.status(500).send('Something broke!');
		try {
			res.json(await wp.posts().perPage(sharedConfig.postsPerPage).page(page));
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});

	app.get('/categories', async (req, res, err) => {
		if (err) res.status(500).send('Something broke!');
		try {
			res.json(await wp.categories().perPage(100));
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});

	app.get('/authors', async (req, res, err) => {
		if (err) res.status(500).send('Something broke!');
		try {
			res.json(await wp.users().perPage(100));
		} catch (e) {
			res.status(500).send('Something broke!');
		}
	});
};
