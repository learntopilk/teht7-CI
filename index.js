var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var blogsRouter = require('./controllers/blogs.js');
var usersRouter = require('./controllers/users');
var loginRouter = require('./controllers/login');
var tokenDigger = require('./utils/tokenDigger');
//require('dotenv').config()
var config = require('./utils/config.js');
var path = require('path');
app.use(cors());
app.use(bodyParser.json());
app.use(tokenDigger);
app.use(express.static('build'));
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
//app.use('/*', express.static('build'))
// catch-all
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'), function (err) {
        console.log(err);
        res.status(500);
    });
});
var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
mongoose.connect(config.mongoUrl, options)
    .then(console.log('DB up and connected: ', config.mongoUrl))["catch"](function (err) { return console.log(err); });
var server = http.createServer(app);
var PORT = process.env.PORT || config.port || 3003;
server.on('close', function () {
    mongoose.connection.close();
});
server.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
module.exports = { app: app, server: server };
