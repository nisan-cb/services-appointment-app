import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import DB from './db';
const { timeRange } = require('./consts')
import Time from './time';

const app: Express = express();
const db = new DB();
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
app.get('/api/records', async (req, res) => {
    console.log("request for records");
    const allRecords = await db.getAllRecords();
    res.send(allRecords)
});

// endpoint to get all records between 2 dates
app.get('/api/records/:d1/:d2', async (req, res) => {
    console.log("request for records between 2 dates");
    let d1: Date | string = req.params.d1;
    let d2: Date | string = req.params.d2;

    const records = await db.getRecordsInRange(d1, d2);

    const time = Time.arrToDict(timeRange);
    const dict: any = {};
    console.log(d1, ' - ', d2);
    let d = new Date(d1);
    while (d.getTime() <= new Date(d2).getTime()) {
        dict[formatDate(d)] = JSON.parse(JSON.stringify(time));
        d = new Date(d.setDate(d.getDate() + 1));
    }
    // console.log(dict);
    // insert records inside the dict 
    records?.rows.forEach(record => {
        const date = formatDate(record.date);
        const time = record.time.slice(0, 5);
        dict[date][time] = record;
    });
    // console.log(dict)
    // console.log('*****')
    // console.log(result)


    res.send({ dict: dict, timeRange: Time.arrToArr(timeRange) })
});
function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = d.getMonth() < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
    const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();

    return `${year}-${month}-${day}`
}

// endpoint to get list of all services
app.get('/api/services', async (req, res) => {
    console.log("request for services list");
    const allServices = await db.getAllServices();
    res.send(allServices)
});

// endpoint to get list of all branches
app.get('/api/branches', async (req, res) => {
    const branchesList = await db.getAllBranches();
    res.send(branchesList)
});

// endpoint to get all status options
app.get('/api/status-options', async (req, res) => {
    const list = await db.getStatusOptions();
    let obj = list.rows[0].enum_range;
    obj = obj.replace('{', '').replace('}', '').replace('"', '').replace('"', '')
    obj = obj.split(',');
    res.json(obj);
})

// endpoint to update record status
app.put('/api/update-record-status/:recordNumber/:newstatus', async (req, res) => {
    const recordNumber = Number(req.params.recordNumber)
    const newStatus = req.params.newstatus
    const result = await db.updateRecordStatus(newStatus, recordNumber);
})

// endpoint to insert new record
app.post('/api/insertNewRecord', async (req, res) => {
    console.log(req.body)
    // let service, branch, client_id, client_nmae, phone_number;
    const { service, branch, client_id, client_name, phone_number, date, time } = req.body
    console.log(date);
    const t = `${time.h}:${time.m}`;
    try {
        // check if client exist in the system
        const client = await db.getClientById(client_id);

        // if new client, add him to the system
        if (client.rowCount === 0) // new client
            await db.insertNewClient(client_id, client_name, phone_number)
        else
            console.log('client exist in DB');

        // finaly add new record
        await db.insertNewRecord(branch, service, client_id, date, t);
        res.json({ msg: 'new record inserted' });
    } catch (error) {
        console.log(error);
    }
})



// endpoint to get possible meeting time in date
app.get('/api/get-possible-meeting-time/:date', async (req, res) => {
    const date = req.params.date
    const result = await db.getPossibleMeetingTime(date);
    res.send(result);
});

// endpoint to update date and time of record
app.post('/api/update-date-time/:recordNumber', async (req, res) => {
    const recordNumber = Number(req.params.recordNumber);
    const destDate = req.body.destDate
    const destTime = req.body.destTime
    // first check in DB if not exist record in same date and time
    const check = await db.getRecordsByDateAndTime(destDate, destTime);
    if (check.rowCount)
        res.send({ msg: 'update failed' });
    // then update the record by new dest-date and dest-time
    try {
        const result = await db.updateRecordDateAndTime(recordNumber, destDate, destTime);
        // console.log(result)
    } catch (error) {
        console.log('error', error);
        res.send({ msg: 'update failed' })
    }
    res.send({ msg: 'update completed' });

})



// 
app.get('*', function (req, res) {
    // console.log(path.join(root, 'deploy/client/index.html'))
    // console.log("root", root)
    // console.log(req.originalUrl)
    res.sendFile(path.join(root, 'client/build/index.html'));
});




app.listen(port, () => {
    console.log('Hosted: http://localhost:' + port);
});
