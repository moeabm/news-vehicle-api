var express = require('express');
var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('vehicle.db');
var check;


db.serialize(function() {
	db.run("CREATE TABLE if not exists vehicle (lat DECIMAL, lon DECIMAL, stamp DATETIME )");
})

var gps = {
	current: {
		lat: 32.0383+(Math.random()),
		lon: -117.0384+(Math.random())
	}
}
/* GET vehicle last gps. */
router.get('/', function(req, res, next) {
	// var last_gps =
  //res.render('gps', {  });
	db.get("SELECT lat, lon, stamp FROM vehicle ORDER BY stamp DESC LIMIT 1", [], function(err, row){
		if( typeof row == "undefined"){
			res.send("No location found.")
		}
    	else {
    		console.log(row);
  			res.json(row);
  		}
	})
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
