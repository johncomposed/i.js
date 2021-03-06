var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorhandler = require('errorhandler'),
    favicon = require('serve-favicon'),
    morgan  = require('morgan'),
    http = require('http'),
    path = require('path');

var routes = require('./routes'),
    config = require('./routes/config'),
    repl_manager = require('./routes/repl_manager'),
    scrapbook = require('./routes/scrapbook');

var app = exports.app = express();

// all environments
// app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// Hackily making d3 and codemirror available to client 
// Previously this called path.join(_dirname, node_modules);
app.use("/codemirror",express.static(
  path.dirname(require.resolve('codemirror')).slice(0, -4)
));
app.use("/d3",express.static(
  path.dirname(require.resolve('d3'))
));

// development only
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

app.get('/', routes.index);

app.post('/repl', repl_manager.eval);
app.post('/autocomplete', repl_manager.autocomplete);

app.get('/scrapbook/*', scrapbook.scrapbook);
app.get('/load', scrapbook.load);
app.post('/save', scrapbook.save);
app.post('/delete', scrapbook.delete);

config.setup();

var serve = exports.serve = function(port) {
  app.set('port', port || process.env.PORT || 3000);
  
  http.createServer(app).listen(app.get('port'), function () {
      console.log('i.js server listening on port ' + app.get('port'));
  });
}

// If not calling via npm module
if (require.main === module) {
  serve();
}
