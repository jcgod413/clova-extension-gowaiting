const express = require('express');
const waiting = require('./waiting');
const clova = require('./clova');
const router = express.Router();
const waitingApp = require('../app/waiting');

router.use('/waiting', waiting);

router.use('/clova', clova);

router.use('/naver_login', (req, res) => {
    res.send(req.query);
});

module.exports = router;
