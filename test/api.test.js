/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const repo = require('../src/repository');
const buildSchemas = require('../src/schemas');

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
     * Unit testing
     */

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

    describe('GET /rides/:offset/:limit', () => {
        it('should return empty rides in database with pagination', (done) => {
            request(app)
                .get('/rides/0/5')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    // describe('GET /rides/:offset/:limit', () => {
    //     it('should return exception number parsing error in rides', (done) => {
    //         request(app)
    //             .get('/rides/asdsa/asdsad')
    //             .expect('Content-Type', /json/)
    //             .expect(500, done);
    //     });
    // });

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