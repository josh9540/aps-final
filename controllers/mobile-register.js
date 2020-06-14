const { validationResult } = require('express-validator');

const UserRegistration = require('../modals/User-Registeration');
const Course = require('../modals/Courses');
const College = require('../modals/College');

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

        if (req.body.document_idcard != '' && req.files.document_idcard) {
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");
        }
        if (req.body.tenth_marksheet != '' && req.files.tenth_marksheet) {
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");
        }
        if (req.body.twelve_marksheet != '' && req.files.twelve_marksheet) {
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");
        }
        if (req.body.graduation_document != '' && req.files.graduation_document) {
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");
        }
        if (req.body.photo != '' && req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        if (req.body.aspiring != '' && req.files.aspiring) {
            aspiringUrl = req.files.aspiring[0].path.replace("\\", "/");
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
            studentPhotoUrl
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