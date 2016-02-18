var chai = require('chai'),
    assert = chai.assert,
    webdriverio = require('webdriverio'),
    remote = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome' } });


describe('Awesome e2e', function () {

    this.timeout(30000);

    before(function () {
        return remote.init();
    });

    it('should login', login);

    after(function () {
        return remote.end();
    });

});

function login() {
    var username = 'john.aaron.nelson@gmail.com',
        password = 'Science3',
        loginUrl = 'https://login.salesforce.com';

    return remote.url(loginUrl)
        .getTitle(function (err, title) {
            // assert.strictEqual(true, false);
            assert.strictEqual(title, 'Login | Salesforce');
        })
        .setValue('#username', username)
        .setValue('#password', password)
        .saveScreenshot('./errorShots/login.png')
        .click('#Login')
        .waitForVisible('#tsidButton', 30000)
        .getUrl().then(function (url) {
            var host = url.split('//')[0];
            var site = url.split('//')[1].split('/')[0];
            var awesomeApp = `${host}\/\/${site}\/apex\/vfPage`;
            remote.url(awesomeApp);
            remote.waitUntil(null, 30000);
            return remote.getTitle(function (err, title) {
                assert.strictEqual(title, 'Awesome App');
            })
        });
}
