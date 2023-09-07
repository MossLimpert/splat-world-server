// Author: Moss Limpert

const helper = require('./helper.js');


// color helper function
const randomPaletteColor = () => {
    let colors = ["rgb(165,76,173)", "rgb(69,67,114)", "rgb(47,41,99)"];
    let index = Math.floor(Math.random() * 3);
    return colors[index];
}

//
// event handlers
//






const init = () => {
    

    //fetch('/get-bubbles');
    reloadPage();
};

window.onload = init;