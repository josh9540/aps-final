const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const csrf = require('csurf');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const publicRoutes = require('./routes/public');
const mobileRoutes = require('./routes/mobile');
const errorController = require('./controllers/error');

const MONGODB_URI = 'mongodb://localhost:27017/school';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req)
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// aws.config.update({
//     accessKeyId: 'AKIAJVTFNJLMLNIVQ6UA',
//     secretAccessKey: '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',
//     region: 'ap-south-1'
// });

// const s3 = new aws.S3();

app.set('view engine', 'ejs');
app.set('views', 'views');
//multerS3({
//     s3: s3,
//     bucket: 'ayushkharkia',
//     key: function(req, file, cb) {
//         cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
//     }
// }),

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).fields([{ name: 'document_idcard', maxCount: 1 },
        { name: 'tenth_marksheet', maxCount: 1 },
        { name: 'twelve_marksheet', maxCount: 1 },
        { name: 'graduation_document', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ])
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(publicRoutes.routes);
app.use('/admin', adminRoutes.routes);
app.use('/mobile', mobileRoutes.routes);
app.use(userRoutes.routes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error)
    res.redirect('/500');
});

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    app.listen(process.env.PORT || 3000);
}).catch(err => { console.log(err) })