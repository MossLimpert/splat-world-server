// Author: Moss Limpert

const helper = require('./helper.js');

//
// event handlers
//

// add test user
const addUser = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#userpass').value;
    
    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
}

// add test crew
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

    console.log(body);

    helper.sendPost(e.target.action, body)
}

// add test tag
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


const init = () => {
    // form references
    const addUserForm = document.getElementById('add-user-form');
    const addCrewForm = document.getElementById('add-crew-form');
    const addTagForm = document.getElementById('add-tag-form');

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
};

window.onload = init;