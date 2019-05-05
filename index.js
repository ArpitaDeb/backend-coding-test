'use strict';

const express = require('express');
// eslint-disable-next-line no-unused-vars
const app = express();
const port = 80;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);

    // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});