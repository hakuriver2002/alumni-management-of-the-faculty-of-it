const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    job_title: {
        type: String,
        require: true,
    },
    company: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true,
    },
    skill_tag: {
        type: Array,
        require: true
    },
    salary: {
        type: Number,
        require: false
    },
    description: {
        type: String,
        require: false
    },
    website_link: {
        type: String,
        require: true,
    },
    post_at: {
        type: Date,
        default: Date.now
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

module.exports = mongoose.model('_job', jobSchema, 'job');