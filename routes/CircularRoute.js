const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const circularCollection = require('../models/CircularSchema');
const cloudinary = require('../utils/cloudinary')

// Image/PDF storage path
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "../uploads");
    },
    filename: (req, file, callback) => {
        callback(null, `file-${Date.now()}-${file.originalname}`);
    }
});

// File filter for images and PDFs
const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image") || file.mimetype === 'application/pdf') {
        callback(null, true);
    } else {
        callback(new Error("Only images and PDFs are allowed"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Create a new circular
router.post("/create", upload.single("file"), async (req, res) => {
    const { title, description, category } = req.body;
    const { filename } = req.file;

    if (!title || !description || !category || !filename) {
        return res.status(400).json({ status: 400, message: "Fill all the fields" });
    }

    try {
        const circularData = new Circular({
            title,
            description,
            date,
            category,
            imgPdfpath: filename
        });

        const savedCircular = await circularCollection.save();
        res.status(201).json({ status: 201, savedCircular });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
});

// Retrieve all circulars
router.get("/getAll", async (req, res) => {
    try {
        const circulars = await circularCollection.find();
        res.status(200).json({ status: 200, circulars });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
});

// Retrieve a circular by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const circular = await circularCollection.findById(id);

        if (!circular) {
            return res.status(404).json({ status: 404, message: "Circular not found" });
        }

        res.status(200).json({ status: 200, circular });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
});

// Download a file by ID
router.get("/download/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const circular = await circularCollection.findById(id);

        if (!circular) {
            return res.status(404).json({ status: 404, message: "Circular not found" });
        }

        const filePath = path.join(__dirname, '../uploads', circular.imgPdfpath);
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
});

module.exports = router;
