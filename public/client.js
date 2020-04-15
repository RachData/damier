if (!sessionStorage.username) {
  sessionStorage.username = prompt("Hello, choose a username");
}

const mainDiv = $('#main');

// A status to know if we are playing or not
let status = 'available';

// Utility function
const send = (ws, data) => ws.send(JSON.stringify(data));

const ws = new WebSocket('ws://' + window.location.host)

ws.addEventListener('open', function(e) {
  send(ws, { 
    type: 'new_connection', 
    username: sessionStorage.username,
  });

  ws.addEventListener('message', function(e) {
    const parsed = JSON.parse(e.data);
    console.log(parsed);
    switch (parsed.type) {
      case 'userlist':
        if (status == 'available') {
          mainDiv.innerHTML = '';
          mainDiv.appendChild(createUserList(parsed.userlist));
        }
        break;
      case 'challenge':
        status = 'playing'
        mainDiv.innerHTML = '';
        append(mainDiv, 'div').textContent = `You are playing with ${parsed.username}`;
        const button = append(mainDiv, 'button');
        button.textContent = 'Quit';
        button.className = 'quit';
        break;
      case 'challenge_rejected':
        alert('The invite was rejected');
        break;
      case 'quit':
        status = 'available';
        break;
      case 'error':
        console.error(parsed.message);
        break;
      default:
        console.error('Bad message', parsed);
    }
  });
  
  // We attach one global event listener on the div to capture 
  // clicks on all "Challenge" buttons
  mainDiv.addEventListener('click', (e) => {
    if (e.target.className == 'challenge') {
      send(ws, {
        type: 'challenge',
        username: e.target.dataset.username,
      });
    } else if (e.target.className == 'quit') {
      send(ws, { type: 'quit' });
    }
  });
});
