const { validationResult } = require('express-validator');

const UserRegistration = require('../modals/User-Registeration');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const imageConverter = require('../util/string-to-image');

exports.getCollege = async(req, res, next) => {
    const colleges = await College.find();
    res.status(200).json({ colleges });
}

exports.getCourse = async(req, res, next) => {
    const courses = await Course.find();
    res.status(200).json({ courses });
}

exports.postRegisterationCreate = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        });
    }
    try {
        let courses = req.body.courses;
        if (!Array.isArray(courses)) {
            courses = [courses]
        }
        const {
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveBoard,
            twelveYear,
            twelveSubject,
            twelvePercentage,
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType
        } = req.body;
        let idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl,
            universityDocumentUrl,
            studentPhotoUrl,
            aspiringUrl;

        if (req.body.document_idcard && req.body.document_idcard != '') {
            idProofUrl = req.body.name + Date.now().toString() + 'idProof.jpg';
            let done = await imageConverter(req.body.document_idcard, idProofUrl);
            idProofUrl = (done) ? 'images/' + idProofUrl : "";
        }
        if (req.body.tenth_marksheet && req.body.tenth_marksheet != '') {
            tenthMarksheetUrl = req.body.name + Date.now().toString() + 'tenthMarksheetUrl.jpg';
            let done = await imageConverter(req.body.tenth_marksheet, tenthMarksheetUrl);
            tenthMarksheetUrl = (done) ? 'images/' + tenthMarksheetUrl : "";
        }
        if (req.body.twelve_marksheet && req.body.twelve_marksheet != '') {
            twelveMarksheetUrl = req.body.name + Date.now().toString() + 'twelveMarksheetUrl.jpg';
            let done = await imageConverter(req.body.twelve_marksheet, twelveMarksheetUrl);
            twelveMarksheetUrl = (done) ? 'images/' + twelveMarksheetUrl : "";
        }
        if (req.body.graduation_document && req.body.graduation_document != '') {
            universityDocumentUrl = req.body.name + Date.now().toString() + 'graduation_document.jpg';
            let done = await imageConverter(req.body.graduation_document, universityDocumentUrl);
            universityDocumentUrl = (done) ? 'images/' + universityDocumentUrl : "";
        }
        if (req.body.photo && req.body.photo != '') {
            studentPhotoUrl = req.body.name + Date.now().toString() + 'photo.jpg';
            let done = await imageConverter(req.body.photo, studentPhotoUrl);
            studentPhotoUrl = (done) ? 'images/' + studentPhotoUrl : "";
        }
        if (req.body.aspiring && req.body.aspiring != '') {
            aspiringUrl = req.body.name + Date.now().toString() + 'aspiring.jpg';
            let done = await imageConverter(req.body.aspiring, aspiringUrl);
            aspiringUrl = (done) ? 'images/' + aspiringUrl : "";
        }
        const newUser = new UserRegistration({
            courses,
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveBoard,
            twelveYear,
            twelveSubject,
            twelvePercentage,
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType,
            idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl: twelveMarksheetUrl,
            aspiringUrl,
            universityDocumentUrl,
            studentPhotoUrl,
            mode: "Mobile"
        });
        const user = await newUser.save();
        res.status(201).json({ message: "user created", user });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}