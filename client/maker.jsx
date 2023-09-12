// Author: Moss Limpert

const helper = require('./helper.js');
const handlebars = require('handlebars');

//
// helpers
//
const hideAllResultBoxes = () => {
    document.querySelector('#res-tag').classList.add('hidden');
    document.querySelector('#res-user').classList.add('hidden');
    document.querySelector('#res-crew').classList.add('hidden');
    document.querySelector('#result').classList.add('hidden');
}


//
// response handlers
//

const displayInfo = (json) => {

}

// fill handlebar template with tag info
const displayTag = (res) => {
    hideAllResultBoxes();
    console.log(res);
    // const data = {
    //     tag: {
    //         title: "",
    //         crew_ref: 0,
    //         author_ref: 0,
    //         active: 0,
    //     },
    // };

    // make section visible
    document.querySelector('#res-tag').classList.remove('hidden');

    // set fields
    document.querySelector('#res-title').innerHTML = res.tag.title;
    document.querySelector('#res-crewref').innerHTML = res.tag.crew_ref;
    document.querySelector('#res-authorref').innerHTML = res.tag.author_ref;
    document.querySelector('#res-active').innerHTML = res.tag.active;

}




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

    const tid = e.target.querySelector('#tid').value;
    const title = e.target.querySelector('#title').value;

    if (!tid && !title) {
        helper.handleError('No title and no tag id!');
        return false;
    }

    if (tid && !title) {
        helper.sendGet(e.target.method, {
            id: tid,
        }, displayTag);
    } else if (!tid && title) {
        helper.sendGet(e.target.method, {
            title: title,
        }, displayTag);
    } else {
        helper.sendGet(e.target.method, {
            id: tid,
            title: title,
        }, displayTag);
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
    const getUserForm = document.getElementById('get-user');
    const getCrewForm = document.getElementById('get-crew');
    const getTagForm = document.getElementById('get-tag');
    const getTagsForm = document.getElementById('get-tags');

    // assigning event listeners
    getUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getUser(e);
    });
    getCrewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getCrew(e);
    });
    getTagForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getTag(e);
    });
    getTagsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getTags(e);
    });

};

window.onload = init;