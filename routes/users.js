const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const registerationController = require('../controllers/user-registeration');
const surveyController = require('../controllers/user-survey');
const userRegistrations = require('../modals/User-Registeration');
const Survey = require('../modals/Survey');

router.get('/survey/delete/:_id', surveyController.deleteSurvey);
router.get('/survey/find/:email', surveyController.getFind);

exports.routes = router;