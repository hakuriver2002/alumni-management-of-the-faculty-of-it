const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const { ensureAuth } = require('../middlewares/authClient');

router.get('/:id', ensureAuth, homeController.events_detail)

module.exports = router;