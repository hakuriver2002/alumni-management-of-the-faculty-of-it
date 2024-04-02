const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Job = require('../models/job.model');
const bcrypt = require('bcrypt');

class HomeController {
    login(req, res, next) {
        const currentEmail = req.session.currentEmail;
        const currentPassword = req.session.currentPassword;

        res.render('client/login', {
            title: 'Đăng nhập',
            layout: false,
            currentEmail: currentEmail,
            currentPassword: currentPassword
        });
    }

    authenticateLogin(req, res, next) {
        req.session.currentEmail = req.body.email;
        req.session.currentPassword = req.body.password;

        passport.authenticate('local', {
            failureRedirect: 'login?error',
            failureFlash: true,
        })(req, res, next);
    }

    signup(req, res, next) {
        res.render('client/signup', {
            title: 'Đăng ký tài khoản',
            layout: false,
        });
    }

    logout(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.flash('success', 'Đăng xuất tài khoản thành công!');
            res.redirect('./home');
        });
    }

    async home(req, res, next) {
        await Event.find().exec()
            .then(events => {
                res.render('client/home', {
                    title: 'Home Page',
                    layout: 'client-side',
                    user: req.user,
                    events: events
                });
            });
    }

    // Register New Account
    async regiterNewUser(req, res, next) {
        const fullname = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;

        const existEmail = await User.findOne({ email: email }).exec();
        if (existEmail) {
            req.flash('warning', 'Email đã tồn tại.');
            return res.render('client/signup', {
                title: 'Signup',
                layout: false,
                fullname: fullname,
                email: email,
                password: password,
                confirm_password: confirm_password,
                messageWarning: req.flash('warning')
            });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(password, salt);

        // Create new account
        const user = new User({
            fullname: fullname,
            email: email,
            password: encryptPassword,
            avatar_url: 'default-user.jpg',
            account_verify: false,
            new_account: true,
            role: 'client'
        });

        // Save account
        try {
            await user.save();
            req.flash('success', 'Đăng ký tài khoản thành công!');
            res.redirect('./login');
        } catch (err) {
            req.flash('error', err.message);
            res.redirect('./signup');
        }
    }

    // Add infor page
    get_info(req, res, next) {
        const currentFullname = req.session.currentFullname;
        const currentEmail = req.session.currentEmail;
        const currentPassword = req.session.currentPassword;
        const currentConfPassword = req.session.currentConfPassword;

        res.render('client/add-infor', {
            title: 'Thêm thông tin tài khoản',
            layout: false,
            fullname: currentFullname,
            fullname: currentEmail,
            password: currentPassword,
            confirm_password: currentConfPassword,
        })
    }

    async add_info(req, res, next) {
        const email = req.body.email;
        const filter = { email: email };
        req.body.new_account = false;

        await User.findOneAndUpdate(filter, req.body, { new: true }).exec()
            .then(user => {
                if (!user) {
                    throw new Error('Tài khoản không tồn tại!');
                }
                req.flash('success', 'Cập nhật thông tin tài khoản thành công!');
                res.redirect('./home');
            })
            .catch(err => {
                req.flash('error', 'Cập nhật thông tin tài khoản thất bại! Lỗi' + err.message);
                res.redirect('./add-info');
            });
    }


    // Jobs list
    async jobs(req, res, next) {
        await Job.find().exec()
            .then(jobs => {
                res.render('client/job-list', {
                    title: 'Tuyển dụng việc làm',
                    layout: false,
                    user: req.user,
                    jobs: jobs
                });
            });
    }
    async jobs_detail(req, res, next) {
        const _id = req.params.id;
        console.log(_id)
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        await Job.findById(filter).exec()
            .then(job => {
                if (!job) {
                    throw new Error('Bài đăng không tồn tại!');
                }
                res.render('client/detail-job', {
                    title: 'Chi tiết bài đăng',
                    layout: false,
                    job: job
                })
            })
            .catch(err => {
                console.log(err);
                next(err);
            });
        
    }

    // Profile page
    async profile(req, res, next) {
        try {
            const userID = req.user._id;
            const user = await User.findOne({ _id: userID });
            if (!user) {
                return res.status(404).json({ error: "Tài khoản không tồn tại" });
            }
            res.render('client/profile', {
                title: 'Thông tin cá nhân',
                layout: false,
                user: req.user
            });
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }

    async update_profile(req, res, next) {
        const userID = req.user._id;
        const filter = { _id: new mongoose.Types.ObjectId(userID) };

        await User.findOneAndUpdate(filter, req.body, { new: true }).exec()
            .then(user => {
                if (!user) {
                    throw new Error('Tài khoản không tồn tại!');
                }
                req.flash('success', 'Cập nhật thông tin tài khoản thành công!');
                res.redirect('/api/profile');
            })
            .catch(err => {
                req.flash('error', 'Cập nhật thông tin tài khoản thất bại! Lỗi ' + err.message);
                res.redirect('/api/profile');
            });
    }

    // Events list
    async events_detail(req, res, next) {
        const _id = req.params.id;
        console.log(_id)
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        await Event.findById(filter).exec()
            .then(event => {
                if (!event) {
                    throw new Error('Sự kiện không tồn tại!');
                }
                res.render('client/detail-event', {
                    title: 'Thông tin Sự kiện',
                    layout: false,
                    event: event
                });
            })
            .catch(err => {
                console.log(err);
                next(err);
            });
    }

    // Alumnus list
    async alumni(req, res, next) {
        await User.find({ role: 'client', account_verify: true }).exec()
            .then(alumnus => {
                res.render('client/alumni-list', {
                    title: 'Danh sách cựu sinh viên',
                    layout: 'admin-side',
                    alumnus: alumnus
                });
            });
    }
    async alumni_profile(req, res, next) {
        try {
            const _id = req.params.id;
            const filter = {_id: new mongoose.Types.ObjectId(_id)};

            await User.findById(filter).exec()
            .then(user => {
                if(!user) {
                    throw new Error('Tài khoản không tồn tại!');
                }
                res.render('client/alumni-profile', {
                    title: 'Chi tiết cựu sinh viên',
                    layout: false,
                    user: user
                })
            })
        } catch (err) {
            console.log(err);
                next(err);
        } 
    }


}

module.exports = new HomeController();