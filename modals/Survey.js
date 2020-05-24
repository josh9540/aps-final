const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const surveySchema = new Schema({
    courses: {
        type: Array
    },
    college: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String
    },
    dob: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    district: {
        type: String
    },
    tehsil: {
        type: String
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    bloodGroup: {
        type: String
    },
    qualification: {
        type: String,
        required: true
    },
    familyBackground: {
        type: String
    },
    studentPhotoUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Survey', surveySchema);