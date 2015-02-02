var os = require('os');
var gpsd = require('node-gpsd');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('vehicle.db');

db.serialize(function() {
    db.run("CREATE TABLE if not exists vehicle (lat DECIMAL, lon DECIMAL, stamp DATETIME )");
})

console.log(os.type())
var isWin = (os.type() == "Windows_NT");
if(!isWin){
    var daemon = new gpsd.Daemon({
            program: 'gpsd',
            device: '/dev/ttyUSB0',
    });

    daemon.start(function() {
        var listener = new gpsd.Listener({
    	parse: true
        });
        listener.logger = console;
        console.log("gps listening");
        
        listener.on('TPV', function (tpv) {
            //console.log(tpv);
            //console.log("got data");
            //TODO add sql insert command
    	if(tpv["mode"] > 1){
    		db.run("INSERT INTO vehicle (lat, lon, stamp) VALUES (?, ?, ?)", [
    			 tpv["lat"],
    			 tpv["lon"],
    			 new Date()
    		] );
    	}
        });
        
        listener.connect(function() {
        	console.log('Connected');
            listener.watch({ class: 'WATCH', json: true, nmea: false });
        });

       // if parse is false, so raw data get emitted.
       listener.on('raw', function(data) {
    	console.log(data);
       });

    });
}

exports.resLastCoords = function ( res ){
    db.get("SELECT lat, lon, stamp FROM vehicle ORDER BY stamp DESC LIMIT 1", [], function(err, row){
        if( typeof row == "undefined"){
            res.json( "No location found.");
        }
        else {
            res.json(row);
        }
    })
}
// module.exports = daemon;