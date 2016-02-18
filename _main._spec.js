var username = 'john.aaron.nelson@gmail.com',
    password = 'Science3',
    chai = require('chai'),
    assert = chai.assert,
    jsforce = require('jsforce'),
    conn = new jsforce.Connection(),
    webdriverio = require('webdriverio'),
    remote = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome' } });

// remote.init()
//     .then(login)
//     .then(goToNewAccount)
//     .then(remote.debug)
//     .then(remote.end);

describe('Salesforce E2E', function () {

    this.timeout(30000);

    before(function () {
        return remote.init().then(login);
    });

    it('should make a new account', () => {
        return goToNewAccount().then(res => remote.debug());
    });

    after(function () {
        return remote.end();
    });

});

function login() {
    return conn.login(username, password)
        .then(userInfo => `${conn.instanceUrl}/secur/frontdoor.jsp?sid=${conn.accessToken}`)
        .then(url => remote.url(url));
}

function goToNewAccount() {
    return conn.describe("Account")
        .then(meta => meta.urls['uiNewRecord'])
        .then(url => remote.url(url));
}
