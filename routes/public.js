const express = require('express');
const router = express.Router();

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

router.get('/registration-form', (req, res) => {
    res.render('public/registration-form');
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

exports.routes = router;