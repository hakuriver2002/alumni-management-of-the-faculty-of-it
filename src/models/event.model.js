const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    event_title: {
        type: String,
        require: true,
    },
    event_tag: {
        type: String,
        require: true,
    },
    location: {
        type: String,
        require: true
    },
    province: {
        type: String,
        require: true
    },
    contact_email: {
        type: String,
        require: false
    },
    contact_tel: {
        type: Number,
        require: false
    },
    start_time: {
        type: String,
        require: true
    },
    start_date: {
        type: String,
        require: true
    },
    end_date: {
        type: String,
        require: true

    },
    description: {
        type: String,
        request: true
    },
    banner: {
        type: String,
        request: false
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

module.exports = mongoose.model('_event', eventSchema, 'event');