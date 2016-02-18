var settings = require('./../.vscode/settings.json').sfdc,
    jsforce,
    chai = require('chai'),
    assert = chai.assert,
    webdriverio = require('webdriverio'),
    remote = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome' } }),
    login = require('../../utils/login');

describe('Dog Groomer E2E', function () {

    this.timeout(30000);

    before(function () {
        return init();
    });

    // **Test:** Open DogTracker Application  
    // It Should go to the the homepage for a Dog Groomer
    // Login as User with Kennel Owner Profile
    // Verify that the Dogs tab/list is visible and selected.
    // Verify that the list contains the required fields
    it('Should open the DogTracker Application', () => {
        return goToDogTracker()
            .then(res => goToListView())
            .then(res => makeListViewAssertions());
    });

    it('Should create a new Dog', () => {
        return goToEditPage()                   // Go to edit page
            .then(res => fillOutDogEditPageForGroomer()) // Fill out page
            .then(res => makeCreatedDogAssertions());    // Make createdDogAssertions
    });

    after(function () {
        return remote.end();
    });

});

function init() {
    return remote.init()
        .then(res => login(remote, settings.username, settings.password))
        .then(conn => jsforce = conn);
}

function goToDogTracker() {
    return jsforce.query("SELECT StartUrl FROM AppMenuItem WHERE Name = 'DogTracker'")
        .then(res => res.records[0] && res.records[0].StartUrl)
        .then(url => remote.url(url))
}

function goToListView() {
    // Click Go
    return remote
        .waitForExist('#tsidButton')
        .click('[name="go"]');
}

function makeListViewAssertions() {
    return Promise.all([
        remote.isExisting('[title="Dogs Tab - Selected"]'),
        remote.isExisting('[title="Dog Name"]'),
        remote.isExisting('[title="Height"]'),
        remote.isExisting('[title="Weight"]'),
        remote.isExisting('[title="Coloring"]'),
    ]).then(res => {
        assert(res[0], 'Dogs tab is not selected');
        assert(res[1], 'Name column doesn\'t exist');
        assert(res[2], 'Height column doesn\'t exist');
        assert(res[3], 'Weight column doesn\'t exist');
        assert(res[4], 'Coloring column doesn\'t exist');
    });
}

function goToEditPage(){ 
    return jsforce.describe("Dog__c")
        .then(meta => meta.urls['uiNewRecord'])
        .then(url => remote.url(url));
}  
                
function fillOutDogEditPageForGroomer(){
    return remote
        .setValue('input#Name', 'Fido').keys('Tab')
        .keys('John Nelson').keys('Tab')
        .keys('110').keys('Tab')
        .keys('Brindle').keys('Tab')
        .keys('23').keys('Tab')
        .keys('Standard').keys('Tab')
        .keys('Give him a mohawk').keys('Tab')
        .keys('Likes morning appointments').keys('Tab')
        .keys('10%').keys('Tab').keys('Enter');
}
function makeCreatedDogAssertions(){
    return Promise.all([
        remote.isExisting('.pbTitle .mainTitle'),
    ]).then(res => {
        assert(res[0], 'Dog not successfully created');
    });
}
