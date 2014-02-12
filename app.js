// Module dependencies.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}


// routing / request handlers
app.get('/', routes.index);
app.get('/location/new', routes.new_location);
app.get('/location/edit/:id', routes.new_location);

//api routes for REST resources
var Location = require('./api/location');
Location.register(app, '/api/location');


// start servering app
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
