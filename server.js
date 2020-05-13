var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


var messages = [
    {name: 'Rober', message: 'Hi'},
    {name: 'Tim', message: 'Hello'},
]

// Get messages
app.get('/messages', (req, res) => {
    res.send(messages)
})

// Post messages 
app.post('/messages', (req, res) => {
    //console.log(req.body)
    io.emit('message', req.body)
    messages.push(req.body)
    res.sendStatus(200)
})

// Socket io connections
io.on('connection', (socket) => {
    console.log('a user connected')
})

// Initialization of the server
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
}) 
