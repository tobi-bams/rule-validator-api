//Imports
const http = require('http');
const app = require('./app');

app.set('port', process.env.PORT || 3000);

//Server Initialization
const server = http.createServer(app);


//Listening
server.listen(process.env.PORT || 3000);