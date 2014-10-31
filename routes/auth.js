/**
 * Created by mattjohnston on 2014-10-30.
 */
//OAuth information!!!!
var config = require('./../config/config');
var mongoose=require('mongoose');
var User = mongoose.models.User;
    module.exports = function(app) {
        var OAuth = require('oauth').OAuth, oauth = new OAuth(
            "https://api.twitter.com/oauth/request_token",
            "https://api.twitter.com/oauth/access_token",
            "pSdcelcE7JfAfQxxRs5dVdCvl",
            "1HaLNsFG0g9yYGBIUIKg61T6M0TSaHGUhganA2NoFkEPVMwqT9",
            "1.0",
            config.url + "/#/party",
            "HMAC-SHA1"
        );


        app.get('/auth/twitter', function (req, res) {

            oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
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
                    res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
                }
            });
        });

        app.get('/auth/twitter/callback', function (req, res, next) {
            console.log(req.query);
            var oauth_data = {
                token: req.query.oauth_token,
                verifier: req.query.oauth_verifier
            };

            oauth.getOAuthAccessToken(
                oauth_data.token,
                oauth_data.token_secret,
                oauth_data.verifier,
                function (error, oauth_access_token, oauth_access_token_secret, results) {
                    if (error) {
                        res.send(error);
                    } else {
                        //req.session.oauth = results;
                        console.log(results, "<--results");
                        var user = new User(results);
                        user.save(function (err) {
                            if (!err) {
                                console.log("created user");
                                return res.json(user);
                            }
                        });
                    }
                });
        })

    };
