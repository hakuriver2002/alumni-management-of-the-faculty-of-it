const { check } = require('express-validator');
const { validationResult, matchedData } = require('express-validator');

let validateSignUp = () => {
    return [
        check('fullname', 'Tên đăng nhập không được để trống.').trim().not().isEmpty(),
        check('email', 'Email không được để trống.').trim().not().isEmpty(),
        check('email', 'Email không hợp lệ.').trim().isEmail(),
        check('password', 'Mật khẩu không được để trống.').trim().not().isEmpty(),
        check('password', 'Mật khẩu phải chứa ít nhất 6 ký tự.').trim().isLength({ min: 6 }),
        check('confirm_password', 'Mật khẩu xác nhận không được để trống.').trim().not().isEmpty(),
        check('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu xác nhận không khớp.');
            }
            return true;
        })
    ];
}

let handleSignUp = (req, res, next) => {
    const data = matchedData(req);
    console.log(data)
    let error = validationResult(req);
    if (!error.isEmpty()) {
        req.flash('warning', error.array()[0].msg);
        return res.render('client/signup', {
            title: 'Signup',
            layout: false,
            email: data.email,
            fullname: data.fullname,
            password: data.password,
            confirm_password: data.confirm_password,
            messageWarning: req.flash('warning'),
        });
    }
    return next();
}


module.exports = {
    validateSignUp,
    handleSignUp
}