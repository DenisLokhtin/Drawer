const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.send('ping!!!');
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;