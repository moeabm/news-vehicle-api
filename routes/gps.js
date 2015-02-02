var express = require('express');
var router = express.Router();

var gps = require("../bin/gps_listener.js")



/* GET vehicle last gps. */
router.get('/', function(req, res, next) {
  	gps.resLastCoords(res);

});

/* PUT vehicle last gps. */
router.put('/', function(req, res, next) {
	// res.json(gps);
		//console.log(req)
		db.run("INSERT INTO vehicle (lat, lon, stamp) VALUES (?, ?, ?)", [
			 req.body.lat,
			 req.body.lon,
			 new Date()
		] );
		res.send('rew record Lat: '+ req.body.lat+', Lon: '+ req.body.lon);

});

module.exports = router;
