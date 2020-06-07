const { validationResult } = require('express-validator');

const Survey = require('../modals/Survey');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');


exports.postCreateSurvey = async(req, res, next) => {
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
            dob,
            email,
            address,
            state,
            district,
            tehsil,
            contact,
            height,
            weight,
            bloodGroup,
            qualification,
            familyBackground,
        } = req.body;
        let studentPhotoUrl;
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        const newSurvey = new Survey({
            courses,
            college,
            name,
            fatherName,
            dob,
            email,
            address,
            state,
            district,
            tehsil,
            contact,
            height,
            weight,
            bloodGroup,
            qualification,
            familyBackground,
            studentPhotoUrl
        });
        const survey = await newSurvey.save();
        res.status(201).json({ survey: survey, message: 'Survey created' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.postEditSurvey = async(req, res, next) => {
//     try {
//         const { email, contact } = req.body;
//         const user = await Survey.findOne({ email: email, contact: contact });
//         if (!user) {
//             return res.status(422), json({ errorMessage: 'Invalid email or contact' });
//         }
//         res.status(200).json({ user, message: "User found" });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

// exports.postEditSurveyTrue = async(req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(422).json({
//                 message: errors.array()[0].msg
//             });
//         }
//         let courses = req.body.courses;
//         if (!Array.isArray(courses)) {
//             courses = [courses];
//         }
//         const survey = await Survey.findById(req.body._id);
//         const {
//             college,
//             name,
//             fatherName,
//             dob,
//             email,
//             address,
//             state,
//             district,
//             tehsil,
//             contact,
//             height,
//             weight,
//             bloodGroup,
//             qualification,
//             familyBackground,
//         } = req.body;
//         let studentPhotoUrl = survey.studentPhotoUrl || " ";
//         if (req.files.photo) {
//             fileHelper.deleteFile(survey.studentPhotoUrl);
//             studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
//         }
//         survey.courses = courses;
//         survey.college = college;
//         survey.name = name;
//         survey.fatherName = fatherName;
//         survey.dob = dob;
//         survey.email = email;
//         survey.address = address;
//         survey.state = state;
//         survey.district = district;
//         survey.tehsil = tehsil;
//         survey.contact = contact;
//         survey.height = height;
//         survey.weight = weight;
//         survey.bloodGroup = bloodGroup;
//         survey.qualification = qualification;
//         survey.familyBackground = familyBackground;
//         survey.studentPhotoUrl = studentPhotoUrl;
//         const savedSurvey = await survey.save();
//         res.status(201).json({
//             user: savedSurvey,
//             message: "Updated"
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

// exports.deleteSurvey = async(req, res, next) => {
//     try {
//         const _id = req.params._id;
//         if (_id) {
//             const survey = await Survey.findById(_id);
//             console.log(survey);
//             fileHelper.deleteFile(survey.studentPhotoUrl);
//             const user = await survey.remove();
//             res.status(200).json({
//                 user: user,
//                 message: 'Deleted'
//             });
//         }
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }