const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const registerationController = require('../controllers/user-registeration');
const surveyController = require('../controllers/user-survey');
const userRegistrations = require('../modals/User-Registeration');
const Survey = require('../modals/Survey');


router.get('/', registerationController.getRegistrationCreate);
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
})], registerationController.postRegisterationCreate);
router.get('/registeration/edit', registerationController.getEditRegisteration);
router.post('/registeration/edit', registerationController.postEditRegisteration);
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
})], registerationController.postEditRegistrationTrue);
router.get('/registeration/find/:email', registerationController.getFind);

router.get('/survey', surveyController.getSurveyCreate);
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
}), body('height', 'Height cannot be empty').not().isEmpty(), body('weight', 'Weight cannot be empty').not().isEmpty(), body('qualification', 'Qualification cannot be empty').not().isEmpty()], surveyController.postCreateSurvey);
router.get('/survey/edit', surveyController.getEditSurvey);
router.post('/survey/edit', surveyController.postEditSurvey);
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
}), body('height', 'Height cannot be empty').not().isEmpty(), body('weight', 'Weight cannot be empty').not().isEmpty(), body('qualification', 'Qualification cannot be empty').not().isEmpty()], surveyController.postEditSurveyTrue);
router.get('/survey/delete/:_id', surveyController.deleteSurvey);
router.get('/survey/find/:email', surveyController.getFind);

exports.routes = router;