const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const slugify = require('slugify');


// Model
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Job = require('../models/job.model');

//Configuration for Multer
const multerStorageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/avatar');
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar-' + req.params.id + '.' + file.originalname.split('.').pop());
    },
});

const multerStorageEvent = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/event');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


// Multer Filter
const multerFilter = (req, file, cb) => {
    let extension = file.originalname.split('.').pop();
    // Get only file image
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
        cb(null, true);
    } else {
        cb(new Error('File không đúng định dạng'), false);
    }
};

// Upload file
const uploadAvatar = multer({
    storage: multerStorageAvatar,
    limits: { fileSize: 5 * 1024 * 1024 }, // save maximum size 5MB
    fileFilter: multerFilter
});

const uploadEvent = multer({
    storage: multerStorageEvent,
    limits: { fileSize: 5 * 1024 * 1024 }, // save maximum size 5MB
    fileFilter: multerFilter
});


class AdminController {

    // Đăng nhập, đăng xuất tài khoản
    login(req, res, next) {
        const currentEmail = req.session.currentEmail;
        const currentPassword = req.session.currentPassword;

        res.render('admin/login', {
            title: 'Đăng nhập Dashboard',
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

    logout(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.flash('success', 'Đăng xuất tài khoản thành công!');
            res.redirect('./login');
        });
    }

    //? Trang điều khiển
    dashboard(req, res, next) {
        res.render('admin/dashboard', {
            title: 'Bảng điều khiển',
            layout: 'admin-side',
            user: req.user
        });
    }

    //? Trang phê duyệt tài khoản
    async users(req, res, next) {
        await User.find({ role: 'client' }).exec()
            .then(users => {
                res.render('admin/user', {
                    title: 'Phê duyệt tài khoản',
                    layout: 'admin-side',
                    users: users,
                });
            });
    }

    // Xác minh tài khoản
    async verify_user(req, res, next) {
        const _id = req.params.id;
        const filter = { _id: new mongoose.Types.ObjectId(_id) };
        if (!req.body.account_verify) {
            req.body.account_verify = true;
            await User.findOneAndUpdate(filter, req.body, { new: true }).exec()
                .then(user => {
                    if (!user) {
                        throw new Error('Tài khoản không tồn tại!');
                    }
                    req.flash('success', 'Xác minh tài khoản thành công!');
                    res.redirect('../users');
                })
                .catch(err => {
                    req.flash('warning', 'Xác minh tài khoản thất bại! Lỗi ' + err.message);
                    res.redirect('../users');
                });
        } else {
            req.flash('warning', 'Tài khoản đã được xác minh!');
            res.redirect('../users');
        }

    }

    // Xóa tài khoản
    async delete_user(req, res, next) {
        const _id = req.params.id;
        await User.findByIdAndDelete(_id).exec()
            .then((user) => {
                if (!user) {
                    throw new Error('Tài khoản không tồn tại!');
                }
                req.flash('success', 'Xóa tài khoản thành công!');
                res.sendStatus(200);
            })
            .catch(err => {
                req.flash('error', 'Xóa tài khoản thất bại! Lỗi ' + err.message);
                res.sendStatus(500);
            });
    }

    //? Trang quản lý cựu sinh viên
    async alumnus_list(req, res, next) {
        await User.find({ role: 'client', account_verify: true }).exec()
            .then(alumnus => {
                res.render('admin/alumni-list', {
                    title: 'Quản lý cựu sinh viên',
                    layout: 'admin-side',
                    alumnus: alumnus
                });
            });
    }

    // Xem thông tin chi tiết cựu sinh viên
    async alumnus_detail(req, res, next) {
        const _id = req.params.id;
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        await User.findById(filter).exec()
            .then(alumnus => {
                if (!alumnus) {
                    throw new Error('Cựu sinh viên không tồn tại!');
                }
                res.render('admin/alumni/alumni-detail', {
                    title: 'Thông tin chi tiết cựu sinh viên',
                    layout: 'admin-side',
                    alumnus: alumnus
                });
            })
            .catch(err => {
                console.log(err);
                next(err);
            });
    }

    // Tạo thông tin cựu sinh viên
    alumnus_add(req, res, next) {
        res.render('admin/alumni/alumni-create', {
            title: 'Tạo mới cựu sinh viên',
            layout: 'admin-side',
        });
    }

    async alumnus_create(req, res, next) {
        const fullname = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password;
        const birthday = req.body.birthday;
        const gender = req.body.gender;
        const class_code = req.body.class;
        const tel = req.body.tel;
        const major = req.body.major;
        const batch = req.body.batch;
        const passing_year = req.body.passing_year;

        console.log(email)

        const existEmail = await User.findOne({ email: email }).exec();
        if (existEmail) {
            req.flash('error', 'Đã tồn tại email trong hệ thống');
            res.redirect('./');
        } else {
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            const encryptPassword = await bcrypt.hash(password, salt);
    
            // Create new alumni
            const newAlumni = new User({
                fullname: fullname,
                email: email,
                password: encryptPassword,
                birthday: birthday,
                gender: gender,
                class: class_code,
                tel: tel,
                nmajor: major,
                batch: batch,
                passing_year: passing_year,
                avatar_url: 'default-user.jpg',
                account_verify: true,
                new_account: false,
                create_at: new Date(),
                role: 'client'
            });
    
            // Save alumni
            try {
                newAlumni.save();
                req.flash('success', 'Thêm mới thông tin thành công!');
                res.redirect('./');
            } catch (err) {
                req.flash('error', err.message);
                res.redirect('./');
            }
        }
    }

    // Sửa thông tin cựu sinh viên
    async alumnus_update(req, res, next) {
        const _id = req.params.id;
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        await User.findById(filter).exec()
            .then(alumnus => {
                if (!alumnus) {
                    throw new Error('Cựu sinh viên không tồn tại!');
                }
                res.render('admin/alumni/alumni-update', {
                    title: 'Cập nhật thông tin cựu sinh viên',
                    layout: 'admin-side',
                    alumnus: alumnus
                });
            })
            .catch(err => {
                console.log(err);
                next(err);
            });
    }

    async update_alumni(req, res, next) {
        const _id = req.params.id;
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        uploadAvatar.single('file_upload')(req, res, async (err) => {
            if (err) {
                if (err.message === 'File too large') {
                    req.flash('warning', 'File upload không được lớn hơn 5MB!');
                    res.redirect('/admin/alu/update/' + _id);
                } else if (err.message === 'File type not allowed') {
                    req.flash('warning', 'File upload không đúng định dạng!');
                    res.redirect('/admin/alu/update/' + _id);
                }
            }

            if (req.file !== undefined) {
                let image = 'avatar-' + _id + '.' + req.file.filename.split('.').pop();
                req.body.avatar_url = image;
            }

            req.body.updated_at = new Date();

            await User.findOneAndUpdate(filter, req.body, { new: true }).exec()
                .then(alumnus => {
                    if (!alumnus) {
                        throw new Error('Cựu sinh viên không tồn tại!');
                    }
                    req.flash('success', 'Cập nhật thông tin cựu sinh viên thành công!');
                    res.redirect('/api/admin/alu');
                })
                .catch(err => {
                    req.flash('error', 'Cập nhật thông tin cựu sinh viên thất bại! Lỗi ' + err.message);
                    res.redirect('/api/admin/alu');
                });
        });
    }

    // Xóa thông tin cựu sinh viên
    async delete_alumni(req, res, next) {
        const _id = req.params.id;
        await User.findByIdAndDelete(_id).exec()
            .then((alumni) => {
                if (!alumni) {
                    throw new Error('Cựu sinh viên không tồn tại!');
                }
                req.flash('success', 'Xóa cựu sinh viên thành công!');
                res.sendStatus(200);
            })
            .catch(err => {
                req.flash('error', 'Xóa cựu sinh viên thất bại! Lỗi ' + err.message);
                res.sendStatus(500);
            });
    }


    //? Trang quản lý sự kiện
    async events_list(req, res, next) {
        await Event.find().exec()
            .then(events => {
                res.render('admin/event-list', {
                    title: 'Quản lý sự kiện',
                    layout: 'admin-side',
                    events: events
                });
            });
    }


    // Tạo sự kiện
    events_add(req, res, next) {
        res.render('admin/events/event-create', {
            title: 'Tạo mới sự kiện',
            layout: 'admin-side',
        });
    }


    async events_create(req, res, next) {
        uploadEvent.single('file_upload')(req, res, async (err) => {
            if (err) {
                if (err.message === 'File too large') {
                    req.flash('error', 'File upload không được lớn hơn 5MB!');
                    res.redirect('/admin/rooms/create');
                } else if (err.message === 'File type not allowed') {
                    req.flash('error', 'File upload không đúng định dạng!');
                    res.redirect('/admin/rooms/create');
                }
            }

            if (req.file !== undefined) {
                const formattedTitle = slugify(req.body.event_title, { lower: true, remove: /[*+~.,/()'"!:@]/g });
                let image = 'banner-' + formattedTitle + '.' + req.file.filename.split('.').pop();
                req.body.banner = image;
                req.body.created_at = new Date();

                const oldPath = path.resolve(__dirname, '../../public/uploads/event/') + '/' + req.file.filename;
                const newPath = path.resolve(__dirname, '../../public/uploads/event/') + '/' + image;
                fs.rename(oldPath, newPath, async (err) => {
                    if (err) throw err

                    const newEvent = new Event(req.body);
                    await newEvent.save().then(() => {
                        req.flash('success', 'Thêm mới sự kiện thành công!');
                        res.redirect('./');
                    })
                });
            } else {
                req.body.created_at = new Date();
                req.body.banner = '';
                const newEvent = new Event(req.body);
                await newEvent.save().then(() => {
                    req.flash('success', 'Thêm mới sự kiện thành công!');
                    res.redirect('./');
                })
            }
        });
    }

    // Sửa thông tin sự kiện
    async events_update(req, res, next) {
        const _id = req.params.id;
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        await Event.findById(filter).exec()
            .then(event => {
                if (!event) {
                    throw new Error('Sự kiện không tồn tại!');
                }
                res.render('admin/events/event-update', {
                    title: 'Cập nhật thông tin Sự kiện',
                    layout: 'admin-side',
                    event: event
                });
            })
            .catch(err => {
                console.log(err);
                next(err);
            });
    }

    async update_event(req, res, next) {
        const _id = req.params.id;
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        uploadEvent.single('file_upload')(req, res, async (err) => {
            if (err) {
                if (err.message === 'File too large') {
                    req.flash('warning', 'File upload không được lớn hơn 5MB!');
                    res.redirect('/admin/alu/update/' + _id);
                } else if (err.message === 'File type not allowed') {
                    req.flash('warning', 'File upload không đúng định dạng!');
                    res.redirect('/admin/alu/update/' + _id);
                }
            }

            req.body.updated_at = new Date();
            if (req.file !== undefined) {
                if (req.body.banner !== undefined) {
                    const oldBanner = req.body.banner;
                    fs.unlinkSync(path.resolve(__dirname, '../../public/uploads/event/') + '\\' + oldBanner);
                }
                const formattedTitle = slugify(req.body.event_title, { lower: true, remove: /[*+~.,/()'"!:@]/g });
                let image = 'banner-' + formattedTitle + '.' + req.file.filename.split('.').pop();

                const oldPath = path.resolve(__dirname, '../../public/uploads/event/') + '\\' + req.file.filename;
                const newPath = path.resolve(__dirname, '../../public/uploads/event/') + '\\' + image;
                fs.rename(oldPath, newPath, async (err) => {
                    if (err) throw err

                    await Event.findOneAndUpdate(filter, req.body, { new: true }).exec()
                        .then(event => {
                            if (!event) {
                                throw new Error('Sự kiện không tồn tại!');
                            }
                            req.flash('success', 'Cập nhật thông tin sự kiện thành công!');
                            res.redirect('/api/admin/events');
                        })
                        .catch(err => {
                            req.flash('error', 'Cập nhật thông tin sự kiện thất bại! Lỗi ' + err.message);
                            res.redirect('/api/admin/events');
                        });
                });
            }
            else {
                if (req.body.banner !== undefined) {
                    const banner_old = req.body.banner
                    const formattedTitle = slugify(req.body.event_title, { lower: true, remove: /[*+~.,/()'"!:@]/g });
                    let image = 'banner-' + formattedTitle + '.' + banner_old.split('.').pop();
                    req.body.thumbnail = image;

                    const oldPath = path.resolve(__dirname, '../../public/uploads/event/') + '\\' + banner_old;
                    const newPath = path.resolve(__dirname, '../../public/uploads/event/') + '\\' + image;
                    fs.rename(oldPath, newPath, async (err) => {
                        if (err) throw err

                        await Event.findOneAndUpdate(filter, req.body, { new: true }).exec()
                            .then(event => {
                                if (!event) {
                                    throw new Error('Sự kiện không tồn tại!');
                                }
                                req.flash('success', 'Cập nhật thông tin sự kiện thành công!');
                                res.redirect('/api/admin/events');
                            })
                            .catch(err => {
                                req.flash('error', 'Cập nhật thông tin sự kiện thất bại! Lỗi ' + err.message);
                                res.redirect('/api/admin/events');
                            });
                    });
                } else {
                    await Event.findOneAndUpdate(filter, req.body, { new: true }).exec()
                        .then(event => {
                            if (!event) {
                                throw new Error('Sự kiện không tồn tại!');
                            }
                            req.flash('success', 'Cập nhật thông tin sự kiện thành công!');
                            res.redirect('/api/admin/events');
                        })
                        .catch(err => {
                            req.flash('error', 'Cập nhật thông tin sự kiện thất bại! Lỗi ' + err.message);
                            res.redirect('/api/admin/events');
                        });
                }
            }
        });
    }

    // Xóa sự kiện
    async delete_event(req, res, next) {
        const _id = req.params.id;
        await Event.findByIdAndDelete(_id).exec()
            .then((event) => {
                if (!event) {
                    throw new Error('Sự kiện không tồn tại!');
                }
                req.flash('success', 'Xóa sự kiện thành công!');
                res.sendStatus(200);
            })
            .catch(err => {
                req.flash('error', 'Xóa sự kiện thất bại! Lỗi ' + err.message);
                res.sendStatus(500);
            });
    }


    //? Trang quản lý bài dăng tuyển dụng
    async jobs_list(req, res, next) {
        await Job.find().exec()
            .then(jobs => {
                res.render('admin/job-list', {
                    title: 'Quản lý bài đăng tuyển dụng',
                    layout: 'admin-side',
                    jobs: jobs
                });
            });
    }

    // Thêm bài tuyển dụng
    jobs_add(req, res, next) {
        res.render('admin/jobs/job-create', {
            title: 'Tạo bài tuyển dụng',
            layout: 'admin-side',
        });
    }

    async jobs_create(req, res, next) {
        req.body.post_at = new Date();
        const newJob = new Job(req.body);
        await newJob.save().then(() => {
            req.flash('success', 'Thêm mới bài đăng thành công!');
            res.redirect('./');
        });
    }

    // Sửa thông tin bài đăng
    async jobs_update(req, res, next) {
        const _id = req.params.id;
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        await Job.findById(filter).exec()
            .then(job => {
                if (!job) {
                    throw new Error('Bài đăng không tồn tại!');
                }
                res.render('admin/jobs/job-update', {
                    title: 'Cập nhật thông tin Bài đăng',
                    layout: 'admin-side',
                    job: job
                });
            })
            .catch(err => {
                console.log(err);
                next(err);
            });
    }

    async update_job(req, res, next) {
        const _id = req.params.id;
        console.log(_id)
        const filter = { _id: new mongoose.Types.ObjectId(_id) };

        await Job.findOneAndUpdate(filter, req.body, { new: true }).exec()
            .then(job => {
                if (!job) {
                    throw new Error('Bài đăng không tồn tại!');
                }
                req.flash('success', 'Cập nhật thông tin bài đăng thành công!');
                res.redirect('/api/admin/jobs');
            })
            .catch(err => {
                req.flash('error', 'Cập nhật thông tin bài đăng thất bại! Lỗi ' + err.message);
                res.redirect('/api/admin/jobs');
            });
    }

    // Xóa bài đăng
    async delete_job(req, res, next) {
        const _id = req.params.id;
        await Job.findByIdAndDelete(_id).exec()
            .then((job) => {
                if (!job) {
                    throw new Error('Bài đăng không tồn tại!');
                }
                req.flash('success', 'Xóa bài đăng thành công!');
                res.sendStatus(200);
            })
            .catch(err => {
                req.flash('error', 'Xóa bài đăng thất bại! Lỗi ' + err.message);
                res.sendStatus(500);
            });
    }

}

module.exports = new AdminController();