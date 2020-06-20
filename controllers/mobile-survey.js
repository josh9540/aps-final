const { validationResult } = require('express-validator');

const Survey = require('../modals/Survey');
const imageConverter = require('../util/string-to-image');


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
            pincode,
            contact,
            height,
            weight,
            bloodGroup,
            university,
            board,
            yearPassedOut,
            coaching,
            forceMember,
            governmentMember,
            other,
        } = req.body;
        let studentPhotoUrl;
        if (req.body.photo != '') {
            studentPhotoUrl = req.body.name + Date.now().toString() + 'photo.jpg';
            let done = await imageConverter(req.body.photo, studentPhotoUrl);
            if (done) {
                studentPhotoUrl = 'images/' + studentPhotoUrl;
            }
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
            pincode,
            contact,
            height,
            weight,
            bloodGroup,
            university,
            board,
            yearPassedOut,
            coaching,
            forceMember,
            governmentMember,
            other,
            studentPhotoUrl,
            mode: "Mobile"
        });
        const survey = await newSurvey.save();
        res.status(201).json({ message: 'Survey created', user: survey });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}