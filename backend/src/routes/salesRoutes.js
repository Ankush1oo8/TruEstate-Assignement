const express = require('express');
const { getSales, getSalesOptions } = require('../controllers/salesController');

const router = express.Router();

router.get('/', getSales);
router.get('/options', getSalesOptions);

module.exports = router;
