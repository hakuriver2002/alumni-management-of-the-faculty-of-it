// Check user already login
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'client') {
        return next();
    } else {
        res.redirect('/api/login');
    }
}

// Check if user not logged in
const forwardAuth = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'client') {
        return next();
    } 
    
    if (req.isAuthenticated() && req.user.new_account === true) {
        req.logout(function (err) {
            if (err) { return next(err); }
            return next();
        });
    }
    res.redirect('/api/home');
}

// Check role user
const roleUserAuth = (req, res, next) => {  
    // If account admin login
    if (req.isAuthenticated() && req.user.role !== 'client') {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/api/home');
        });
    }
    // If login first time 
    if (req.isAuthenticated() && req.user.new_account === true) {
        res.redirect('/api/add-info');
    }
    return next();
}


const accountAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'client') {
        req.flash('success', 'Đăng nhập tài khoản thành công!');
        res.redirect('home');
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