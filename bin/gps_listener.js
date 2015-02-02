var gpsd = require('node-gpsd');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('vehicle.db');

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
			 tpv["lat"],
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
