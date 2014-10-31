module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Party = mongoose.models.Party,
      api = {};

  // ALL
  api.parties = function (req, res) {
    Party.find(function(err, parties) {
      if (err) {
        res.json(500, err);
      } else {
        res.json({parties: parties});
      }
    });
  };

  // GET
  api.party = function (req, res) {
    var id = req.params.id;
    Party.findOne({ '_id': id }, function(err, party) {
      if (err) {
        res.json(404, err);
      } else {
        res.json(200, {party: party});
      }
    });
  };

  // POST
  api.addParty = function (req, res) {

    var party;

    if(typeof req.body.party == 'undefined'){
      return res.json(500, {message: 'party is undefined'});
    }

    party = new Party(req.body.party);

    party.save(function (err) {
      if (!err) {
        console.log("created party");
        return res.json(201, party.toObject());
      } else {
         return res.json(500, err);
      }
    });

  };

  // PUT
  api.editParty = function (req, res) {
    var id = req.params.id;

    Party.findById(id, function (err, party) {



      if(typeof req.body.party["title"] != 'undefined'){
        party["title"] = req.body.party["title"];
      }

      if(typeof req.body.party["excerpt"] != 'undefined'){
        party["excerpt"] = req.body.party["excerpt"];
      }

      if(typeof req.body.party["content"] != 'undefined'){
        party["content"] = req.body.party["content"];
      }

      if(typeof req.body.party["active"] != 'undefined'){
        party["active"] = req.body.party["active"];
      }

      if(typeof req.body.party["created"] != 'undefined'){
        party["created"] = req.body.party["created"];
      }


      return party.save(function (err) {
        if (!err) {
          console.log("updated party");
          return res.json(200, party.toObject());
        } else {
         return res.json(500, err);
        }
        return res.json(party);
      });
    });

  };

  // DELETE
  api.deleteParty = function (req, res) {
    var id = req.params.id;
    Party.findById(id, function (err, party) {
      return party.remove(function (err) {
        if (!err) {
          console.log("removed party");
          return res.send(204);
        } else {
          console.log(err);
          return res.json(500, err);
        }
      });
    });

  };
  app.get('/api/parties', api.parties);
  app.get('/api/party/:id', api.party);
  app.post('/api/party', api.addParty);
  app.put('/api/party/:id', api.editParty);
  app.delete('/api/party/:id', api.deleteParty);
};
