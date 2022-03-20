const express = require("express");
const router = express.Router();

const getIndex = (req, res, next) => {
    res.render("index", { title: "MMD Test", });
};
const getTest = (req, res, next) => {
    res.render("layouts/model/carousel", {title: "Start Test", })
};

module.exports = {
    router,
    getIndex,
    getTest,
};