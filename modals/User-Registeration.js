const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    courses: {
        type: Array
    },
    college: {
        type: String,
    },
    name: {
        type: String
    },
    fatherName: {
        type: String,
        required: true
    },
    fatherOccupation: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    category: {
        type: String
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
    pincode: {
        type: Number
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    maritalStatus: {
        type: String
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    paid: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    tenthUniversity: {
        type: String
    },
    tenthYear: {
        type: String
    },
    tenthSubject: {
        type: String
    },
    tenthPercentage: {
        type: Number
    },
    twelveUniversity: {
        type: String
    },
    twelveYear: {
        type: String
    },
    twelveSubject: {
        type: String
    },
    twelvePercentage: {
        type: Number
    },
    graduationUniversity: {
        type: String
    },
    graduationYear: {
        type: String
    },
    graduationSubject: {
        type: String
    },
    graduationPercentage: {
        type: Number
    },
    idProofUrl: {
        type: String
    },
    tenthMarksheetUrl: {
        type: String
    },
    twelveMarksheetUrl: {
        typeL: String
    },
    universityDocumentUrl: {
        type: String
    },
    studentPhotoUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User-Registration', userSchema);