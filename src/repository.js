/* eslint-disable no-console */
/* eslint-disable no-unused-labels */
'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
const library = require('./library');

class DataRepository{
    
    constructor(db){
        this.db = db;   
    }

    insertRides(values) {
        const connection = this.db;
        return new Promise(function(resolve, reject){
            connection.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
                if (err) {
                    reject({
                        error_code: library.SERVER_ERROR,
                        message: 'Unknown error'
                    });
                }
                resolve({error_code: library.SUCCESS, message: 'success', data: this.lastID});        
            });
        });
    }

    selectRidesById(id){
        const connection = this.db;
        return new Promise(function(resolve, reject){
            connection.all('SELECT * FROM Rides WHERE rideID = ?', id, function (err, rows) {
                if (err) {
                    reject({
                        error_code: library.SERVER_ERROR,
                        message: 'Unknown error'
                    });
                }
    
                return resolve({error_code: library.SUCCESS, message: 'success', data: rows});
            });
        });
    }

    selectRidesPagination(offset, limit){
        const connection = this.db;
        return new Promise(function(resolve, reject){
            connection.all('SELECT startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle FROM Rides ORDER BY rideId ASC LIMIT ? OFFSET ?', [limit, offset], function (err, rows) {
                if (err) {
                    reject({
                        error_code: library.SERVER_ERROR,
                        message: 'Unknown error'
                    });
                }
    
                if (rows.length === 0) {
                    reject({
                        error_code: library.RIDES_ERROR,
                        message: 'Could not find any rides'
                    });
                }
    
                return resolve({error_code: library.SUCCESS, message: 'success', data: rows});
            });
        });
        
    }
}

module.exports =  DataRepository;