const express = require('express');
const router = express.Router();

const {
    validateSignUp,
    handleSignUp
} = require('../middlewares/validateForm');
const homeController = require('../controllers/homeController');
const {
    ensureAuth,
    forwardAuth,
    roleUserAuth,
    accountAuth
} = require('../middlewares/authClient');

// POST API
router.post('/login', homeController.authenticateLogin, accountAuth);
router.post('/signup', validateSignUp(), handleSignUp, homeController.regiterNewUser);
router.post('/add-info', ensureAuth, homeController.add_info);
router.post('/profile', ensureAuth, homeController.update_profile)

// GET API
router.get('/login', forwardAuth, homeController.login);
router.get('/signup', forwardAuth, homeController.signup);
router.get('/logout', homeController.logout);
router.get('/home', roleUserAuth, homeController.home);
router.get('/add-info', ensureAuth, homeController.get_info);
router.get('/profile', ensureAuth, homeController.profile)


router.get('/', (req, res) => {
    res.redirect('home');
});

module.exports = router;