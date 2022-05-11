const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const AxesDimension = require('../models/ourTest/EvaluationAxes');
const PushOurTest = require('../models/ourTest/PushOurTest');

const getOurTest = (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty() && req.session.selected) {
        try {            
            res.render("layouts/model/index",
                {
                    url: req.url,
                    title: "Start Test",
                    columnHeader: columnHeader,
                    dimension: AxesDimension.allAxesByDimension,
                    process: AxesDimension.allDimension
                });
        } catch (e) {
            throw new Error(e.message)
        }
    } else {
        res.redirect('/')
    }
};
const postOurTest = async (req, res) => {
    if (req.body.lenght !== 0) {
        await PushOurTest.pushAskResult(req.session.idbusiness, req.body)
        res.status(200).redirect('/PrevTest')
    }
};

const updateOurTest = (req, res) => {

}


module.exports = {
    router,
    getOurTest,
    postOurTest,
};