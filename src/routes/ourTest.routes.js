const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const AxesDimension = require('../models/ourTest/EvaluationAxes');
const PushOurTest = require('../models/ourTest/PushOurTest');
let selected = false;

const getOurTest = (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            if (req.session.busisnessName === '' || req.session.sector === 'Sector empresarial') {
                res.redirect('/')
            } else {
                res.render("layouts/model/index",
                    {
                        url: req.url,
                        title: "Start Test",
                        selected: selected,
                        columnHeader: columnHeader,
                        dimension: AxesDimension.allAxesByDimension,
                        process: AxesDimension.allDimension
                    });
            }
        } catch (e) {
            throw new Error(e.message)
        }2
    } else {
        res.redirect('/')
    }
};
const postOurTest = async (req, res) => {
    const newLink = req.body;
    if (newLink.lenght !== 0) {
        await PushOurTest.pushAskResult(req.session.idbusiness, newLink)
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