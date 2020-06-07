const { validationResult } = require('express-validator');

const Survey = require('../modals/Survey');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');
const moment = require('moment');
const jsonexport = require('jsonexport');

exports.getRegistration = async(req, res, next) => {
    try {
        const colleges = await College.find();
        const courses = await Course.find();
        const users = await Survey.find().sort({ createdAt: -1 });
        res.render('survey', { users, colleges, courses });
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
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");;
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
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");;
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
            if (survey.studentPhotoUrl) {
                fileHelper.deleteFile(survey.studentPhotoUrl);
            }
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
        const registeration = await Survey.find().select('-_id -__v').lean();
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

exports.getEditRegisterationId = async(req, res, next) => {
    try {
        const user = await Survey.findById(req.params._id);
        if (!user) {
            return res.render('edit-reg', { errorMessage: 'Invalid email or contact' });
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

exports.getFilter = async(req, res, next) => {
    try {
        let registeration;
        if (req.body.course) {
            registeration = await Survey.find({ courses: req.body.course }).select('-_id -__v').select('-_id -__v').lean();
        } else if (req.body.college) {
            registeration = await Survey.find({ college: req.body.college }).select('-_id -__v').select('-_id -__v').lean();
        } else if (req.body.sdate && req.body.edate) {
            registeration = await Survey.find({
                createdAt: {
                    $gte: moment(req.body.sdate).startOf('day').toDate(),
                    $lte: moment(req.body.edate).endOf('day').toDate()
                }
            }).select('-_id -__v').lean();
        } else {
            res.redirect('/admin/')
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('list', { users: registeration, courses, colleges });
        // return jsonexport(registeration, function(err, csv) {
        //     if (err) throw err;
        //     res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        //     res.set('Content-Type', 'text/csv');
        //     return res.status(200).send(csv);
        // });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}