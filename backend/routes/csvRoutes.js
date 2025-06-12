const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadCSV } = require('../controllers/csvController');

const upload = multer({ dest: 'uploads/' });

router.post('/import', async (req, res) => {
    try {
        await Computer.insertMany(req.body.rows)
        res.status(200).json({ message: 'Import erfolgreich' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Fehler beim Import' })
    }
})


module.exports = router;
