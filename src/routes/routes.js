const express = require("express");
const router = express.Router();

const getIndex = (req, res, next) => {
    res.render("index", { title: "MMD Test", });
};

module.exports = {
    router,
    getIndex,
};