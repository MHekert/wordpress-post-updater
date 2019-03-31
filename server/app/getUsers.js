module.exports = (wp) => {
    return usersPromise = new Promise(function(resolve, reject) {
        wp.users().then(function( result ) {
            resolve(result);
        }).catch(function( err ) {
            reject(err);
        });
    })
}