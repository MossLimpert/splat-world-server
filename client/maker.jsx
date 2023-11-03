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

// puts stuff in result box
const displayInfo = (res) => {
    hideAllResultBoxes();

    if (res.error) helper.handleError(res.error);
    else {
        // make results sectino visible
        document.querySelector('#result').classList.remove('hidden');
        // put info in
        //console.log(res);
        document.querySelector('#result p').innerHTML = "test" ;//JSON.stringify(JSON.stringify(res));
    }
}

// for crew results
const displayCrew = (json) => {
    hideAllResultBoxes();

    //console.log(json);
    // set fields
    if (json.crews) {
        // make section visible
        document.querySelector('#result').classList.remove('hidden');
        // put info in
        document.querySelector('#result p').innerHTML = JSON.stringify(json.crews);
    }
    else {
        // make section visible
        document.querySelector('#res-crew').classList.remove('hidden');
        // info in
        document.querySelector('#res-crewname').innerHTML = json.crew.name;
        document.querySelector('#res-joincode').innerHTML = json.crew.joincode;
        document.querySelector('#res-owner').innerHTML = json.crew.owner;
    }
}

// fill template with user info
const displayUser = (res) => {
    hideAllResultBoxes();

    // make section visible
    document.querySelector('#res-user').classList.remove('hidden');

    // set fields
    document.querySelector('#res-username').innerHTML = res.user.username;
    document.querySelector('#res-join_date').innerHTML = res.user.join_date;
}

// fill template with tag info
const displayTag = (res) => {
    hideAllResultBoxes();
    //console.log(res);
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

    const username = e.target.querySelector('#username').value;
    const uid = e.target.querySelector('#uid').value;

    //console.log(username, uid);

    if (!username && !uid) {
        helper.handleError('No username and no user id!');
        return false;
    }

    if (username && !uid) {
        helper.sendGet(e.target.action, {
            username: username
        }, displayUser);
    } else if (!username && uid) {
        helper.sendGet(e.target.action, {
            id: uid
        }, displayUser);
    } else {
        helper.sendGet(e.target.action, {
            username: username,
            id: uid
        }, displayUser);
    }
};

// log in a user
const login = (e) => {
    e.preventDefault();
    helper.hideError();

    //console.log(e.target)

    const username = e.target.querySelector('#login-username').value;
    const password = e.target.querySelector('#login-password').value;

    //console.log(username, password);

    //return false;
    // need both to log in
    if (!username || !password) {
        helper.handleError('No username or no password.');
        return false;
    }

    helper.sendPost(e.target.action, { username: username, password: password }, displayInfo);
};

// get a crew using crew name
const getCrew = (e) => {
    e.preventDefault();
    helper.hideError();

    const crewName = e.target.querySelector('#crew-name').value;

    if (!crewName) {
        helper.handleError('No crew name entered!');
        return false;
    }

    helper.sendGet(e.target.action, {name: crewName}, displayCrew);
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
        helper.sendGet(e.target.action, {
            id: tid,
        }, displayTag);
    } else if (!tid && title) {
        helper.sendGet(e.target.action, {
            title: title,
        }, displayTag);
    } else {
        helper.sendGet(e.target.action, {
            id: tid,
            title: title,
        }, displayTag);
    }
}

// save a tag to saved tags
const saveTag = (e) => {
    e.preventDefault();
    helper.hideError();

    const id = e.target.querySelector('#save-tid').value;
    const title = e.target.querySelector('#save-title').value;

    if (!id && !title) {
        helper.handleError('No title and no id!');
        return false;
    }

    if (id && !title) {
        helper.sendPost(e.target.action, {
            id: id,
        }, displayInfo);
    } else if (!id && title) {
        helper.sendPost(e.target.action, {
            title: title,
        }, displayInfo);
    } else {
        helper.sendPost(e.target.action, {
            id: id,
            title: title
        }, displayInfo);
    }
}

// get all of a user's tags
const getTags = (e) => {
    e.preventDefault();
    helper.hideError();

    const uid = e.target.querySelector('#tags-uid').value;
    const cid = e.target.querySelector('#tags-cid').value;

    if (!cid && !uid) {
        helper.handleError('No user id or crew id!');
        return false;
    }

    if (cid && !uid) {
        helper.sendGet(e.target.action, {
            cid: cid
        }, displayInfo);
    } else if (!username && uid) {
        helper.sendGet(e.target.action, {
            id: uid
        }, displayInfo);
    } else {
        helper.sendGet(e.target.action, {
            cid: cid,
            id: uid
        }, displayInfo);
    }
}

// get count of user's tags
const getTagCount = (e) => {
    e.preventDefault();
    helper.hideError();

    // const uid = e.target.querySelector('#get-tag-count-id').value;
    //console.log(e.target.querySelector('#get-tag-count-id').value);

    if (!uid) {
        helper.handleError('No user id!');
        return false;
    }

    const data = {id: Number(e.target.querySelector('#get-tag-count-id').value)};
    //console.log(data);

    helper.sendGet(e.target.action, data, displayInfo);
}

const init = () => {
    // form references
    const getUserForm = document.getElementById('get-user');
    const getCrewForm = document.getElementById('get-crew');
    const getTagForm = document.getElementById('get-tag');
    const getTagsForm = document.getElementById('get-tags');
    const saveTagForm = document.getElementById('save-tag');
    const loginForm = document.getElementById('login');
    const getTagCountForm = document.getElementById('get-tag-count');

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
    saveTagForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        saveTag(e);
    });
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        login(e);
    });
    getTagCountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getTagCount(e);
    });
};

window.onload = init;