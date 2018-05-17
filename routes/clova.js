const express = require('express');
const cekRequest = require('../app/clova');
const router = express.Router();

router.post('/', cekRequest);

module.exports = router;