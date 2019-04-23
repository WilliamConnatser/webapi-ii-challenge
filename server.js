const express = require('express');
const router = require('./router')

//Initialize serve object
const server = express();

//Implement JSON middleware
server.use(express.json());

//Connect the server to the router
server.use('/api/posts', router);

server.get('/', (req, res) => {
    res.send('Sanity check');
});

module.exports = server;