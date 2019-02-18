var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var account = require('./routes/account');
var accounts = require('./routes/accounts');
var transaction = require('./routes/transaction');
var search = require('./routes/search');
var block = require('./routes/block');
var uncle = require('./routes/uncle');
var disclaimer = require('./routes/disclaimer');
var config = new(require('./config.js'))();


var exporterTokenService = require('./services/exporter_tokens.js');
new exporterTokenService();

var exporterService = require('./services/exporter.js');
new exporterService();

var listenReceipt = require('./services/listenReceipt.js');
new listenReceipt();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('config', config);
app.set('trust proxy', true);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(config.logFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/block', block);
app.use('/uncle', uncle);
app.use('/transaction', transaction);

app.use('/account', account);
app.use('/accounts', accounts);
app.use('/search', search);
app.use('/disclaimer', disclaimer);

app.locals.moment = require('moment');
app.locals.hashFormatter = new(require('./utils/hashformatter.js'))();
app.locals.diffformatter = new(require('./utils/diffformatter.js'))();
app.locals.sizeformatter = new(require('./utils/sizeformatter.js'))();
app.locals.gasformatter = new(require('./utils/gasformatter.js'))();
app.locals.ethformatter = new(require('./utils/ethformatter.js'))();
app.locals.hexformatter = new(require('./utils/hexformatter.js'))();
app.locals.gasprice = new(require('./utils/gasprice.js'))();
app.locals.txprice = new(require('./utils/txprice.js'))();
app.locals.tokenformatter = new(require('./utils/tokenformatter.js'))();
app.locals.config = config;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
