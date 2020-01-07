var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
var path = require('path');


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        /*Appending extension with original name*/
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage });

router.use(express.static(__dirname + "./public/"));


const mongoose = require('mongoose');

var Schema = mongoose.Schema;



var userDataShema = new Schema({
    picture: { type: String, data: Buffer },
    name: { type: String },
    writer: { type: String },
    words: { type: String },
    price: { type: Number }

});
var bos = new Schema({
    ime: { type: String },
    password: { type: String }
});
var Price = new Schema({
    book: { type: String },
    pay: { type: Number },
    name: { type: String },
    last: { type: String },
    tel: { type: String },
    send: { type: String }

});
var Buy = mongoose.model('Buy', Price);
var Boss = mongoose.model('Boss', bos);
var UserData = mongoose.model('UserData', userDataShema);


router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res) {
    var log = {
        ime: req.body.ime,
        password: req.body.password

    }
    var Sender = new Boss(log);
    Sender.save();
    res.redirect('izmena');
});

// singin
router.get('/singup', function(req, res) {
    res.render('singup');
});

router.post('/singup', function(req, res) {

    var log = {
        ime: req.body.ime,
        password: req.body.password

    }
    Boss.findOne({ password: log.password, ime: log.ime }).then(function(d) {
        if (d) {
            res.redirect('izmena');
        } else {
            res.redirect('/');
        }
    })


});


router.get('/', function(req, res, next) {
    UserData.find().then(function(doc) {

        res.render('index', { items: doc });

    });
});

router.get('/izmena', function(req, res) {
    UserData.find().then(function(doc) {
        res.render('izmena', { items: doc });

    });

});

router.get('/dodaj', function(req, res) {
    res.render('dodaj');
});
router.post('/dodaj', upload.single('picture'), function(req, res) {

    var description = {
        picture: req.file.filename,
        name: req.body.name,
        writer: req.body.writer,
        words: req.body.words,
        price: req.body.price

    }
    var data = new UserData(description);
    data.save();
    res.redirect('izmena');
});


router.get('/dorada/:id', function(req, res) {
    var id = req.params.id;
    UserData.findById(id).then(function(doc) {

        res.render('dorada', { item: doc });

    });

});
router.post('/dorada', upload.single('picture'), function(req, res) {
    id = req.body.id;

    UserData.findById(id, function(err, doc) {
        if (err) {
            console.error("nece nesto");
        }
        doc.picture = req.file.filename,
            doc.name = req.body.name,
            doc.writer = req.body.writer,
            doc.words = req.body.words,
            doc.price = req.body.price
        doc.save();
    });
    res.redirect('/izmena');
});

router.post('/obrisan/:id', function(req, res, next) {
    var id = req.params.id;
    UserData
        .findByIdAndRemove(id)
        .exec();
    res.redirect('/izmena');
});


router.get('/kupiti/:id', function(req, res) {
    var id = req.params.id;
    UserData.findById(id).then(function(doc) {

        res.render('kupio', { item: doc });

    });

});
router.post('/kupiti', function(req, res) {
    var description = {
        book: req.body.book,
        pay: req.body.pay,
        name: req.body.name,
        last: req.body.last,
        tel: req.body.tel,
        send: req.body.send
    }
    var buyer = new Buy(description);
    buyer.save();
    res.redirect('/');
})

module.exports = router;