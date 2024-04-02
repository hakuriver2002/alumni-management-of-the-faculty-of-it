module.exports = (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.messageError = req.flash('error');
    res.locals.messageWarning = req.flash('warning');
    res.locals.messageSuccess = req.flash('success');
    next();
}