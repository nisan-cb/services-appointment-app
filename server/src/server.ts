import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import DB from './db';


const app: Express = express();
const db = new DB();
const port = process.env.PORT || 4000;

// Create data base connection
db.connect()
    .then(async () => {
        console.log("connected to DB");
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
    console.log(recordNumber, newStatus);
    const result = await db.updateRecordStatus(newStatus, recordNumber);
    console.log(result);

})

// endpoint to insert new record
app.post('/api/insertNewRecord', async (req, res) => {
    console.log(req.body)
    // let service, branch, client_id, client_nmae, phone_number;
    const { service, branch, client_id, client_name, phone_number, date } = req.body
    console.log(date)
    // console.log(req.body)
    try {
        // check if client exist in the system
        const client = await db.getClientById(client_id);
        console.log(client.rowCount);

        // if new client, add him to the system
        if (client.rowCount === 0) // new client
            await db.insertNewClient(client_id, client_name, phone_number)

        // finaly add new record
        await db.insertNewRecord(branch, service, client_id, date);
        res.json({ msg: 'new record inserted' });
    } catch (error) {
        console.log(error);
    }
})

// 
app.get('*', function (req, res) {
    // console.log(path.join(root, 'deploy/client/index.html'))
    console.log("root", root)
    console.log(req.originalUrl)
    res.sendFile(path.join(root, 'client/build/index.html'));
});



app.listen(port, () => {
    console.log('Hosted: http://localhost:' + port);
});
