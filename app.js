'use strict';

// Module dependencies.
var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    fs = require('fs'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler');

var app = module.exports = exports.app = express();
app.use(session({secret: 'keyboard cat'}))

app.locals.siteName = undefined;

// Connect to database
var db = require('./config/db');
var config = require('./config/config');
app.use(express.static(__dirname + '/public'));

// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
    app.use(morgan('dev'));
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('view options', {
        pretty: true
    });
}

if ('test' == env) {
    app.use(morgan('test'));
    app.set('view options', {
        pretty: true
    });
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
}

if ('production' == env) {
    app.use(morgan());
     app.use(errorhandler({
        dumpExceptions: false,
        showStack: false
    }));
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(methodOverride());
app.use(bodyParser());

// Bootstrap routes/api
var routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(function(file) {
  require(routesPath + '/' + file)(app);
});

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});


//OAuth information!!!!
var OAuth = require('oauth').OAuth
    , oauth = new OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        "2VlD0mXgpgGPUdjtOqjMnxGy9",
        "rfsewTO5SrwT0ZqLvapw6uHuMj0aVGXsUMMRg5DUR01Xv1FhyH",
        "1.0",
        "http://yoursite.com/auth/twitter/callback",
        "HMAC-SHA1"
    );


app.get('/auth/twitter', function(req, res) {

    oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error);
            res.send("Authentication Failed!");
        }
        else {
            req.session.oauth = {
                token: oauth_token,
                token_secret: oauth_token_secret
            };
            console.log(req.session.oauth);
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
        }
    });

});

app.get('/auth/twitter/callback', function(req, res, next) {

    if (req.session.oauth) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var oauth_data = req.session.oauth;

        oauth.getOAuthAccessToken(
            oauth_data.token,
            oauth_data.token_secret,
            oauth_data.verifier,
            function(error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                    console.log(error);
                    res.send("Authentication Failure!");
                }
                else {
                    req.session.oauth.access_token = oauth_access_token;
                    req.session.oauth.access_token_secret = oauth_access_token_secret;
                    console.log(results, req.session.oauth);

                    //THIS IS YOUR USER DATA INFO
                    //Docs available here https://dev.twitter.com/rest/reference/get/account/verify_credentials
                    var userdata = {};
                    app.get('https://api.twitter.com/1.1/account/verify_credentials.json', function (req, res){
                        userdata = res;
                    });

                    res.send("Authentication Successful");
                    // res.redirect('/'); // You might actually want to redirect!
                }
            }
        );
    }
    else {
        res.redirect('/login'); // Redirect to login page
    }

});
