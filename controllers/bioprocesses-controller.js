const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Bioprocess = require("../models/Bioprocess");
// Create a Bioprocess

const createBioprocess = async (req, res, next) => {
    const { name, description, isTimeSeries, predictionID } = req.body;

    try {
        const createdBioprocess = await Bioprocess.create({
            name,
            description,
            isTimeSeries,
            predictionID,
        });

        sendToken(createdBioprocess, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.createBioprocess = createBioprocess;
