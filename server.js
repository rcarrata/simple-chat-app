// Requirements
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var mongoose = require('mongoose')

// Start with the static file html.index
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Model for mongodb schema
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

// Connection to the database
var dbUrl = 'mongodb+srv://rcarrata:redhat@cluster0-nxvsa.mongodb.net/test'

// Get messages
app.get('/messages', (req, res) => {
    // Send messages from mongodb
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
    
})

// Post messages 
app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        if(err)
            sendStatus(500)
                
        io.emit('message', req.body)
        res.sendStatus(200)
    })

})

// Socket io connections
io.on('connection', (socket) => {
    console.log('a user connected')
})

// Connection with mongoose to our mongodb
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true} ,(err) =>{
    console.log('mongo db connection', err)
})

// Initialization of the server
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
}) 
