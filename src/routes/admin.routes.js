const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController.js');
const {
    ensureAuth,
    forwardAuth,
    roleUserAuth,
    accountAuth 
} = require('../middlewares/authAdmin');

// POST API
router.post('/login', adminController.authenticateLogin, accountAuth);
router.post('/users/:id', ensureAuth, adminController.verify_user);
router.post('/alu/create', ensureAuth, adminController.alumnus_create);
router.post('/alu/update/:id', ensureAuth, adminController.update_alumni);

router.post('/events/create', ensureAuth, adminController.events_create);
router.post('/events/update/:id', ensureAuth, adminController.update_event);

router.post('/jobs/create', ensureAuth, adminController.jobs_create);
router.post('/jobs/update/:id', ensureAuth, adminController.update_job);


// GET API
router.get('/login', forwardAuth, adminController.login);
router.get('/logout', adminController.logout);
router.get('/dashboard', ensureAuth, roleUserAuth, adminController.dashboard);
router.get('/users', ensureAuth, adminController.users);

router.get('/alu', ensureAuth, adminController.alumnus_list);
router.get('/alu/create', ensureAuth, adminController.alumnus_add);
router.get('/alu/:id', ensureAuth, adminController.alumnus_detail);
router.get('/alu/update/:id', ensureAuth, adminController.alumnus_update);

router.get('/events', ensureAuth, adminController.events_list);
router.get('/events/create', ensureAuth, adminController.events_add);
router.get('/events/update/:id', ensureAuth, adminController.events_update);

router.get('/jobs', ensureAuth, adminController.jobs_list);
router.get('/jobs/create', ensureAuth, adminController.jobs_add);
router.get('/jobs/update/:id', ensureAuth, adminController.jobs_update);



// DELETE API
router.delete('/users/delete/:id', ensureAuth, adminController.delete_user);
router.delete('/alu/delete/:id', ensureAuth, adminController.delete_alumni);
router.delete('/events/delete/:id', ensureAuth, adminController.delete_event);
router.delete('/jobs/delete/:id', ensureAuth, adminController.delete_job);

router.get('/', (req, res) => {
    res.redirect('./dashboard');
});

module.exports = router;