var connection = require('./connection');

var Location = {
    saveLocation: (location, callback) => {
        connection.query('INSERT INTO location (lat, lon, city, state) VALUES (?,?,?,?)',[ 
        location.lat,
        location.lon,
        location.city,
        location.state], callback);
    },
    deleteAll: (callback) => {
        return connection.query("DELETE FROM location", callback);
    },
}

module.exports = Location;