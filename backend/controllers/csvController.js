const Computer = require('../models/Computer');
const csv = require('csv-parser');
const fs = require('fs');

exports.uploadCSV = async (req, res) => {
    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', async () => {
            try {
                const inserted = await Computer.insertMany(results);
                res.status(201).json({ inserted });
            } catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
};
