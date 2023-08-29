// Author: Moss Limpert

const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// color helper function
const randomPaletteColor = () => {
    let colors = ["rgb(165,76,173)", "rgb(69,67,114)", "rgb(47,41,99)"];
    let index = Math.floor(Math.random() * 3);
    return colors[index];
}

//
// event handlers
//

// manage status form input + send post
const handleStatus = (e) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#statusText').value;

    if (!text) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {text}, loadUserStatus);

    return false;
};

// onclick function for statuses to fill create status form
const handleClickStatus = (e) => {
    e.preventDefault();

    const statusInputElem = document.querySelector('#statusText');
    const text = e.target.innerHTML;
    //console.log(text);
    statusInputElem.value = text;
};

//
// react components
//

// react status form component
const StatusForm = (props) => {
    return (
        <form id="statusForm"
            onSubmit={handleStatus}
            name="statusForm"
            action="/home"
            method="POST"
            className="statusForm"
        >
            <h3>Create Status</h3>
            <label htmlFor="text">Status Text:</label>
            <input id="statusText" type="text" name="text" placeholder="listening to music" />
            <input className="makeStatusSubmit" type="submit" value="Post Status" />
        </form>
    );
};

// react bubble list component
const BubbleList = (props) => {
    // if user is in no bubbles, say so
    if (props.bubbles.length === 0 || !props.bubbles) {
        return (
            <div className="bubblesList">
                <h3 className="emptyBubbles">No Bubbles Yet!</h3>
            </div>
        );
    }

    // for each bubble, make a bubble node
    // give it a bubble
    const bubbleNodes = [];

    // for each bubble, make user circles w statuses
    const usernameNodes = [];
    for (let i = 0; i < props.bubbles.length; i++) {
        const bubblesUsers = [];

        // for each user, make the circles
        for (let j = 0; j < props.bubbles[i].users.length; j++) {
            let c = randomPaletteColor();               // color
            let n = props.bubbles[i].users[j].username; // username
            let t = props.bubbles[i].users[j].status;   // text
            let l;                                      // speech bubble length
            if (!t || t === "") {
                l = 1;               
            } else l = t.length * 11;       
            let w = 100 + l / 2;                        // svg width
            
            bubblesUsers.push(
                <CircleWithSpeechBubble 
                    color={c}
                    length={l}
                    username={n}
                    text={t}
                    width={w}
                    />
            );
        }

        usernameNodes.push(bubblesUsers);
    }

    // put it all together
    for (let i = 0; i < props.bubbles.length; i++) {
        bubbleNodes.push(
            <div className="bubble"
                style={{
                    backgroundColor: props.color,
                    width: props.radius * 2,
                    height: props.radius * 2,
                    borderRadius: '50%',
                    padding: '20px'
                }}
            >
                <h2 className="bubbleName">{props.bubbles[i].name} </h2>
                <ul className="bubbleUsers"> 
                    {usernameNodes[i]}
                </ul>
            </div>
        );
    };
    //console.log(usernameNodes);
    //console.log(bubbleNodes);

    return (
        <div className="bubblesList">
            <h1>Bubbles: </h1>
            <div id='bubbles'>
                {bubbleNodes}
            </div>
        </div>
    );
};

// react current status component
const CurrentStatus = (props) => {
    return (
        <div className="currentStatus">
            <h3>Current Status: {props.status}</h3>
        </div>
    )
};

// react svg circle bubble component
const CircleWithSpeechBubble = (props) => {
    // color
    // speech bubble length
    // text
    // username

    // speech bubble offset
    // rework this l8r
    //let offset = `translate(-${props.length/16},0)`;
    
    // bubble arrow offset
    let offset = `translate(${props.length / 4}, 40)`;

    let speechBubbleOffset = `${(props.width - props.length) / 2}`;

    if (props.length < 10) {
        return (
            <svg width={props.width} height="150">
              <circle cx="50" cy="100" r="40" fill={props.color} />
      
              <text x="50" y="100" textAnchor="middle" fill="white" fontSize="16">{props.username}</text>
            </svg>
          );
    }
    return (
        <svg width={props.width} height="150">
          <circle cx={props.width / 2} cy="100" r="40" fill={props.color} />
          <path d="M50 20 l20 -20 h-40 l20 20 z" fill={props.color} transform={offset} />
          <rect x={speechBubbleOffset} y="20" width={props.length} height="30" rx="10" fill={props.color} />
          <text x={props.width / 2} y="40" textAnchor="middle" fill="white" fontSize="16">{props.text}</text>
          <text x={props.width / 2} y="100" textAnchor="middle" fill="white" fontSize="16">{props.username}</text>
        </svg>
      );
};

// react past status component
const Status = (props) => {
    let borderRadius = props.size / 2;
    let fs = 16;
    return (
        <div 
            id="statusNode"
            onClick={handleClickStatus}
            style={{ 
                width: props.size, 
                height: fs * 2, 
                borderRadius, 
                backgroundColor:randomPaletteColor(), 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'center', 
                alignItems: 'center',
                margin: `0 10 0 0`, 
            }}
        >   
            <span style={{ 
                fontSize: fs, 
                color: 'white' 
            }}>
                {props.text}
            </span>
        </div>
    );
};

// react list of statuses component
const PastStatusList = (props) => {
    if (props.statuses.length === 0) {
        return (
            <div id="statusList">
                <h3>No Past Statuses!</h3>
            </div>
        )
    }

    const statusNodes = [];

    // make all the status nodes
    for (let i = 0; i < props.statuses.length; i++) {
        // text
        let t = props.statuses[i];
        // size
        let s = props.statuses[i].length * 11;
        statusNodes.push( <Status
            text={t}
            size={s} />
        );
    }

    return (
        <div id='statuses'>
            {statusNodes}
        </div>
    );
};

//
// loading / page functionality
//

// all react components that need to be updated with info
// from the server are filled here
const reloadPage = () => {
    loadBubblesFromServer();
    loadUserStatus();
    loadPastStatuses();
};

// fill bubble list component
const loadBubblesFromServer = async () => {
    const response = await fetch('/get-bubbles');
    const data = await response.json();
    //console.log(data);
    ReactDOM.render(
        <BubbleList bubbles={data} color="rgb(137, 161, 239)" radius={200}/>,
        document.getElementById('allBubbles')
    );
};

// fill user status component
const loadUserStatus = async () => {
    const response = await fetch('/get-current-status');
    const data = await response.json();

    ReactDOM.render(
        <CurrentStatus status={data.status} />,
        document.getElementById('currentStatus')
    );
};

// fill list of user statuses
const loadPastStatuses = async () => {
    const response = await fetch('/get-user-statuses');
    const data = await response.json();
    //console.log(data);
    ReactDOM.render(
        <PastStatusList statuses={data.statuses} />,
        document.getElementById('pastStatus')
    )
};


const init = () => {
    // create status form
    ReactDOM.render(
        <StatusForm />,
        document.getElementById('makeStatus')
    );
    // bubbles list
    ReactDOM.render(
        <BubbleList bubbles={[]} />,
        document.getElementById('allBubbles')
    );
    // statuses list 
    ReactDOM.render(
        <PastStatusList statuses={[]} />,
        document.getElementById('pastStatus')
    );

    //fetch('/get-bubbles');
    reloadPage();
};

window.onload = init;