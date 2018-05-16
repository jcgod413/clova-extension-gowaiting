const express = require('express');
const waiting = require('./waiting');
const router = express.Router();

router.use('/waiting', waiting);


router.use('/naver_login', (req, res) => {  
    res.send(req.query);
});

module.exports = router;
