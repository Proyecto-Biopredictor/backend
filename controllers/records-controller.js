const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Factor = require("../models/Factor");
const Record = require("../models/Record");

const HttpError = require("../models/http-error");
const Bioprocess = require("../models/Bioprocess");
const Place = require("../models/Place");

const ObjectId = require('mongodb').ObjectId;

// Create a Place
const createRecord = async (req, res, next) => {

    const { bioprocessID, placeID, values } = req.body;

    const createdRecord = new Record({
        bioprocessID,
        placeID,
        values
    });

    let recordsToCreate = [];

    values.forEach(arrayitem => {

        arrayitem.bioprocessID = bioprocessID;
        arrayitem.placeID = placeID;
        recordsToCreate.push(arrayitem);

    });

    console.log(recordsToCreate);


    let bioprocess;
    try {
        bioprocess = await Bioprocess.findById(bioprocessID, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            "Could not fetch bioprocess, please try again.",
            500
        );
        return next(error);
    }

    if (!bioprocess) {
        const error = new HttpError(
            "Could not find bioprocess for provided id.",
            404
        );
        return next(error);
    }

    let place;
    try {
        place = await Place.findById(placeID, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            "Could not fetch place, please try again.",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Could not find place for provided id.", 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        Record.insertMany(recordsToCreate);
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Creating Record failed, please try again.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(201).json({ Records: createdRecord });

};

const getRecordsFromBioXPlace = async (req, res, next) => {
    const bioprocessId = req.params.bid;
    const placeId = req.params.pid;


    try {
        await Bioprocess.findById(bioprocessId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch bioprocess.',
            500
        );
        return next(error);
    }

    try {
        await Place.findById(placeId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch places.',
            500
        );
        return next(error);
    }

    try {
        records = await Record.find({
            bioprocessID: new ObjectId(bioprocessId),
            placeID: new ObjectId(placeId)
        });
    } catch (err) {
        const error = new HttpError(
            'Fetching records failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({
        records: records.map(record =>
            record.toObject({ getters: true })
        )
    });
};

const deleteRecord = async (req, res, next) => {
    const recordId = req.params.rid;

    let record;
    try {
        record = await Record.findById(recordId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find place.',
            500
        );
        return next(error);
    }
    console.log(record);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await record.remove({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete record.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted record.' });
}

const updateRecord = async (req, res, next) => {

    const {timestamp, values} = req.body;
    const recordId = req.params.rid;

    let record;
    try {
        record = await Record.findById(recordId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update record.',
            500
        );
        return next(error);
    }

    record.timestamp = timestamp;
    record.values = values;

    try {
        await record.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update record.',
            500
        );
        return next(error);
    }

    res.status(200).json({ record: record.toObject({ getters: true }) });
};

const getNumRecordsFromBioXPlace = async (req, res, next) => {
    const bioprocessId = req.params.bid;
    const placeId = req.params.pid;


    try {
        await Bioprocess.findById(bioprocessId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch bioprocess.',
            500
        );
        return next(error);
    }

    try {
        await Place.findById(placeId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch places.',
            500
        );
        return next(error);
    }

    let factors;
    try {
        factors = await Factor.find({
            "bioprocessID": new ObjectId(bioprocessId),
            "type": "value"
        }, "name"); //"name" or {"name": 1}
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch bioprocess.',
            500
        );
        return next(error);
    }

    let records;
    try {
        records = await Record.find({
            bioprocessID: new ObjectId(bioprocessId),
            placeID: new ObjectId(placeId)
        });
    } catch (err) {
        const error = new HttpError(
            'Fetching records failed, please try again later.',
            500
        );
        return next(error);
    }

    let data = {};
    const forEachLoop1 = async _ => {
        for (let index = 0; index < factors.length; index++) {
            data[factors[index].name] = [];
        }
    };

    await forEachLoop1();

    const forEachLoop2 = async _ => {
        for (let index = 0; index < records.length; index++) {
            for (let index2 = 0; index2 < factors.length; index2++) {
                let factor = factors[index2].name;
                let value = records[index].values[0][factor];
                if(value !== ""){
                    data[factor].push(value);
                }
            }
        }
    };

    await forEachLoop2();

    res.json(data);
};

exports.createRecord = createRecord;
exports.getRecordsFromBioXPlace = getRecordsFromBioXPlace;
exports.deleteRecord = deleteRecord;
exports.updateRecord = updateRecord;
exports.getNumRecordsFromBioXPlace = getNumRecordsFromBioXPlace;