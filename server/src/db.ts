import { Client, Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config()
const { timeRange } = require('./consts')



export default class DB {
    client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        })


    }


    async createTables() {
        await this.createBranchesTable();
        await this.createClientsTable();
        await this.createServicesTable();
        await this.createRecordTable();
    }

    // connects to DataBase
    async connect() {

        console.log('conecting...')
        await this.client.connect();
    }

    // Create branches table
    async createBranchesTable() {
        await this.client.query(
            `CREATE TABLE IF NOT EXISTS branches(
                code SERIAL PRIMARY KEY,
                city VARCHAR(10) NOT NULL
            );`
        );
    }

    // Create services table
    async createServicesTable() {
        await this.client.query(
            `CREATE TABLE IF NOT EXISTS services(
                code SERIAL PRIMARY KEY,
                description VARCHAR(50) NOT NULL
            );`
        );
    }

    // Create clients table
    async createClientsTable() {
        await this.client.query(
            `CREATE TABLE IF NOT EXISTS clients(
                id INTEGER PRIMARY KEY,
                name VARCHAR(10) NOT NULL,
                phone_number VARCHAR(10) NOT NULL
            );`
        );
    }

    // Create records table
    async createRecordTable() {
        await this.client.query(
            `CREATE TABLE IF NOT EXISTS records(
                number SERIAL PRIMARY KEY,
                branch_code INTEGER REFERENCES branches(code),
                client_id INTEGER REFERENCES clients(id),
                service_code INTEGER REFERENCES services(code),
                status status default 'pending',
                date Date NOT NULL,
                time Time NOT NULL,
                create_date DATE NOT NULL DEFAULT CURRENT_DATE
            );`
        );
    }

    // insert new service
    async insertNewService(description: string) {
        await this.client.query(
            'INSERT INTO services (description) VALUES ($1)',
            [description]
        );
    }

    // insert new client
    async insertNewClient(id: number, name: string, phoneNumber: string) {
        await this.client.query(
            'INSERT INTO clients (id, name, phone_number) VALUES ($1, $2, $3)',
            [id, name, phoneNumber]
        );
    }

    // insert new branch
    async insertNewBranch(city: string) {
        await this.client.query(
            'INSERT INTO branches (city) VALUES ($1)',
            [city]
        );
    }

    // insert new record
    async insertNewRecord(branch_code: number, service_code: number, client_id: number, date: Date, time: any) {
        console.log(client_id)
        await this.client.query(
            'INSERT INTO records (branch_code, client_id, service_code, date, time) VALUES ($1,$2,$3, $4, $5)',
            [branch_code, client_id, service_code, date, time]
        );
    }

    // return all records from DB
    async getAllRecords() {
        const result = await this.client.query(
            'SELECT number, branches.city, clients.name, clients.phone_number,status, services.description\
             FROM records \
             INNER JOIN branches ON \
             branches.code = records.branch_code \
             INNER JOIN clients ON \
             clients.id = records.client_id \
             INNER JOIN services ON \
             services.code = records.service_code \
             ORDER BY number\
             '
        )

        return result.rows
    }

    // return all services types from DB
    async getAllServices() {
        const result = await this.client.query(
            'SELECT * FROM services'
        );
        return result.rows
    }

    // return branches list from DB
    async getAllBranches() {
        const result = await this.client.query(
            'SELECT * FROM branches'
        );
        return result.rows
    }

    // get client info by id
    async getClientById(id: number) {
        const result = await this.client.query(`SELECT * FROM clients WHERE id = $1 `, [id]);
        return result;
    }

    // get all status options
    async getStatusOptions() {
        const result = await this.client.query('select enum_range(null::status)');
        return result;
    }

    // update recorde status
    async updateRecordStatus(newStatus: string, recordNumber: number) {
        try {
            const result = await this.client.query(`update records set status = $1 where number = $2;`,
                [newStatus, recordNumber]);
            return true
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    // get records between 2 dates
    async getRecordsInRange(d1: string, d2: string) {
        let result;
        try {
            result = await this.client.query(
                'SELECT number,date, branches.city, clients.name, clients.phone_number,status, time ,services.description\
             FROM records \
             INNER JOIN branches ON \
             branches.code = records.branch_code \
             INNER JOIN clients ON \
             clients.id = records.client_id \
             INNER JOIN services ON \
             services.code = records.service_code \
             where date is not NULL \
            and \
            date >= $1 and date<= $2 \
             ORDER BY date\
             '

                , [new Date(d1), new Date(d2)]);

        } catch (error) {
            console.log('err *****', error)
        }
        return result;


    }
    // get records by date
    async getRecordsByDate(d: Date) {
        const result = this.client.query('select * from records where date = $1 ', [d]);
        return result;
    }

    // get all records time in specific day
    async getPossibleMeetingTime(date: Date | string) {
        // get from records table records time in specific date
        const result = await this.client.query(
            'SELECT time FROM records \
            WHERE date = $1 ',
            [date]
        );

        // extract dates from result
        const busyTimeArr = result.rows.map(row => {
            return row.time.slice(0, 5);
        });

        const freeTime: any[] = [];

        // filter range time
        timeRange.forEach((time: any) => {
            const tStr = this.formatTimeObjToStr(time);
            if (!busyTimeArr.includes(tStr))
                freeTime.push(time);
        })

        return freeTime
    }


    // get specific record by date and time
    async getRecordsByDateAndTime(d: string, t: string) {
        const result = this.client.query('select number from records where date = $1 and time = $2 ', [d, t]);
        return result;
    }

    // update record date and time
    async updateRecordDateAndTime(id: number, d: string, t: string) {
        console.log('d : ', new Date(d));
        const result = this.client.query('update records set date = $1::date , time = $2  where number = $3',
            [d, t, id]);
        return result;
    }

    // convert time obj to string
    formatTimeObjToStr(time: any) {
        const h = time.h < 10 ? `0${time.h}` : time.h;
        const m = time.m < 10 ? `0${time.m}` : time.m;
        return `${h}:${m}`;
    }

}
