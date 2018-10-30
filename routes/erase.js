var express = require('express');
var Weather = require('../weather');
var Location = require('../location');
var router = express.Router();

router.delete('/', (req, res, next) => {
    if((typeof req.query.start != "undefined")&&
            (typeof req.query.end != "undefined")&&
                (typeof req.query.lat != "undefined")&&
                    (typeof req.query.lon != "undefined")){
        Weather.deleteByParameters(req.query.start, 
                                req.query.end, 
                                req.query.lat, 
                                req.query.lon, 
                                (err, result) => {
            if(err){
                res.sendStatus(500).send( {'error' : err});
            }else{
                res.sendStatus(200);
            }
        });                
    }else{

        Weather.deleteAll((err, result) => {
            if(err){
                res.sendStatus(500);
            }else{
                Location.deleteAll((err, result)=>{
                    if(err){
                        res.sendStatus(500);
                    }
                    else{
                        res.sendStatus(200);
                    }
                })
                
            }
        });
    }
});
// Routes related to erase

module.exports = router;
