const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const DBMinTicTest = require('../controller/minTic/DBMinTicTest.controller');

const getTestResults = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty() && req.session.selected) {                
        if (req.session.processSelected === true) {
            console.log(DBMinTicTest.allAskResults)
        }
    }
}