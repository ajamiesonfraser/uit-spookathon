/**
 * Created by mattjohnston on 2014-10-30.
 */
//OAuth information!!!!
    module.exports = function(app) {
        var OAuth = require('oauth').OAuth, oauth = new OAuth(
                "https://api.twitter.com/oauth/request_token",
                "https://api.twitter.com/oauth/access_token",
                "pSdcelcE7JfAfQxxRs5dVdCvl",
                "1HaLNsFG0g9yYGBIUIKg61T6M0TSaHGUhganA2NoFkEPVMwqT9",
                "1.0",
                "http://104.131.171.42:49157/auth/twitter/callback",
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
                    res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
                }
            });

        });

        app.get('/auth/twitter/callback', function (req, res, next) {

            if (req.session.oauth) {
                req.session.oauth.verifier = req.query.oauth_verifier;
                var oauth_data = req.session.oauth;

                oauth.getOAuthAccessToken(
                    oauth_data.token,
                    oauth_data.token_secret,
                    oauth_data.verifier,
                    function (error, oauth_access_token, oauth_access_token_secret, results) {
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
                            app.get('https://api.twitter.com/1.1/account/verify_credentials.json', function (req, res) {
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
    };
