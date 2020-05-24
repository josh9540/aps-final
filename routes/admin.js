const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const adminController = require('../controllers/admin');
const registerationController = require('../controllers/registeration');
const collegeController = require('../controllers/college');
const courseController = require('../controllers/course');
const userController = require('../controllers/user');
const roleController = require('../controllers/roles');
const surveyController = require('../controllers/survey');
const userRegistrations = require('../modals/User-Registeration');
const Survey = require('../modals/Survey');
const User = require('../modals/User');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, adminController.getDashboard);
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', isAuth, adminController.getLogout);

router.get('/registeration', isAuth, registerationController.getRegistration);
router.get('/registeration/create', isAuth, registerationController.getRegistrationCreate);
router.post('/registeration/create', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return userRegistrations.findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists');
            }
        })
}).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
    return userRegistrations.findOne({ contact: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Contact no already exists');
            }
        })
})], isAuth, registerationController.postRegisterationCreate);
router.get('/registeration/edit', isAuth, registerationController.getEditRegisteration);
router.post('/registeration/edit', isAuth, registerationController.postEditRegisteration);
router.post('/registeration/edit/true', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return userRegistrations.findOne({ email: value })
        .then(userDoc => {
            if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                return Promise.reject('Email already exists');
            }
        })
}).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
    return userRegistrations.findOne({ contact: value })
        .then(userDoc => {
            if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                return Promise.reject('Contact no already exists');
            }
        })
})], isAuth, registerationController.postEditRegistrationTrue);
router.get('/registeration/delete/:_id', isAuth, registerationController.deleteRegisteration);
router.get('/registeration/csv', isAuth, registerationController.getCsv);

router.get('/course', isAuth, courseController.getCourses);
router.get('/course/create', isAuth, courseController.getCoursesCreate);
router.post('/course/create', [body('courseName', 'Invalid Name').not().isEmpty(), body('coursePrice', 'Invalid Price').not().isEmpty().isNumeric()], isAuth, courseController.postCourseCreate);
router.get('/course/edit', isAuth, courseController.getEditCourse);
router.post('/course/edit', isAuth, courseController.postEditCourse);
router.post('/course/edit/true', [body('courseName', 'Invalid Name').not().isEmpty(), body('coursePrice', 'Invalid Price').not().isEmpty().isNumeric()], isAuth, courseController.postEditCourseTrue);
router.get('/course/delete/:_id', isAuth, courseController.getDeleteCourse);
router.get('/course/csv', isAuth, courseController.getCsv);


router.get('/college', isAuth, collegeController.getCollege);
router.get('/college/create', isAuth, collegeController.getCollegeCreate);
router.post('/college/create', [body('collegeName', 'Invalid Name').trim().not().isEmpty()], isAuth, collegeController.postCollegeCreate);
router.get('/college/edit', isAuth, collegeController.getEditCollege);
router.post('/college/edit', isAuth, collegeController.postEditCollege);
router.post('/college/edit/true', [body('collegeName', 'Invalid Name').not().isEmpty()], isAuth, collegeController.postEditCollegeTrue);
router.get('/college/delete/:_id', isAuth, collegeController.getDeleteCollege);
router.get('/college/csv', isAuth, collegeController.getCsv);


router.get('/user', isAuth, userController.getUser);
router.get('/user/create', isAuth, userController.getUserCreate);
router.post('/user/create', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(),
    body('firstName', 'Invalid First Name').not().isEmpty().trim(),
    body('lastName', 'Invalid Last Name').not().isEmpty().trim(),
    body('role', 'Invalid role').not().isEmpty(),
    body('password', 'Minimum length for password is 6 and alphanumeric.').isLength({ min: 6 }).isAlphanumeric().trim()
], isAuth, userController.postUserCreate);
router.get('/user/edit', isAuth, userController.getEditUser);
router.post('/user/edit', isAuth, userController.postEditUser);
router.post('/user/edit/true', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(),
    body('firstName', 'Invalid First Name').not().isEmpty().trim(),
    body('lastName', 'Invalid Last Name').not().isEmpty().trim(),
    body('role', 'Invalid role').not().isEmpty(),
    body('password', 'Minimum length for password is 6 and alphanumeric.').isLength({ min: 6 }).isAlphanumeric().trim()
], isAuth, userController.postEditUserTrue);
router.get('/user/delete/:_id', isAuth, userController.getDeleteUser);
router.get('/user/csv', isAuth, userController.getCsv);


router.get('/role', isAuth, roleController.getAdmin);
router.get('/role/employee', isAuth, roleController.getEmployee);

router.get('/survey', isAuth, surveyController.getRegistration);
router.get('/survey/create', isAuth, surveyController.getSurveyCreate);
router.post('/survey/create', [body('name', 'Name cannot be empty').not().isEmpty(), body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return Survey.findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists');
            }
        })
}).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
    return Survey.findOne({ contact: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Contact no already exists');
            }
        })
}), body('height', 'Height cannot be empty').not().isEmpty(), body('weight', 'Weight cannot be empty').not().isEmpty(), body('qualification', 'Qualification cannot be empty').not().isEmpty()], isAuth, surveyController.postCreateSurvey);
router.get('/survey/edit', isAuth, surveyController.getEditSurvey);
router.post('/survey/edit', isAuth, surveyController.postEditSurvey);
router.post('/survey/edit/true', [body('name', 'Name cannot be empty').not().isEmpty(), body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return Survey.findOne({ email: value })
        .then(userDoc => {
            if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                return Promise.reject('Email already exists');
            }
        })
}).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
    return Survey.findOne({ contact: value })
        .then(userDoc => {
            if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                return Promise.reject('Contact no already exists');
            }
        })
}), body('height', 'Height cannot be empty').not().isEmpty(), body('weight', 'Weight cannot be empty').not().isEmpty(), body('qualification', 'Qualification cannot be empty').not().isEmpty()], isAuth, surveyController.postEditSurveyTrue);
router.get('/survey/delete/:_id', isAuth, surveyController.deleteSurvey);
router.get('/survey/csv', isAuth, surveyController.getCsv);


exports.routes = router;