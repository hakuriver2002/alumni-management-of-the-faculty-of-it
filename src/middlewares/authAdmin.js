// Check user already login
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/api/admin/login');
}

// Check if user not logged in
const forwardAuth = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return next();
    }
    res.redirect('dashboard');
}

// User role client can't login dashboard
const roleUserAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role !== 'admin') {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/api/admin/dashboard');
        });
    } else {
        return next();
    }
}

const accountAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        req.flash('success', 'Đăng nhập tài khoản thành công!');
        res.redirect('dashboard');
    } else {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.session.currentEmail = req.body.email;
            req.session.currentPassword = req.body.password;
            
            req.flash('error', 'Sai tên đăng nhập hoặc mật khẩu.');
            res.redirect('login');
        });
    }
}

module.exports = {
    ensureAuth,
    forwardAuth,
    roleUserAuth,
    accountAuth
};