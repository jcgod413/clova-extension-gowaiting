const express = require('express');
const waiting = require('./waiting');
const router = express.Router();

router.use('/waiting', waiting);

router.use('/clova', (req, res) => {
    console.log('/clova');
   // console.dir(req);
    res.send(req.body.request);
});

router.use('/naver_login', (req, res) => {  
    res.send(req.query);
});

module.exports = router;
