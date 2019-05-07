/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const swaggerUI = require('swagger-ui-express'),
    swaggerDocument = require('../swagger.json');

const library = require('./library');
const Promise = require('bluebird');


module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
        try{
            const startLatitude = Number(req.body.start_lat);
            const startLongitude = Number(req.body.start_long);
            const endLatitude = Number(req.body.end_lat);
            const endLongitude = Number(req.body.end_long);
            const riderName = req.body.rider_name;
            const driverName = req.body.driver_name;
            const driverVehicle = req.body.driver_vehicle;

            let ridesRequest = {
                startLatitude : startLatitude, 
                startLongitude : startLongitude, 
                endLatitude : endLatitude, 
                endLongitude : endLongitude, 
                driverName : driverName, 
                riderName : riderName, 
                driverVehicle : driverVehicle
            };

            let validation = library.validateRidesInput(ridesRequest);

            if(validation.error_code == library.SUCCESS){
                let values = [ridesRequest.startLatitude, ridesRequest.startLongitude, ridesRequest.endLatitude, ridesRequest.endLongitude, ridesRequest.riderName, ridesRequest.driverName, ridesRequest.driverVehicle];
                let results = await new Promise(function(resolve, reject){
                    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
                        if (err) {
                            reject({
                                error_code: library.SERVER_ERROR,
                                message: 'Unknown error'
                            });
                        }
                        resolve({lastID: this.lastID});        
                    });
                });
                
                res.send(results);
            }else{
                res.send(validation);
            }
        }catch(e){
            return res.send({
                error_code: library.SERVER_ERROR,
                message: e.message
            });
        }        
    });

    app.get('/rides/:offset/:limit', async (req, res) => {
        try{
            let offset = Number(req.params.offset);
            let limit = Number(req.params.limit);

            await db.all('SELECT startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle FROM Rides ORDER BY rideId ASC LIMIT ? OFFSET ?', [limit, offset], function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                if (rows.length === 0) {
                    return res.send({
                        error_code: 'RIDES_NOT_FOUND_ERROR',
                        message: 'Could not find any rides'
                    });
                }

                return res.send(rows);
            });
        }catch(e){
            res.send({
                error_code: library.SERVER_ERROR,
                message: e.message
            });
        }
    });

    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    return app;
};
