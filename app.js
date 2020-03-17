const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')
const http = require('http');
const path = require('path');
const socketIo = require("socket.io");

// Routes
const userSurveyRoutes = require('./api/routes/userSurveys');
const adminSurveyRoutes = require('./api/routes/adminSurveys');
const emailsRoutes = require('./api/routes/emails');

// Connect to db
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('Connected to mongodb');
})
require('dotenv').config();

// App initialization
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

const server = http.createServer(app);

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Type, Accept, Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

/* App Routes */
app.use('/api/survey', userSurveyRoutes);
app.use('/api/survey', adminSurveyRoutes);
app.use('/api/email', emailsRoutes); 

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})


// Init socket io
var io = socketIo.listen(server);
app.set('io', io)

io.on('connection', function (socket) {
    // let client = socket.request._query
    console.log("un client vient de se connecter");
    
    // Notification for recommandation
    socket.on('new notification', function (data) {
        io.emit('display notification',  data)
    })
    socket.on('new anounce notification', function (data) {
        socket.broadcast.emit('display anounce notification',  data)
    })

    socket.on("disconnect", () => console.log("Client disconnected"));
})

// Start the app
server.listen(process.env.PORT || 5000, function() {
    console.log("Server started")
})