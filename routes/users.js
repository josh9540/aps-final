const express = require('express');

const router = express.Router();

const surveyController = require('../controllers/user-survey');

router.get('/survey/delete/:_id', surveyController.deleteSurvey);
router.get('/survey/find/:email', surveyController.getFind);

exports.routes = router;