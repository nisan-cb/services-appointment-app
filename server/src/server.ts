import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import DB from './db';
const { timeRange } = require('./consts')
import Ws from './websocket';

import {
    getAllRecords,
    getRecordsBetween2Dates,
    getServicesTypes,
    getBranchesList,
    getStatusOptions,
    updateRecordStatus,
    insertNewRecord,
    getPossibleTimes,
    updateDateAndTime,
    deleteRecord,
    getClientsList,
    addRecord
} from './controllers';

const app: Express = express();
export const db = new DB();
const port = process.env.PORT || 4000;

// Create data base connection
db.connect()
    .then(async () => {
        console.log("connected to DB");
        await db.createTables()
    })
    .catch((err) => console.log("DB connection failed", err))

app.use(cors());
app.use(json());
const root: string = path.join(process.cwd(), '../');


// Middleware to log the requested URL and send a server error if database is not connected
app.use("*", (req, res, next) => {
    console.log(`${req.method}: ${req.baseUrl}`);
    next();
});


// serve static files
app.use(express.static(path.join(root, '/client/build')));

// endpoint to get all records
app.get('/api/records', getAllRecords);

// endpoint to get all records between 2 dates
app.get('/api/records/:d1/:d2', getRecordsBetween2Dates);

// endpoint to get list of all services
app.get('/api/services', getServicesTypes);

// endpoint to get list of all branches
app.get('/api/branches', getBranchesList);

// endpoint to get list of all clients
app.get('/api/clients', getClientsList);

// endpoint to get all status options
app.get('/api/status-options', getStatusOptions)

// endpoint to update record status
app.put('/api/update-record-status/:recordNumber/:newstatus', updateRecordStatus)

// endpoint to insert new record
app.post('/api/insertNewRecord', insertNewRecord)

// endpoint to insert new record - exist client
app.post('/api/addRecord', addRecord)

// endpoint to get possible meeting time in specific date
app.get('/api/get-possible-meeting-time/:date', getPossibleTimes);

// endpoint to update date and time of record
app.post('/api/update-date-time/:recordNumber', updateDateAndTime)

// endpoint to delete  record
app.delete('/api/delete-record/:recordNumber', deleteRecord)

// default endpoint
app.get('*', function (req, res) {
    res.sendFile(path.join(root, 'client/build/index.html'));
});

// starts listen on port
const server = app.listen(port, () => {
    console.log('Hosted: http://localhost:' + port);
});

export const ws = new Ws(server);
