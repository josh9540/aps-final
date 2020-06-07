const path = require('path');
const ejs = require('ejs');
const express = require('express');
const { body } = require('express-validator');
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testapsgroup@gmail.com',
        pass: 'aps@1234'
    }
});

const router = express.Router();

const userRegistrations = require('../modals/User-Registeration');
const registerationController = require('../controllers/user-registeration')

router.get('/', (req, res) => {
    res.render('public/index');
});
router.get('/about', (req, res) => {
    res.render('public/about');
});

router.get('/afcat', (req, res) => {
    res.render('public/afcat');
});

router.get('/cds', (req, res) => {
    res.render('public/cds');
});

router.get('/contact', (req, res) => {
    res.render('public/contact');
});

router.get('/course', (req, res) => {
    res.render('public/course');
});

router.get('/contact', (req, res) => {
    res.render('public/contact');
});

router.get('/cpo', (req, res) => {
    res.render('public/cpo');
});

router.get('/daring_skills', (req, res) => {
    res.render('public/daring_skills');
});

router.get('/director_message', (req, res) => {
    res.render('public/director_message');
});

router.get('/dps', (req, res) => {
    res.render('public/dps');
});

router.get('/faq', (req, res) => {
    res.render('public/faq');
});

router.get('/galleryPage', (req, res) => {
    res.render('public/galleryPage');
});

router.get('/it_skills', (req, res) => {
    res.render('public/it_skills');
});

router.get('/latest_news', (req, res) => {
    res.render('public/latest_news');
});

router.get('/latest-vacancies', (req, res) => {
    res.render('public/latest-vacancies');
});

router.get('/nda_old', (req, res) => {
    res.render('public/nda_old');
});

router.get('/nda', (req, res) => {
    res.render('public/nda');
});

router.get('/other_skills', (req, res) => {
    res.render('public/other_skills');
});

router.get('/our_facility', (req, res) => {
    res.render('public/our_facility');
});

router.get('/our_programs', (req, res) => {
    res.render('public/our_programs');
});

router.get('/our-strength', (req, res) => {
    res.render('public/our-strength');
});

router.get('/privacy_policy', (req, res) => {
    res.render('public/privacy_policy');
});

router.get('/soft_skills', (req, res) => {
    res.render('public/soft_skills');
});

router.get('/ssb', (req, res) => {
    res.render('public/ssb');
});

router.get('/terms_conditions', (req, res) => {
    res.render('public/terms_conditions');
});

router.get('/upcomming', (req, res) => {
    res.render('public/upcomming');
});

router.get('/vision-mission', (req, res) => {
    res.render('public/vision-mission');
});

router.get('/why_arrow', (req, res) => {
    res.render('public/why_arrow');
});


router.get('/registration-form', registerationController.getRegistrationCreate);

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

router.post('/contact', (req, res, next) => {
    const { name, email, phone, message } = req.body;
    ejs.renderFile(path.join(path.dirname(process.mainModule.filename), 'views', 'email', 'query.ejs'), { name, email, phone, message }, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            const mainOptions = {
                from: 'testapsgroup@gmail.com',
                to: 'sumitc210@gmail.com',
                subject: 'New Query From' + name,
                html: data
            };
            transporter.sendMail(mainOptions, function(err, info) {
                if (err) {
                    throw new Error(err);
                }
            });
        }
    });
    res.redirect('/contact')
});

exports.routes = router;