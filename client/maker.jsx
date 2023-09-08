// Author: Moss Limpert

const helper = require('./helper.js');


//
// event handlers
//

// get a user using username or id or both
const getUser = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#username');
    const uid = e.target.querySelector('#uid');

    if (!username && !uid) {
        helper.handleError('No username and no user id!');
        return false;
    }

    if (username && !uid) {
        helper.sendPost(e.target.method, {
            username: username
        });
    } else if (!username && uid) {
        helper.sendPost(e.target.method, {
            id: uid
        });
    } else {
        helper.sendPost(e.target.method, {
            username: username,
            id: uid
        });
    }
}

// get a crew using crew name
const getCrew = (e) => {
    e.preventDefault();
    helper.hideError();

    const crewName = e.target.querySelector('#crew-name');

    if (!crewName) {
        helper.handleError('No crew name entered!');
        return false;
    }

    helper.sendPost(e.target.method, {name: crewName});
}

// get a tag using id or title
const getTag = (e) => {
    e.preventDefault();
    helper.hideError();

    const tid = e.target.querySelector('#tid');
    const title = e.target.querySelector('#title');

    if (!tid && !title) {
        helper.handleError('No title and no tag id!');
        return false;
    }

    if (tid && !title) {
        helper.sendGet(e.target.method, {
            id: tid,
        });
    } else if (!tid && title) {
        helper.sendGet(e.target.method, {
            title: title,
        });
    } else {
        helper.sendGet(e.target.method, {
            id: tid,
            title: title,
        });
    }
}

// get all of a user's tags
const getTags = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#username');
    const uid = e.target.querySelector('#uid');

    if (!username && !uid) {
        helper.handleError('No username and no user id!');
        return false;
    }

    if (username && !uid) {
        helper.sendPost(e.target.method, {
            username: username
        });
    } else if (!username && uid) {
        helper.sendPost(e.target.method, {
            id: uid
        });
    } else {
        helper.sendPost(e.target.method, {
            username: username,
            id: uid
        });
    }
}

const init = () => {
    // form references
    const getUserForm = document.getElementById('get-user-form');
    const getCrewForm = document.getElementById('get-crew-form');
    // const getTagForm = document.getElementById('get-tag-form');
    const getTagsForm = document.getElementById('get-tags-form');

    // assigning event listeners
    getUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getUser(e);
    });
    getCrewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getCrew(e);
    });
    // getTagForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     getTag(e);
    // });
    getTagsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getTags(e);
    });

};

window.onload = init;