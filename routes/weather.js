var express = require('express');
var router = express.Router();
var Weather = require('../weather');
// Routes related to weather
router.post('/', (req, res, next) => {
    Weather.saveWeather(req.body, (err, result) => {
        if(err) res.status(400).send(err);

        res.status(201).send(result);
    });
});

router.get('/', (req, res, next) => {
    if((typeof req.query.lat != "undefined") && (typeof req.query.lon != "undefined") ){
        Weather.getByLatAndLon(req.query.lat, req.query.lon, (err, rows) => {
            if(err) res.status(400).send(err);
            var finalResult = new Array();
    
            for(var i = 0; i < rows.length; i++){
                var a = {};
                var loc = {};
                //console.log(rows[i].id);
                loc = {
                    'lat': rows[i].lat,
                    'lon': rows[i].lon,
                    'city': rows[i].city,
                    'state': rows[i].state,
                }
    
                a = {
                    'id':  rows[i].id,
                    'date': rows[i].d_date,
                    'location': loc,
                    'temperature': JSON.parse("[" + rows[i].temperature + "]")
                }
                finalResult.push(a);
    
                
            }
            //JSON.stringify(finalResult);
            if(finalResult.length > 0){

                res.status(200).send(finalResult);
            }else{
                res.sendStatus(404);
            }
        });
    }else{
        Weather.getAll((err, rows) => {
            if(err) res.status(400).send(err);
            var finalResult = new Array();
    
            for(var i = 0; i < rows.length; i++){
                var a = {};
                var loc = {};
                loc = {
                    'lat': rows[i].lat,
                    'lon': rows[i].lon,
                    'city': rows[i].city,
                    'state': rows[i].state,
                }
    
                a = {
                    'id':  rows[i].id,
                    'date': rows[i].d_date,
                    'location': loc,
                    'temperature': JSON.parse("[" + rows[i].temperature + "]")
                }
                finalResult.push(a);
    
                
            }
            //JSON.stringify(finalResult);
            res.status(200).send(finalResult);
        });
    }
});

router.get('/temperature', (req, res, next) => {
    if((typeof req.query.start != "undefined") && (typeof req.query.end != "undefined")){
        Weather.getByStartDateAndEndDate(req.query.start, req.query.end, (err, rows) => {
            if(err) res.status(400).send(err);

            var finalResult = new Array();
            
            for(var i = 0; i < rows.length; i++){
                var loc = {};
                //console.log(rows[i].id);
                loc = {
                    'lat': rows[i].lat,
                    'lon': rows[i].lon,
                    'city': rows[i].city,
                    'state': rows[i].state,
                }

                var temp = JSON.parse("[" + rows[i].temperature + "]");
                if(temp.length == 1){
                    loc.message = "There is no weather data in the given date range";
                }else{
                    var highest = 0;
                    var lowest = 0;

                    temp.forEach((e,i) => {
                        if(i == 0){
                            highest = e;
                            lowest = e;
                        }else{
                            if(e > highest){
                                highest = e;
                            }else if(e < lowest){
                                lowest = e;
                            }
                        }
                    });

                    loc.highest = highest;
                    loc.lowest = lowest;

                }
                finalResult.push(loc);
    
                
            }

            res.status(200).send(finalResult);
           
        });
    }
});
module.exports = router;