import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config()


export default class DB {
    client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        })

        this.createTables();

    }


    async createTables() {
        await this.createBranchesTable();
        await this.createClientsTable();
        await this.createServicesTable();
        await this.createRecordTable();
    }

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
                date Date,
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
        console.log(name);
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
    async insertNewRecord(branch_code: number, service_code: number, client_id: number, date: Date) {
        console.log(date)
        await this.client.query(
            'INSERT INTO records (branch_code, client_id, service_code, date) VALUES ($1,$2,$3, $4)',
            [branch_code, client_id, service_code, date]
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
        // .catch(err => console.log(err))
        // console.log(result.rows)
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
            console.log(result)
            return true
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    // get records between 2 dates
    async getRecordsInRange(d1: string, d2: string) {
        console.log('Hello from db');
        console.log(d1, ' - ', d2);
        let result;
        try {
            result = await this.client.query(
                'SELECT number,date, branches.city, clients.name, clients.phone_number,status, services.description\
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

}
