var os = require('os');
var gpsd = require('node-gpsd');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('vehicle.db');
var gps_interval = 10000 // miliseconds
var next_entry_time = new Date(0)
var DAY = 1000 * 60 * 60 * 24

db.serialize(function() {
    db.run("CREATE TABLE if not exists vehicle (lat DECIMAL, lon DECIMAL, stamp DATETIME )");
    db.run("CREATE INDEX if not exists idx1 on vehicle(stamp)");
})

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
            var now = new Date();
            //console.log(tpv);
            //console.log("got data");
        	if(tpv["mode"] > 1 && next_entry_time < now.getTime() ){
        		db.run("INSERT INTO vehicle (lat, lon, stamp) VALUES (?, ?, ?)", [
        			 tpv["lat"],
        			 tpv["lon"],
        			 new Date()
        		] );
                console.log("GPS collected");
                next_entry_time = new Date(now.getTime() + gps_interval) 
        	}
            else 
            {
                console.log ("next: " + next_entry_time +"\ncurrent: " + new Date() )
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

setInterval( clearOldGps, DAY );

function clearOldGps(){
    stmt = "DELETE FROM vehicle WHERE stamp < " + (new Date() - (7 * DAY)) ;
    console.log("clearing GPS: " + stmt)
    db.run(stmt);
}

clearOldGps();