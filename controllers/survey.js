const { validationResult } = require('express-validator');

const Survey = require('../modals/Survey');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');

exports.getRegistration = async(req, res, next) => {
    try {
        const page = +req.query.page || 1;
        let total = await Survey.countDocuments();
        let totalPages = Math.ceil(total / 10);
        const users = await Survey.find().skip((page - 1) * 10).limit(10);
        res.render('survey', { users, totalPages, page, total });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSurveyCreate = async(req, res, next) => {
    try {
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('survey-create', {
            errorMessage: null,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postCreateSurvey = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('survey-create', {
            errorMessage: errors.array()[0].msg
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
        await newSurvey.save();
        res.redirect('/admin/survey')
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditSurvey = (req, res, next) => {
    res.render('survey-edit', { errorMessage: null });
}

exports.postEditSurvey = async(req, res, next) => {
    try {
        const { email, contact } = req.body;
        const user = await Survey.findOne({ email: email, contact: contact });
        if (!user) {
            return res.render('survey-edit', { errorMessage: 'Invalid email or contact' });
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('survey-edit-true', {
            errorMessage: null,
            user,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditSurveyTrue = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const user1 = await Survey.findById(req.body._id);
            const courses = await Course.find();
            const colleges = await College.find();
            return res.status(422).render('survey-edit-true', {
                errorMessage: errors.array()[0].msg,
                user: user1,
                courses,
                colleges
            });
        }
        let courses = req.body.courses;
        if (!Array.isArray(courses)) {
            courses = [courses];
        }
        const survey = await Survey.findById(req.body._id);
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
        let studentPhotoUrl = survey.studentPhotoUrl || " ";
        if (req.files.photo) {
            fileHelper.deleteFile(survey.studentPhotoUrl);
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        survey.courses = courses;
        survey.college = college;
        survey.name = name;
        survey.fatherName = fatherName;
        survey.dob = dob;
        survey.email = email;
        survey.address = address;
        survey.state = state;
        survey.district = district;
        survey.tehsil = tehsil;
        survey.contact = contact;
        survey.height = height;
        survey.weight = weight;
        survey.bloodGroup = bloodGroup;
        survey.qualification = qualification;
        survey.familyBackground = familyBackground;
        survey.studentPhotoUrl = studentPhotoUrl;
        const savedSurvey = await survey.save();
        res.redirect('/admin/survey');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteSurvey = async(req, res, next) => {
    try {
        const _id = req.params._id;
        if (_id) {
            const survey = await Survey.findById(_id);
            console.log(survey);
            fileHelper.deleteFile(survey.studentPhotoUrl);
            await survey.remove();
            res.redirect('/admin/survey');
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCsv = async(req, res, next) => {
    try {
        const registeration = await Survey.find().lean();
        const jsonexport = require('jsonexport');
        return jsonexport(registeration, function(err, csv) {
            if (err) throw err;
            res.setHeader('Content-disposition', 'attachment; filename=data.csv');
            res.set('Content-Type', 'text/csv');
            return res.status(200).send(csv);
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}