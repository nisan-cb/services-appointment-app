import express, { Request, Response } from "express";
import Time from "./time";
import MyDate from "./date";
import { db } from './server'
import { timeRange } from "./consts";
import { ws } from "./server";



// get all records from DB
export const getAllRecords = async (req: Request, res: Response) => {
    console.log("request for records");
    const allRecords = await db.getAllRecords();
    res.send(allRecords)
}


// get all records between 2 dates
export const getRecordsBetween2Dates = async (req: Request, res: Response) => {
    console.log("request for records between 2 dates");
    let d1: string = req.params.d1;
    let d2: string = req.params.d2;

    const records = await db.getRecordsInRange(d1, d2);

    const time = Time.arrToDict(timeRange);
    const dict: any = {};
    let d = new Date(d1);

    while (d.getTime() <= new Date(d2).getTime()) {
        dict[MyDate.DateToString(d)] = JSON.parse(JSON.stringify(time));
        d = new Date(d.setDate(d.getDate() + 1));
    }
    records?.rows.forEach(record => {
        const date = MyDate.DateToString(record.date);
        record.date = date;
        record.time = record.time.slice(0, 5);
        dict[date][record.time] = record;
    });
    // console.log(dict)


    res.send({ dict: dict, timeRange: Time.arrToArr(timeRange) })
}

// returns list of all services types
export const getServicesTypes = async (req: Request, res: Response) => {
    console.log("request for services list");
    const allServices = await db.getAllServices();
    res.send(allServices)
}

// returns list of branches
export const getBranchesList = async (req: Request, res: Response) => {
    const branchesList = await db.getAllBranches();
    res.send(branchesList)
}

// returns list of all clients
export const getClientsList = async (req: Request, res: Response) => {
    const branchesList = await db.getAllclients();
    res.send(branchesList)
}

// returns list of status options
export const getStatusOptions = async (req: Request, res: Response) => {
    const list = await db.getStatusOptions();
    let obj = list.rows[0].enum_range;
    obj = obj.replace('{', '').replace('}', '').replace('"', '').replace('"', '')
    obj = obj.split(',');
    res.json(obj);
}

// updates record status
export const updateRecordStatus = async (req: Request, res: Response) => {
    const recordNumber = Number(req.params.recordNumber)
    const newStatus = req.params.newstatus
    const result = await db.updateRecordStatus(newStatus, recordNumber);
    res.send({ msg: result });
}

// add record for existing client
export const addRecord = async (req: Request, res: Response) => {
    console.log(req.body)
    const { id, service, branch, date, time } = req.body;
    try {
        await db.insertNewRecord(branch, service, id, date, time);
        res.json({ msg: 'new record inserted' });
    } catch (error) {
        console.log(error)
    }
}

// inserts new record to DB
export const insertNewRecord = async (req: Request, res: Response) => {
    console.log(req.body)
    // let service, branch, client_id, client_nmae, phone_number;
    const { service, branch, id, name, phoneNumber, date, time } = req.body
    // console.log(date);
    const t = `${time.h}:${time.m}`;
    try {
        // check if client exist in the system
        const client = await db.getClientById(id);

        // if new client, add him to the system
        if (client.rowCount === 0) // new client
            await db.insertNewClient(id, name, phoneNumber)
        else
            console.log('client exist in DB');

        // finaly add new record
        const recordNumber = await db.insertNewRecord(branch, service, id, date, t);
        if (recordNumber) {
            let recordObj = await db.getRecordDataByNumber(recordNumber);
            // format date and time
            recordObj = {
                ...recordObj,
                'date': MyDate.DateToString(recordObj.date),
                time: recordObj.time.slice(0, 5)
            }
            // send by socket the new record
            ws.sendNewREcord(recordObj);
            // send message to client 
            res.json({ msg: 'new record inserted' });
        }
    } catch (error) {
        console.log(error);
    }
}

// return possible times in specific date
export const getPossibleTimes = async (req: Request, res: Response) => {
    const date = req.params.date
    const result = await db.getPossibleMeetingTime(date);
    res.send(result);
}

// updates record date and time
export const updateDateAndTime = async (req: Request, res: Response) => {
    const recordNumber = Number(req.params.recordNumber);
    const destDate = req.body.destDate
    const destTime = req.body.destTime
    // first check in DB if not exist record in same date and time
    const check = await db.getRecordsByDateAndTime(destDate, destTime);
    if (check.rowCount)
        res.send({ msg: false });
    // then update the record by new dest-date and dest-time
    try {
        const result = await db.updateRecordDateAndTime(recordNumber, destDate, destTime);
        // console.log(result)
    } catch (error) {

        console.log('error', error);
        res.send({ msg: 'update failed' })
    }
    res.send({ msg: true });
}

//  delete record controller
export const deleteRecord = async (req: Request, res: Response) => {
    const recordNumber = Number(req.params.recordNumber);

    try {
        const result = await db.deleteRecord(recordNumber);
        if (result.rowCount)
            res.send({ msg: true });

    } catch (error) {
        console.log(error)
        res.send({ msg: false });
    }


}
