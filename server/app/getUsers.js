module.exports = (wp) => {
    return usersPromise = new Promise(function(resolve, reject) {
        wp.users().perPage(100).then(function( result ) {
            resolve(result);
        }).catch(function( err ) {
            reject(err);
        });
    })
}