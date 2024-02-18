/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

// Authors: Austin Willoughby, Moss Limpert

/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = message => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('message').classList.remove('hidden');
};

// puts stuff in result box
const displayInfo = res => {
  if (res.error) helper.handleError(res.error);else {
    // make results sectino visible
    document.querySelector('#result').classList.remove('hidden');
    // put info in
    //console.log(res);
    document.querySelector('#result p').innerHTML = JSON.stringify(res);
  }
};

/* Sends post requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  let body = JSON.stringify(data);
  //console.log(body);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });
  //console.log("test");
  const result = await response.json();
  document.getElementById('message').classList.add('hidden');
  if (result.redirect) {
    window.location = result.redirect;
  }
  if (result.error) {
    handleError(result.error);
  }
  if (handler) {
    console.log(result);
    handler(result);
  }
};

// sends a get request
const sendGet = async (url, data, handler) => {
  //let params = new URLSearchParams(JSON.parse(data));
  let params = new URLSearchParams(data);
  let fullUrl = url + '?' + params;
  const response = await fetch(fullUrl + params, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const result = await response.json();
  hideError();
  if (result.redirect) {
    window.location = result.redirect;
  }
  if (result.error) {
    handleError(result.error);
  }
  if (handler) {
    //console.log(result);
    handler(result);
  }
};

// hides error message
const hideError = () => {
  document.getElementById('message').classList.add('hidden');
};

// https://stackoverflow.com/questions/30970648/changing-hex-codes-to-rgb-values-with-javascript
const convertHexRGB = hex => {
  let m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
};
module.exports = {
  handleError,
  sendPost,
  hideError,
  convertHexRGB,
  sendGet,
  displayInfo
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// Author: Moss Limpert

const helper = __webpack_require__(1);

//
// helpers
//
const hideAllResultBoxes = () => {
  document.querySelector('#res-tag').classList.add('hidden');
  document.querySelector('#res-user').classList.add('hidden');
  document.querySelector('#res-crew').classList.add('hidden');
  document.querySelector('#result').classList.add('hidden');
};

//
// response handlers
//

// puts stuff in result box
const displayInfo = res => {
  hideAllResultBoxes();
  if (res.error) helper.handleError(res.error);else {
    // make results sectino visible
    document.querySelector('#result').classList.remove('hidden');
    // put info in
    //console.log(res);
    document.querySelector('#result p').innerHTML = "test"; //JSON.stringify(JSON.stringify(res));
  }
};

// for crew results
const displayCrew = json => {
  hideAllResultBoxes();

  //console.log(json);
  // set fields
  if (json.crews) {
    // make section visible
    document.querySelector('#result').classList.remove('hidden');
    // put info in
    document.querySelector('#result p').innerHTML = JSON.stringify(json.crews);
  } else {
    // make section visible
    document.querySelector('#res-crew').classList.remove('hidden');
    // info in
    document.querySelector('#res-crewname').innerHTML = json.crew.name;
    document.querySelector('#res-joincode').innerHTML = json.crew.joincode;
    document.querySelector('#res-owner').innerHTML = json.crew.owner;
  }
};

// fill template with user info
const displayUser = res => {
  hideAllResultBoxes();

  // make section visible
  document.querySelector('#res-user').classList.remove('hidden');

  // set fields
  document.querySelector('#res-username').innerHTML = res.username;
  //document.querySelector('#res-join_date').innerHTML = res.user.join_date;
};

// fill template with tag info
const displayTag = res => {
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
};

//
// event handlers
//

// get a user using username or id or both
const getUser = e => {
  e.preventDefault();
  helper.hideError();
  const username = e.target.querySelector('#username').value;
  const uid = e.target.querySelector('#uid').value;

  //console.log(username, uid);

  if (!username && !uid) {
    helper.handleError('No username and no user id!');
    return false;
  }
  if (username && uid === "") {
    helper.sendGet(e.target.action, {
      username: username
    }, displayUser);
  } else if (username === "" && uid) {
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
const login = e => {
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
  helper.sendPost(e.target.action, {
    username: username,
    password: password
  }, displayInfo);
};

// get a crew using crew name
const getCrew = e => {
  e.preventDefault();
  helper.hideError();
  const crewName = e.target.querySelector('#crew-name').value;
  if (!crewName) {
    helper.handleError('No crew name entered!');
    return false;
  }
  helper.sendGet(e.target.action, {
    name: crewName
  }, displayCrew);
};

// get a tag using id or title
const getTag = e => {
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
      id: tid
    }, displayTag);
  } else if (!tid && title) {
    helper.sendGet(e.target.action, {
      title: title
    }, displayTag);
  } else {
    helper.sendGet(e.target.action, {
      id: tid,
      title: title
    }, displayTag);
  }
};

// save a tag to saved tags
const saveTag = e => {
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
      id: id
    }, displayInfo);
  } else if (!id && title) {
    helper.sendPost(e.target.action, {
      title: title
    }, displayInfo);
  } else {
    helper.sendPost(e.target.action, {
      id: id,
      title: title
    }, displayInfo);
  }
};

// get all of a user's tags
const getTags = e => {
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
};

// get count of user's tags
const getTagCount = e => {
  e.preventDefault();
  helper.hideError();
  const uid = e.target.querySelector('#get-tag-count-id').value;
  //console.log(e.target.querySelector('#get-tag-count-id').value);

  if (!uid) {
    helper.handleError('No user id!');
    return false;
  }
  const data = {
    id: Number(uid)
  };
  //console.log(data);

  helper.sendGet(e.target.action, data, displayInfo);
};

// get pfp link
const getPfpLink = e => {
  e.preventDefault();
  helper.hideError();
  const uid = e.target.querySelector('#get-pfp-link-id').value;
  if (!uid) {
    helper.handleError('No user id!');
    return false;
  }
  helper.sendGet(e.target.action, {
    id: Number(uid)
  }, helper.displayInfo);
};

// get user crews
const getUserCrews = e => {
  e.preventDefault();
  helper.hideError();
  const uid = e.target.querySelector('#get-user-crews-id').value;
  if (!uid) {
    helper.handleError('No user id!');
    return false;
  }
  helper.sendGet(e.target.action, {
    id: Number(uid)
  }, displayInfo);
};

// connects event listeners
const init = () => {
  // form references
  const getUserForm = document.getElementById('get-user');
  const getCrewForm = document.getElementById('get-crew');
  const getTagForm = document.getElementById('get-tag');
  const getTagsForm = document.getElementById('get-tags');
  const saveTagForm = document.getElementById('save-tag');
  const loginForm = document.getElementById('login');
  const getTagCountForm = document.getElementById('get-tag-count');
  const getPfpLinkForm = document.getElementById('get-pfp-link');
  const getUserCrewsForm = document.getElementById('get-user-crews');

  // assigning event listeners
  getUserForm.addEventListener('submit', e => {
    e.preventDefault();
    getUser(e);
  });
  getCrewForm.addEventListener('submit', e => {
    e.preventDefault();
    getCrew(e);
  });
  getTagForm.addEventListener('submit', e => {
    e.preventDefault();
    getTag(e);
  });
  getTagsForm.addEventListener('submit', e => {
    e.preventDefault();
    getTags(e);
  });
  saveTagForm.addEventListener('submit', e => {
    e.preventDefault();
    saveTag(e);
  });
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    login(e);
  });
  getTagCountForm.addEventListener('submit', e => {
    e.preventDefault();
    getTagCount(e);
  });
  getPfpLinkForm.addEventListener('submit', e => {
    e.preventDefault();
    getPfpLink(e);
  });
  getUserCrewsForm.addEventListener('submit', e => {
    e.preventDefault();
    getUserCrews(e);
  });
};
window.onload = init;
})();

/******/ })()
;