const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const { ensureAuth } = require('../middlewares/authClient');

router.get('/', ensureAuth, homeController.alumni)
// router.get('/:id', ensureAuth, homeController.alumni_profile)


module.exports = router;