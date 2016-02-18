var jsforce = require('jsforce'),
    conn = new jsforce.Connection();

module.exports = function login(remote, username, password){
    return conn.login(username, password)
        .then(userInfo => `${conn.instanceUrl}/secur/frontdoor.jsp?sid=${conn.accessToken}`)
        .then(url => remote.url(url))
        .then(res => conn);
}
