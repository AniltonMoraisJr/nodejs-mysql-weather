var connection = require('./connection.js');
var Location = require('./location');
var Weather = {
    deleteAll: (callback) => {
        return connection.query("DELETE FROM weather", callback);
    },
    deleteByParameters: (start_date, end_date, lat, long, callback) => {
        return connection.query("DELETE w  FROM weather AS w " +
                                " INNER JOIN location AS l ON w.location_id = l.id " +
                                " WHERE w.d_date BETWEEN ? AND ? AND l.lat = ? AND l.lon = ? ", 
                        [start_date, end_date, lat, long], callback
        );
    },
    saveWeather: (weather, callback) => {
        Location.saveLocation(weather.location, (err, result) => {
            if(!err){
                return connection.query("INSERT INTO weather (id, d_date, location_id, temperature) VALUES (?,?,?,?)", [
                    weather.id,
                    weather.date,
                    result.insertId,
                    weather.temperature.toString()
                ], callback);
            }else{
                console.log(err);
            }
        });
    },
    getAll: (callback) => {
        return connection.query("SELECT w.id, CAST(DATE_FORMAT(w.d_date, '%Y-%m-%d') AS CHAR) AS d_date, w.temperature, l.lat, l.lon, l.city, l.state FROM weather AS w " +
                            " INNER JOIN location AS l ON w.location_id = l.id "
                            + "ORDER BY w.id ASC", callback);
    },

    getByLatAndLon: (lat, lon, callback) => {
        return connection.query("SELECT w.id, CAST(DATE_FORMAT(w.d_date, '%Y-%m-%d') AS CHAR) AS d_date, w.temperature, l.lat, l.lon, l.city, l.state FROM weather AS w " +
                            " INNER JOIN location AS l ON w.location_id = l.id "
                            + " WHERE l.lat = ? AND l.lon = ? "
                            + "ORDER BY w.id ASC", [lat, lon], callback);
    },

    getByStartDateAndEndDate: (startDate, endDate, callback ) => {
        return connection.query("SELECT l.lat, l.lon, l.city, l.state, w.temperature FROM location AS l"+
            " LEFT OUTER JOIN weather AS w ON (w.location_id = l.id)"+
            " AND (w.d_date between ? AND ?)"+
            " ORDER BY l.city, l.state ASC", [startDate, endDate], callback);
    }
}

module.exports = Weather;