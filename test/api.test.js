/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
'use strict';

const request = require('supertest');
const assert = require('assert');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const repo = require('../src/repository');
const buildSchemas = require('../src/schemas');
const library = require('../src/library');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    /**
     * Integration empty data set
     */
    describe('GET /rides/:offset/:limit', () => {
        it('should return empty rides in database with pagination', (done) => {
            request(app)
                .get('/rides/0/5')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    /**
     * Unit testing
     */
    describe('Vaidate input request', ()=>{
        it('should return success error code when running the function', (done) => {
            const values = {startLatitude: 90, startLongitude: 90, endLatitude: 180, endLongitude: 180, driverName: "test", riderName: "test", driverVehicle: "test"};
            const result = library.validateRidesInput(values);
            assert(result.error_code, library.SUCCESS);
            done();
        })
    })

    describe('Vaidate input request', ()=>{
        it('should return startLatitude and startLongitude validation error code when running the function', (done) => {
            const values = {startLatitude: -90, startLongitude: 270, endLatitude: 180, endLongitude: 180, driverName: "test", riderName: "test", driverVehicle: "test"};
            const result = library.validateRidesInput(values);
            assert(result.message, 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
            done();
        })
    })

    describe('Vaidate input request', ()=>{
        it('should return endLatitude and endLongitude validation error code when running the function', (done) => {
            const values = {startLatitude: 90, startLongitude: 90, endLatitude: -180, endLongitude: 270, driverName: "test", riderName: "test", driverVehicle: "test"};
            const result = library.validateRidesInput(values);
            assert(result.message, 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
            done();
        })
    })

    describe('Vaidate input request', ()=>{
        it('should return riderName validation error code when running the function', (done) => {
            const values = {startLatitude: 90, startLongitude: 90, endLatitude: 180, endLongitude: 180, driverName: "test", riderName: "", driverVehicle: "test"};
            const result = library.validateRidesInput(values);
            assert(result.message, 'Rider name must be a non empty string');
            done();
        })
    })

    describe('Vaidate input request', ()=>{
        it('should return driverName validation error code when running the function', (done) => {
            const values = {startLatitude: 90, startLongitude: 90, endLatitude: 180, endLongitude: 180, driverName: "", riderName: "test", driverVehicle: "test"};
            const result = library.validateRidesInput(values);
            assert(result.message, 'Driver name must be a non empty string');
            done();
        })
    })

    describe('Vaidate input request', ()=>{
        it('should return driverVehicle validation error code when running the function', (done) => {
            const values = {startLatitude: 90, startLongitude: 90, endLatitude: 180, endLongitude: 180, driverName: "test", riderName: "test", driverVehicle: ""};
            const result = library.validateRidesInput(values);
            assert(result.message, 'Driver vehicle must be a non empty string');
            done();
        })
    })

    describe('Insert rides to database', () => {
        it('should return success when running function', (done) => {
            const values = [90,90,90,90, "sugeng", "driver name 1", "revo 1"];
            const result = new repo(db).insertRides(values).then((data) => {
                assert(data.error_code, library.SUCCESS);
                done();
            }).catch(done);
        });
    });

    describe('Select new added rides from database', () => {
        it('should return success when running function', (done) => {
            const result = new repo(db).selectRidesById(1).then((data) => {
                assert(data.error_code, library.SUCCESS);
                done();
            }).catch(done);
        });
    });

    describe('Select all rides within page', () => {
        it('should return success when running function', (done) => {
            const result = new repo(db).selectRidesPagination(0, 5).then((data) => {
                assert(data.error_code, library.SUCCESS);
                done();
            }).catch(done);
        });
    });

    /**
     * Integration test
     */
    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('POST /rides', () => {
        it('check start langitude value', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat" : -90, "start_long" : 270, "end_lat" : 90, "end_long" : 90, "rider_name" : "", "driver_name" : "driver name", "driver_vehicle" : "driver vehicle"})
                .expect('Content-Type', /json/)
                .expect(403, done);
        });
    });

    describe('POST /rides', () => {
        it('check end latitude value', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat" : 90, "start_long" : 90, "end_lat" : -90, "end_long" : 270, "rider_name" : "", "driver_name" : "driver name", "driver_vehicle" : "driver vehicle"})
                .expect('Content-Type', /json/)
                .expect(403, done);
        });
    });

    describe('POST /rides', () => {
        it('check whether rider name is empty string', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat" : 90, "start_long" : 90, "end_lat" : 90, "end_long" : 90, "rider_name" : "", "driver_name" : "driver name", "driver_vehicle" : "driver vehicle"})
                .expect('Content-Type', /json/)
                .expect(403, done);
        });
    });

    describe('POST /rides', () => {
        it('check whether driver name is empty string', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat" : 90, "start_long" : 90, "end_lat" : 90, "end_long" : 90, "rider_name" : "test name", "driver_name" : "", "driver_vehicle" : "driver vehicle"})
                .expect('Content-Type', /json/)
                .expect(403, done);
        });
    });

    describe('POST /rides', () => {
        it('check whether driver vehicle is empty string', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat" : 90, "start_long" : 90, "end_lat" : 90, "end_long" : 90, "rider_name" : "test name", "driver_name" : "test drive", "driver_vehicle" : ""})
                .expect('Content-Type', /json/)
                .expect(403, done);
        });
    });

    describe('POST /rides', () => {
        it('should add a new rides in database', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat" : 90, "start_long" : 90, "end_lat" : 90, "end_long" : 90, "rider_name" : "test name", "driver_name" : "test drive", "driver_vehicle" : "Motornya driver"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /rides/:offset/:limit', () => {
        it('should return all the rides in database with pagination', (done) => {
            request(app)
                .get('/rides/0/5')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});