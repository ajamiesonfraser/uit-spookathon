module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      User = mongoose.models.User,
      api = {};

  // ALL
  api.users = function (req, res) {
    User.find(function(err, users) {
      if (err) {
        res.json(500, err);
      } else {
        res.json({users: users});
      }
    });
  };

  // GET
  api.user = function (req, res) {
    var id = req.params.id;
    User.findOne({ '_id': id }, function(err, user) {
      if (err) {
        res.json(404, err);
      } else {
        res.json(200, {user: user});
      }
    });
  };

  // POST
  api.addUser = function (req, res) {

    var user;

    if(typeof req.body.user == 'undefined'){
      return res.json(500, {message: 'user is undefined'});
    }

    user = new User(req.body.user);

    user.save(function (err) {
      if (!err) {
        console.log("created user");
        return res.json(201, user.toObject());
      } else {
         return res.json(500, err);
      }
    });
  };

  // PUT
  api.editUser = function (req, res) {
    var id = req.params.id;

    User.findById(id, function (err, user) {



      if(typeof req.body.user["title"] != 'undefined'){
        user["title"] = req.body.user["title"];
      }

      if(typeof req.body.user["excerpt"] != 'undefined'){
        user["excerpt"] = req.body.user["excerpt"];
      }

      if(typeof req.body.user["content"] != 'undefined'){
        user["content"] = req.body.user["content"];
      }

      if(typeof req.body.user["active"] != 'undefined'){
        user["active"] = req.body.user["active"];
      }

      if(typeof req.body.user["created"] != 'undefined'){
        user["created"] = req.body.user["created"];
      }


      return user.save(function (err) {
        if (!err) {
          console.log("updated user");
          return res.json(200, user.toObject());
        } else {
         return res.json(500, err);
        }
        return res.json(user);
      });
    });

  };

  // DELETE
  api.deleteUser = function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
      return user.remove(function (err) {
        if (!err) {
          console.log("removed user");
          return res.send(204);
        } else {
          console.log(err);
          return res.json(500, err);
        }
      });
    });

  };
  app.get('/api/users', api.users);
  app.get('/api/user/:id', api.user);
  app.post('/api/user', api.addUser);
  app.put('/api/user/:id', api.editUser);
  app.delete('/api/user/:id', api.deleteUser);
};
