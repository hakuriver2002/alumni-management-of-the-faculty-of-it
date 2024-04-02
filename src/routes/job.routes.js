const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const { ensureAuth } = require('../middlewares/authClient');

router.get('/', ensureAuth, homeController.jobs)
router.get('/:id', ensureAuth, homeController.jobs_detail)


module.exports = router;