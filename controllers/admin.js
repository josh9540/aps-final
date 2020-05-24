const bcrypt = require('bcryptjs');

const User = require('../modals/User');

exports.getDashboard = (req, res, next) => {
    res.render('dashboard');
}

exports.getLogin = (req, res, next) => {
    res.render('login', { errorMessage: null });
}
exports.postLogin = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(422).render('login', {
                errorMessage: "Invalid email."
            });
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                return res.redirect('/admin/');
            });
        }
        return res.status(422).render('login', {
            errorMessage: "Incorrect password."
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/admin/login');
    });
};