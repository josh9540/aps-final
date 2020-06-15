require('dotenv/config');
const { validationResult } = require('express-validator');
const Razorpay = require('razorpay');

const UserRegistration = require('../modals/User-Registeration');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');
const amountFinder = require('../util/amount');

// const instance = new Razorpay({
//     key_id: process.env.KEY_ID,
//     key_secret: process.env.KEY_SECRET,
// });

exports.getRegistrationCreate = async(req, res, next) => {
    try {
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('public/registration-form', {
            errorMessage: null,
            courses: courses,
            colleges: colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postRegisterationCreate = async(req, res, next) => {
    const errors = validationResult(req);
    const courses = await Course.find();
    const colleges = await College.find();
    if (!errors.isEmpty()) {
        return res.status(422).render('public/registration-form', {
            errorMessage: errors.array()[0].msg,
            courses: courses,
            colleges: colleges
        });
    }
    try {
        let courses1 = req.body.courses;
        if (!Array.isArray(courses1)) {
            courses1 = [courses1]
        }
        const {
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveBoard,
            twelveYear,
            twelveSubject,
            twelvePercentage,
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType
        } = req.body;
        let idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl,
            universityDocumentUrl,
            studentPhotoUrl,
            aspiringUrl;
        if (req.files.document_idcard) {
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");
        }
        if (req.files.tenth_marksheet) {
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.twelve_marksheet) {
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.graduation_document) {
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");
        }
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        if (req.files.aspiring) {
            aspiringUrl = req.files.aspiring[0].path.replace("\\", "/");
        }
        const newUser = new UserRegistration({
            courses: courses1,
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveBoard,
            twelveYear,
            twelveSubject,
            twelvePercentage,
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType,
            idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl: twelveMarksheetUrl,
            aspiringUrl,
            universityDocumentUrl,
            studentPhotoUrl
        });
        const user = await newUser.save();
        // const amount = await amountFinder(user.courses);
        // var options = {
        //     amount: amount,
        //     currency: "INR",
        //     receipt: "aa110055aaa",
        //     payment_capture: '0'
        // };
        // const order = await instance.orders.create(options);
        // res.render('pay');
        res.render('public/registration-form', {
            errorMessage: 'Registeration Successful',
            courses: courses,
            colleges: colleges
        });
        // res.render('pay', {
        //         key: process.env.KEY_ID,
        //         amount: order.amount,
        //         name: user.name,
        //         contact: user.contact,
        //         email: user.email,
        //         id: order.id,
        //         _id: user._id
        //     })
        // console.log(order)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditRegisteration = (req, res, next) => {
    res.render('users/edit-reg', { errorMessage: null });
}

exports.postEditRegisteration = async(req, res, next) => {
    try {
        const { email, contact } = req.body;
        const user = await UserRegistration.findOne({ email: email, contact: contact });
        if (!user) {
            return res.render('users/edit-reg', { errorMessage: 'Invalid email or contact' });
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('users/edit-registeration', {
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

exports.postEditRegistrationTrue = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const user1 = await UserRegistration.findById(req.body._id);
            const courses = await Course.find();
            const colleges = await College.find();
            return res.status(422).render('users/edit-registeration', {
                errorMessage: errors.array()[0].msg,
                user: user1,
                courses,
                colleges
            });
        }
        let courses = req.body.courses;
        if (!Array.isArray(courses)) {
            courses = [courses]
        }
        const user = await UserRegistration.findById(req.body._id);
        const {
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveBoard,
            twelveYear,
            twelveSubject,
            twelvePercentage,
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType,
        } = req.body;
        let idProofUrl = user.idProofUrl || " ",
            tenthMarksheetUrl = user.tenthMarksheetUrl || " ",
            twelveMarksheetUrl = user.twelveMarksheetUrl || " ",
            universityDocumentUrl = user.universityDocumentUrl || " ",
            studentPhotoUrl = user.studentPhotoUrl || " ",
            aspiringUrl = user.aspiringUrl || " ";

        if (req.files.document_idcard) {
            fileHelper.deleteFile(user.idProofUrl);
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");
        }
        if (req.files.tenth_marksheet) {
            fileHelper.deleteFile(user.tenthMarksheetUrl);
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.twelve_marksheet) {
            fileHelper.deleteFile(twelveMarksheetUrl);
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.graduation_document) {
            fileHelper.deleteFile(universityDocumentUrl);
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");
        }
        if (req.files.photo) {
            fileHelper.deleteFile(studentPhotoUrl);
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        if (req.files.aspiring) {
            fileHelper.deleteFile(aspiringUrl);
            aspiringUrl = req.files.aspiring[0].path.replace("\\", "/");
        }
        user.courses = courses;
        user.college = college;
        user.name = name;
        user.fatherName = fatherName;
        user.fatherOccupation = fatherOccupation;
        user.dob = dob;
        user.category = category;
        user.email = email;
        user.address = address;
        user.state = state;
        user.district = district;
        user.pincode = pincode;
        user.contact = contact;
        user.maritalStatus = maritalStatus;
        user.height = height;
        user.weight = weight;
        user.paid = paid;
        user.bloodGroup = bloodGroup;
        user.tenthBoard = tenthBoard;
        user.tenthYear = tenthYear;
        user.tenthSubject = tenthSubject;
        user.tenthPercentage = tenthPercentage;
        user.twelveBoard = twelveBoard;
        user.twelveYear = twelveYear;
        user.twelveSubject = twelveSubject;
        user.twelvePercentage = twelvePercentage;
        user.aspiringUniversity = aspiringUniversity;
        user.aspiringYear = aspiringYear;
        user.aspiringSubject = aspiringSubject;
        user.aspiringPercentage = aspiringPercentage;
        user.graduationUniversity = graduationUniversity;
        user.graduationYear = graduationYear;
        user.graduationSubject = graduationSubject;
        user.graduationPercentage = graduationPercentage;
        user.idType = idType;
        user.idProofUrl = idProofUrl;
        user.studentPhotoUrl = studentPhotoUrl;
        user.tenthMarksheetUrl = tenthMarksheetUrl;
        user.twelveMarksheetUrl = twelveMarksheetUrl;
        user.aspiringUrl = aspiringUrl;
        user.universityDocumentUrl = universityDocumentUrl;
        const savedUser = await user.save();
        res.redirect('/');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteRegisteration = async(req, res, next) => {
    try {
        const _id = req.params._id;
        if (_id) {
            const user = await UserRegistration.findById(_id);
            fileHelper.deleteFile(user.idProofUrl);
            fileHelper.deleteFile(user.studentPhotoUrlUrl);
            fileHelper.deleteFile(user.tenthMarksheetUrl);
            fileHelper.deleteFile(user.twelveMarksheetUrl);
            fileHelper.deleteFile(user.universityDocumentUrl);
            await user.remove();
            res.redirect('/');
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getFind = async(req, res, next) => {
    const email = req.params.email;
    try {
        const user = await UserRegistration.findOne({ email: email });
        if (user) {
            res.status(200).json({ user: user });
        } else {
            res.status(404).json({ message: "Not found" })
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postPaid = async(req, res, next) => {
    const colleges = await College.find();
    const courses = await Course.find();
    const crypto = require("crypto");
    const generatedSignature = crypto
        .createHmac(
            "SHA256",
            process.env.KEY_SECRET
        )
        .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        .digest("hex");
    const isSignatureValid = generatedSignature === req.body.razorpay_signature;
    let errorMessage = "Payment Unsuccessful";
    if (isSignatureValid) {
        errorMessage = "Payment Successful"
    }
    res.render('public/registration-form', {
        errorMessage: errorMessage,
        courses: courses,
        colleges: colleges
    });
}