var express         = require('express');
var app             = express();
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var server          = require('http').createServer(app);
var sharedConfig 	= require('./app/sharedConfig.json');

var port            = process.env.PORT || sharedConfig.backendPort;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));



require('./app/routes.js')(app);


server.listen(port);
console.log('The magic happens on port ' + port);