var WPAPI = require( 'wpapi' );
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

    app.all('*', (req,res,next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })

    app.get('/posts/:pageNumber', (req, res) => {
        let page = parseInt(req.params.pageNumber,10);
        wp.posts().perPage(sharedConfig.postsPerPage).page(page).then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json(err);
        });
    });

    app.get('/categories', (req, res) => {
        wp.categories().perPage(100).then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json(err);
        });
    });

    // app.get('/posts/author/:authorId', (req, res) => {
    //     console.log(req.params.authorId);
    //     wp.posts().author(parseInt(req.params.authorId,10)).then((result) => {
    //         console.log(result.length);
    //         res.json(result);
    //     }).catch((err) => {
    //         // handle error
    //         console.log('error');
    //         console.log(err);
    //     });
    // });


    app.get('/authors', (req, res) => {
        getUsers(wp).then(
            (users) => {
                console.log(users);
                res.json(users);
            },
            (error) => {
                console.log(error);
                res.json(error);
            }
        );
    });
}