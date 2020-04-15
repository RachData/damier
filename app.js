const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const http = require('http');
require('./config/passport')(passport);

var ws = require('ws');//ajouté
const Users = require('./session/users.js');//ajouté

const app = express();

var connected_users = {};


app.use('/Echiquier/Echiquier.html', express.static(path.join(__dirname, 'views/Echiquier')));


mongoose.connect('mongodb+srv://acces:acces2019@dbdame-tlsv3.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
/*
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});*/
/******************************         websocket           *********************/
const User = require('./lib').User;

app.use(express.static('public'));
//const connected_users = {};
// We attach express and ws to the same HTTP server
const server = http.createServer(app);
const wsserver = new ws.Server({ 
  server: server,
});

// Function to broadcast the list of conneted users
wsserver.broadcastList = () => {
  wsserver.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify({
          type: 'userlist',
          // We must avoid calling JSON.stringify on the wsconn field
          // of each user
          userlist: Object.values(connected_users).map((u) => u.serialize()),
        }));
    }
  });
};

// We define the WebSocket logic
wsserver.on('connection', (wsconn) => {
  console.log('Received new WS connection');
  let myuser = null;
  
  wsconn.on('message', (data) => {
    const parsed = JSON.parse(data);
    console.log(parsed);
    switch (parsed.type) {
      case 'new_connection':
        const name = parsed.username;
        connected_users[name] = myuser = new User(name, wsconn);
        wsserver.broadcastList();
        break;
      case 'challenge':
        // We check that the invitation is valid
        const opponent = connected_users[parsed.username];
        if (opponent && myuser.invite(opponent)) {
          // We notify each user
          opponent.wsconn.send(JSON.stringify({
            type: 'challenge',
            username: myuser.name,
          }));
          wsconn.send(JSON.stringify({
            type: 'challenge',
            username: opponent.name,
          }));
          wsserver.broadcastList();
        } else {
          // We send back an error
          wsconn.send(JSON.stringify({
            type: 'challenge_rejected',
            username: parsed.username,
          }));
        }
        break;
      case 'quit':
        const game = myuser.quit();
        if (game) {
          for (let p of ['player1', 'player2']) {
            game[p].wsconn.send(JSON.stringify({
              type: 'quit',
            }));
          }
          wsserver.broadcastList();
        } else {
          wsconn.send(JSON.stringify({
            type: 'error',
            message: 'Cannot quit',
          }));
        }
      default:
        console.error('Bad message', parsed);
    }  
  });
  
  wsconn.on('close', () => {
    if (myuser !== null) {
      delete connected_users[myuser.name];
      wsserver.broadcastList();
    }
  });
});

app.use('/',(req,res)=> res.sendFile(path.resolve('public/index.html')));

/*
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/Echiquier',require('./routes/users.js'));
*/
app.listen(process.env.PORT||3000);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);



