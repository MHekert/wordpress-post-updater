var WPAPI = require( 'wpapi' );
const wpConfig = require('./wpConfig.json');


var wp = new WPAPI({
    endpoint: wpConfig.url,
    username: wpConfig.username,
    password: wpConfig.password
});
const getUsers = require('./getUsers.js');

module.exports = (app) => {   
    app.get('/posts', (req, res) => {
        wp.posts().perPage(100).then((result) => {
            console.log(result.length);
            res.json(result);
        }).catch((err) => {
            // handle error
            console.log('error');
            console.log(err);
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