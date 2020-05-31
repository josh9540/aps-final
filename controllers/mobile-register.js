const { validationResult } = require('express-validator');

const UserRegistration = require('../modals/User-Registeration');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');

exports.postRegisterationCreate = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).status({
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
            tenthUniversity,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveUniversity,
            twelveSubject,
            twelvePercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage
        } = req.body;
        let idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl,
            universityDocumentUrl,
            studentPhotoUrl;

        if (req.files.document_idcard) {
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");
        }
        if (req.files.tenth_marksheet) {
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.twelve_marksheet) {
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");
            console.log(twelveMarksheetUrl);
        }
        if (req.files.graduation_document) {
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");
        }
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
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
            tenthUniversity,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveUniversity,
            twelveSubject,
            twelvePercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl: twelveMarksheetUrl,
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

exports.postEditRegisteration = async(req, res, next) => {
    try {
        const { email, contact } = req.body;
        const user = await UserRegistration.findOne({ email: email, contact: contact });
        if (!user) {
            return res.status(422).json({ message: 'Invalid email or contact' });
        }
        res.status(200).json({ message: 'User found', user: user })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditRegistrationTrue = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.message[0] });
        }
        let courses = req.body.courses;
        if (!Array.isArray(courses)) {
            courses = [courses]
        }
        const user = await UserRegistration.findById(req.body._id);
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
            tenthUniversity,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveUniversity,
            twelveSubject,
            twelvePercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage
        } = req.body;
        let idProofUrl = user.idProofUrl || " ",
            tenthMarksheetUrl = user.tenthMarksheetUrl || " ",
            twelveMarksheetUrl = user.twelveMarksheetUrl || " ",
            universityDocumentUrl = user.universityDocumentUrl || " ",
            studentPhotoUrl = user.studentPhotoUrl || " ";

        if (req.files.document_idcard) {
            fileHelper.deleteFile(user.idProofUrl);
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");
        }
        if (req.files.tenth_marksheet) {
            fileHelper.deleteFile(user.tenthMarksheetUrl);
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.twelve_marksheet) {
            fileHelper.deleteFile(twelveMarksheetUrl);
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.graduation_document) {
            fileHelper.deleteFile(universityDocumentUrl);
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");
        }
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        user.courses = courses;
        user.college = college;
        user.name = name;
        user.fatherName = fatherName;
        user.fatherOccupation = fatherOccupation;
        user.dob = dob;
        user.category = category;
        user.email = email;
        user.address = address;
        user.state = state;
        user.district = district;
        user.pincode = pincode;
        user.contact = contact;
        user.maritalStatus = maritalStatus;
        user.height = height;
        user.weight = weight;
        user.paid = paid;
        user.bloodGroup = bloodGroup;
        user.tenthUniversity = tenthUniversity;
        user.tenthYear = tenthYear;
        user.tenthSubject = tenthSubject;
        user.tenthPercentage = tenthPercentage;
        user.twelveUniversity = twelveUniversity;
        user.twelveSubject = twelveSubject;
        user.twelvePercentage = twelvePercentage;
        user.graduationUniversity = graduationUniversity;
        user.graduationYear = graduationYear;
        user.graduationSubject = graduationSubject;
        user.graduationPercentage = graduationPercentage;
        user.idProofUrl = idProofUrl;
        user.studentPhotoUrl = studentPhotoUrl;
        user.tenthMarksheetUrl = tenthMarksheetUrl;
        user.twelveMarksheetUrl = twelveMarksheetUrl;
        user.universityDocumentUrl = universityDocumentUrl;
        const savedUser = await user.save();
        res.status(201).json({ message: "User Updated", user: savedUser });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteRegisteration = async(req, res, next) => {
    try {
        const _id = req.params._id;
        if (_id) {
            const user = await UserRegistration.findById(_id);
            fileHelper.deleteFile(user.idProofUrl);
            fileHelper.deleteFile(user.studentPhotoUrlUrl);
            fileHelper.deleteFile(user.tenthMarksheetUrl);
            fileHelper.deleteFile(user.twelveMarksheetUrl);
            fileHelper.deleteFile(user.universityDocumentUrl);
            await user.remove();
            res.status(200).json({ message: 'User deleted' });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}