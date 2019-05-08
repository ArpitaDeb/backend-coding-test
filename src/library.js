/* eslint-disable @typescript-eslint/camelcase */
const VALIDATION_ERROR = 'VALIDATION_ERROR';
const SERVER_ERROR = 'SERVER_ERROR';
const SUCCESS = 'SUCCESS';
const RIDES_ERROR = 'RIDES_NOT_FOUND_ERROR';

function validateRidesInput(values){
    if (values.startLatitude < -90 || values.startLatitude > 90 || values.startLongitude < -180 || values.startLongitude > 180) {
        return {
            error_code: VALIDATION_ERROR,
            message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
        };
    }

    if (values.endLatitude < -90 || values.endLatitude > 90 || values.endLongitude < -180 || values.endLongitude > 180) {
        return {
            error_code: VALIDATION_ERROR,
            message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
        };
    }

    if (typeof values.riderName !== 'string' || values.riderName.length < 1) {
        return {
            error_code: VALIDATION_ERROR,
            message: 'Rider name must be a non empty string'
        };
    }

    if (typeof values.driverName !== 'string' || values.driverName.length < 1) {
        return {
            error_code: VALIDATION_ERROR,
            message: 'Driver name must be a non empty string'
        };
    }

    if (typeof values.driverVehicle !== 'string' || values.driverVehicle.length < 1) {
        return {
            error_code: VALIDATION_ERROR,
            message: 'Driver vehicle name must be a non empty string'
        };
    }

    return {
        error_code: SUCCESS,
        message: ''
    };
}

module.exports = {
    validateRidesInput: validateRidesInput,
    VALIDATION_ERROR: VALIDATION_ERROR,
    SUCCESS: SUCCESS,
    SERVER_ERROR: SERVER_ERROR,
    RIDES_ERROR: RIDES_ERROR
}