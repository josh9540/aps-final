const { validationResult } = require('express-validator');

const Survey = require('../modals/Survey');

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