const express = require('express');
const router = express.Router();
const { waiting } = require('../app/');

router.get('/', waiting.getAll);
router.get('/:id', waiting.get);
router.post('/', waiting.add);
router.delete('/:id', waiting.remove);
router.put('/', waiting.modify);

module.exports = router;
