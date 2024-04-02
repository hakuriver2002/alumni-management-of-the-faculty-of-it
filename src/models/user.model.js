const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    account_verify: {
        type: Boolean,
        require: false
    },
    class: {
        type: String,
        request: false
    },
    tel: {
        type: String,
        require: false
    },
    gender: {
        type: String,
        require: false
    },
    birthday: {
        type: Date,
        require: false
    },
    address: {
        type: String,
        require: false
    },
    batch: {
        type: String,
        require: true
    },
    passing_year: {
        type: Number,
        require: true
    },
    major: {
        type: String,
        require: false
    },
    avatar_url: {
        type: String,
        require: false
    },
    facebook_link: {
        type: String,
        require: false
    },
    github_link: {
        type: String,
        require: false
    },
    linked_link: {
        type: String,
        require: false
    },
    company: {
        type: String,
        require: false
    },
    job_type: {
        type: String,
        require: false
    },
    join_date: {
        type: Date,
        require: false
    },
    new_account: {
        type: Boolean,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('_user', userSchema, 'user');