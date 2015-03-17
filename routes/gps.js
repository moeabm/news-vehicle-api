var express = require('express');
var router = express.Router();

var gps = require( __dirname + "/../bin/gps_listener.js")



/* GET vehicle last gps. */
router.get('/', function(req, res, next) {
  	gps.resLastCoords(res);
});


/* GET vehicle last gps. */
router.get('/:num', function(req, res, next) {
  	gps.resRecentLocs(res, req.params.num);
});

/* PUT vehicle last gps. */
router.put('/', function(req, res, next) {
	gps.putGPS(req.body.lat,
			 req.body.lon,
			 new Date())
		res.send('rew record Lat: '+ req.body.lat+', Lon: '+ req.body.lon);

});

module.exports = router;
