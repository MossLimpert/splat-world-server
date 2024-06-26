// Author: Moss Limpert

const helper = require('./helper.js');

//
// event handlers
//

// add user
const addUser = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#userpass').value;
    
    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {
        username: username,
        pass: pass
    });
}

// add crew
const addCrew = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('.crewname').value;
    const pass = e.target.querySelector('#crewpass').value;
    let hexColor = e.target.querySelector('#color').value;
    const ownerID = e.target.querySelector('#owner').value;

    const color = helper.convertHexRGB(hexColor);

    

    if (!name || !pass || !ownerID) {
        helper.handleError('Crew name, password, or owner ID missing!');
        return false;
    }

    const body = {
        name: name,
        pass: pass,
        owner: ownerID,
        color_r: color.r,
        color_g: color.g,
        color_b: color.b
    };

    //console.log(body);

    helper.sendPost(e.target.action, body, helper.displayInfo)
}

// add tag
const addTag = (e) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#title').value;
    const uID = e.target.querySelector('#userid').value;
    const cID = e.target.querySelector('#crewid').value;

    if (!uID || !cID || !title) {
        helper.handleError('Title, User ID, or Crew ID field is empty!');
        return false;
    }
    
    helper.sendPost(e.target.action, {
        author_ref: parseInt(uID),
        crew: parseInt(cID),
        title: title,
    });
}

// flag a tag for objectionable content
const flagTag = (e) => {
    e.preventDefault();
    helper.hideError();

    let uID = null;
    let tID = null; 

    uID = e.target.querySelector('#userid').value;
    tID = e.target.querySelector('#tagid').value;

    if (!uID || !tID) {
        helper.handleError('User ID or Tag ID field is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {
        uid: parseInt(uID),
        tid: parseInt(tID)
    });
}

// add location to tag
const addLocation = (e) => {
    e.preventDefault();
    helper.hideError();

    let tID = null;
    let latitude = null;
    let longitude = null;

    tID = e.target.querySelector('#tagid').value;
    latitude = e.target.querySelector('#latitude').value;
    longitude = e.target.querySelector('#longitude').value;

    console.log(tID, latitude, longitude);

    if (tID === null || latitude === null || longitude === null) {
        helper.handleError('Tag ID or latitude or longitude field is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {
        tid: parseInt(tID),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
    });
}

const signup = (e) => {
    e.preventDefault();
    helper.hideError();

    let username = null;
    let pass = null;
    let pass2 = null;
    username = e.target.querySelector('#username').value;
    pass = e.target.querySelector('#pass').value;
    pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('one or more fields are empty!');
        return false;
    }

    helper.sendPost(e.target.action, {
       username: username,
       pass: pass,
       pass2: pass2 
    });
}

// set up event listeners
const init = () => {
    // form references
    const addUserForm = document.getElementById('add-user-form');
    const addCrewForm = document.getElementById('add-crew-form');
    const addTagForm = document.getElementById('add-tag-form');
    const flagTagForm = document.getElementById('flag-tag-form');
    const addLocationForm = document.getElementById('add-location-form');

    const signupForm = document.getElementById('signup-form');

    // assigning event listeners
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addUser(e);
    });
    addCrewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addCrew(e);
    });
    addTagForm.addEventListener('submit',(e) => {
        e.preventDefault();
        addTag(e);
    });
    flagTagForm.addEventListener('submit', (e) => {
        e.preventDefault();
        flagTag(e);
    });
    addLocationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addLocation(e);
    });
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        signup(e);
    });

};



window.onload = init;