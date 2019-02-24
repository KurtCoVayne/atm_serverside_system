const express = require('express')
const router = express.Router();
const { isAuthenticated } = require('../helpers/val');

const Trans = require('../models/Trs')
const serviceCtrl = require('../controllers/services.controller')
const Debt = require('../models/Debt')

// Sistema de Cajero automatico
router.get('/atm', isAuthenticated, (req, res) => {
    res.render('u_services/atm')
});
router.post('/atm', isAuthenticated, serviceCtrl.ATM); //USAR CAJERO




//Sistema de transacciones
router.get('/operations/trs', isAuthenticated, (req, res) => {
    res.render('u_services/transaccion')
})

router.post('/operations/trs', serviceCtrl.MTRS) //HACER TRANSACCION

router.get('/operations/rtrs', isAuthenticated, async (req, res) => {
    const rtrs = await Trans.find({ recUs: req.user.id, find: true }).sort({ date: 'desc' })
    res.render('u_services/r_transaccion', { rtrs })
})

router.post('/operations/rtrs', serviceCtrl.RTRS) //RECIBIR TRANSACCION

router.get('/operations/htrs', isAuthenticated, async (req, res) => {
    const rtrs = await Trans.find({ envUs: req.user.id, find: true }).sort({ date: 'desc' })
    res.render('u_services/h_transaccion', { rtrs })
})

router.post('/operations/rtrs/:trs_id', isAuthenticated, async (req, res) => {
    const { trs_id } = req.params
    await Trans.findByIdAndUpdate(trs_id, { $set: { find: false } }) //OCULTAR TRANSACCION
    res.redirect('/services/operations/rtrs/')
})
router.post('/operations/htrs/:trs_id', isAuthenticated, async (req, res) => {
    const { trs_id } = req.params
    await Trans.findByIdAndUpdate(trs_id, { $set: { find: false } }) //OCULTAR TRANSACCION
    res.redirect('/services/operations/htrs/')
})
//Sistema de cartera
router.get('/wallet', isAuthenticated, async(req, res) =>{
    res.render('u_services/wallet')
})
router.post('/wallet/make-credits', isAuthenticated, serviceCtrl.makeCredits)
router.get('/wallet/make-credits', isAuthenticated, (req, res) => {
    res.render('u_services/make-credits')
})
router.get('/wallet/pay-credits', isAuthenticated, async(req, res ) => {
    const debt = await Debt.findOne({ userId: req.user.id })
    res.render('u_services/pay-credits', {debt})
})
router.post('/wallet/pay-credits', isAuthenticated, serviceCtrl.payCredits)

module.exports = router;