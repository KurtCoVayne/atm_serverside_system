const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/users.controller')
const { isAuthenticated } = require('../helpers/val');

const passport = require('passport');

router.get('/!login', (req, res) => {
    res.render('users/login');
    req.flash('error_msg');
});

router.get('/login', (req, res) => {
    res.render('users/login')
    req.flash('error_msg');
});

router.get('/signup', (req, res) => {
    res.render('users/signup')
});
router.post('/signup', userCtrl.signup)

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

router.get('/account/', isAuthenticated, async (req, res) => {
    const user = req.user
    res.render('users/account', user)
})
router.get('/account/config/name', isAuthenticated, (req, res) => {
    res.render('users/us_conf/changeName')
})
router.get('/account/config/mail', isAuthenticated, (req, res) => {
    res.render('users/us_conf/changeMail')
})
router.get('/account/config/pass', isAuthenticated, (req, res) => {
    res.render('users/us_conf/changePass')
})

router.post('/account/config/name', isAuthenticated, userCtrl.changeName)
router.post('/account/config/mail', isAuthenticated, userCtrl.changeMail)
router.post('/account/config/pass', isAuthenticated, userCtrl.changePass)


module.exports = router;