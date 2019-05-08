/* eslint-disable no-console */
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
const repository = require('./repository');
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
                let results = await new repository(db).insertRides(values).then((data) => {
                    return new repository(db).selectRidesById(data.lastID);
                }).catch((err) => {
                    res.status(500).send(err);
                });
                res.status(200).send(results);
            }else{
                res.status(403).send(validation);
            }
        }catch(e){
            return res.status(500).send({
                error_code: library.SERVER_ERROR,
                message: e.message
            });
        }        
    });

    app.get('/rides/:offset/:limit', async (req, res) => {
        try{
            let offset = Number(req.params.offset);
            let limit = Number(req.params.limit);

            let results = await new repository(db).selectRidesPagination(offset, limit).catch((err) => {
                res.status(500).send(err);
            });

            res.status(200).send(results);
        }catch(e){
            res.status(500).send({
                error_code: library.SERVER_ERROR,
                message: e.message
            });
        }
    });

    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    return app;
};
