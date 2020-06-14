require('dotenv/config');
const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const csrf = require('csurf');

const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const publicRoutes = require('./routes/public');
const mobileRoutes = require('./routes/mobile');
const errorController = require('./controllers/error');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, req.name + Date.now().toString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


app.set('view engine', 'ejs');
app.set('views', 'views');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).fields([{ name: 'document_idcard', maxCount: 1 },
        { name: 'tenth_marksheet', maxCount: 1 },
        { name: 'twelve_marksheet', maxCount: 1 },
        { name: 'graduation_document', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'aspiring', maxCount: 1 }
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


app.use('/mobile', mobileRoutes.routes);
const csrfProtection = csrf();
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(publicRoutes.routes);
app.use('/', userRoutes.routes);
app.use('/admin', adminRoutes.routes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error)
    res.redirect('/500');
});

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    app.listen(process.env.PORT || 3000);
}).catch(err => { console.log(err) })
