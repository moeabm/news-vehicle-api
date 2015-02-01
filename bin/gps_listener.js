var gpsd = require('node-gpsd');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('vehicle.db');

var daemon = new gpsd.Daemon({
        program: 'gpsd',
        device: '/dev/ttyUSB0',
        verbose: true
});

daemon.start(function() {
    var listener = new gpsd.Listener();
    
    listener.on('TPV', function (tpv) {
        console.log(tpv);
        //TODO add sql insert command
    });
    
    listener.connect(function() {
        listener.watch();
    });
});