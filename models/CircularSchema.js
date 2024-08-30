const mongoose = require("mongoose");

const circularSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    imgPdfpath: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("circularObject",circularSchema);