const express = require('express');
const adminRouter = require('./admin.routes');
const homeRouter = require('./home.routes');
const alumniRouter = require('./alumni.routes');
const jobRouter = require('./job.routes');
const eventRouter = require('./event.routes');
// const profileRouter = require('./profile.routes');

function route(app) {
    app.use('/api/admin', adminRouter);
    app.use('/api/alum', alumniRouter);
    app.use('/api/jobs', jobRouter);
    app.use('/api/events', eventRouter);
    app.use('/api', homeRouter);
}

module.exports = route;