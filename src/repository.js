/* eslint-disable no-console */
/* eslint-disable no-unused-labels */
'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
const library = require('./library');

const promisify = require('util');

class DataRepository{
    
    constructor(dbPath){
        this.db = dbPath;   
    }

    insertRides(values) {
        this.db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return {
                    error_code: library.SERVER_ERROR,
                    message: 'Unknown error'
                };
            }

            return {lastID: this.lastID};
        });
    }

    selectRidesById(id){
        this.db.all('SELECT * FROM Rides WHERE rideID = ?', id, function (err, rows) {
            if (err) {
                return {
                    error_code: library.SERVER_ERROR,
                    message: 'Unknown error'
                };
            }

            return rows;
        });
    }
}

module.exports = (db) =>  {
    DataRepository: DataRepository(db)
}