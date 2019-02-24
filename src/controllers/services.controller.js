const { Extract } = require('../helpers/atm_system')
const User = require('../models/User')
const Trans = require('../models/Trs')
const bcrypt = require('bcryptjs');
const serviceCtrl = {};
const Debt = require('../models/Debt')

serviceCtrl.ATM = async (req, res) => {
    const { m_extraccion } = req.body
    const user = req.user
    let f_ext, b_update, ext; //Mensaje final, actualización de balance, entregado

    if (m_extraccion >= user.balance) {
        f_ext = "Error: No tienes el suficiente dinero amigo :(, tienes: " + user.balance + "$"
    } else {
        ext = Extract(m_extraccion)
        if (!ext) {
            f_ext = "Error: No había la suficiente cantidad de dinero en la caja, o el valor que solicitaste no está permitido"
        } else {
            const f_balance = user.balance - m_extraccion
            await User.findByIdAndUpdate(user.id, { balance: f_balance });
            b_update = "Actualización de balance: Se restaron " + m_extraccion + "$ de tu cuenta, te quedan " + f_balance + '$'
        }
    }
    res.render('u_services/atm', { ext, f_ext, b_update })
}
serviceCtrl.MTRS = async (req, res) => { //MAKE TRANSACTION
    const { d_email, mnt, msg } = req.body
    const user = req.user
    const d_user = await User.findOne(
        {
            'email': d_email,
            'find': true
        })
    if (d_user) {
        await new Trans({ //Crear y guardar transacción con los datos del usuario actual y los datos del usuario encontrado
            envN: user.name,
            envUs: user.id,
            recUs: d_user.id,
            msg,
            mnt
        }).save()
        req.flash('success_msg', 'El Usuario fue encontrado y la transacción se realizo.')
        res.redirect('/services/operations/htrs')
    } else {
        req.flash('error_msg', 'El usuario no fue encontrado y la transacción no se realizo.')
        res.redirect('/services/operations/trs')
    }
}
serviceCtrl.RTRS = async (req, res) => { //RECEIVE TRANSACTION
    let { recd, eUs, rUs, trs, mnt } = req.body
    if (recd == 'true') {
        req.flash('error_msg', 'Esta transacción ya fue reclamada.')
        res.redirect('/services/operations/rtrs')
    } else {
        const env = await User.findById(eUs)
        const rec = await User.findById(rUs)
        const Ef_balance = env.balance - parseInt(mnt);
        const Rf_balance = parseInt(rec.balance) + mnt

        await User.findByIdAndUpdate(eUs, { $set: { balance: Ef_balance } })
        await User.findByIdAndUpdate(rUs, { $set: { balance: Rf_balance } })
        await Trans.findByIdAndUpdate(trs, { $set: { recd: true, rdate: Date.now() } })
            .then(() => {
                req.flash('success_msg', 'La transacción se realizo exitosamente y el dinero se te fue transferido(Saldo Actual: ' + Rf_balance + ').')
                recd = 'false'
                res.redirect('/services/operations/rtrs')
            })
            .catch(err => console.error(err));
    }
}
serviceCtrl.makeCredits = async (req, res) => {
    const { amount, dues, password } = req.body
    const errors = [];

    if (await bcrypt.compare(password, req.user.password)) {
        let existingDebt = await Debt.findOne({ userId: req.user.id })
        if (existingDebt) {
            existingDebt = existingDebt.toJSON()
            if (existingDebt.amount === 0) {
                await Debt.findOneAndUpdate({ userId: req.user.id }, { amount, dues, payedAmount: 0 })
                await User.findByIdAndUpdate(req.user.id, { $set: { debt: amount } })
                req.flash('success_msg', 'Se creo una nueva deuda a tu nombre')
                return res.redirect('/services/wallet/pay-credits')
            } else {
                errors.push({ text: 'Ya tienes una deuda por: ' + (existingDebt.amount - existingDebt.payedAmount) + ' debes pagarla antes de solicitar otra' })
                return res.render('u_services/make-credits', { errors })
            }
        } else {
            await new Debt({
                userId: req.user.id,
                amount,
                dues
            }).save()
            await User.findByIdAndUpdate(req.user.id, { $set: { debt: amount, balance: req.user.balance + parseInt(amount) } })
            req.flash('success_msg', 'Se creo una nueva deuda a tu nombre')
            return res.redirect('/services/wallet/pay-credits')
        }
    } else {
        errors.push({ text: 'Contraseña incorrecta!' })
        return res.render('u_services/make-credits', { errors })
    }
}
serviceCtrl.payCredits = async (req, res) => {
    let { debtId, payValue, debtAmount, actualPayed, debtDues, debtDate } = req.body;
    payValue = parseFloat(payValue)
    debtAmount = parseFloat(debtAmount)
    actualPayed = parseFloat(actualPayed)
    const debt = await Debt.findById(debtId)
    const errors = [];
    if (!debt) {
        return res.redirect('/services/wallet/pay-credits')
    }
    if (req.user.balance <= payValue) {
        errors.push({ text: 'No tienes la suficiente cantidad de dinero para pagar, tienes: ' + req.user.balance })
        return res.render('u_services/pay-credits', { debt, errors })
    }
    await Debt.findByIdAndUpdate(debtId, { payedAmount: actualPayed + payValue })
    await User.findByIdAndUpdate(req.user.id, { $set: { debt: debtAmount - actualPayed - payValue, balance: req.user.balance - payValue } })
    debt.payedAmount += payValue
    if (actualPayed + payValue >= debtAmount) {
        req.flash('success_msg', 'Ya completaste tu deuda')
        await Debt.findByIdAndDelete(debtId)
        return res.redirect('/services/wallet/')
    }
    req.flash('success_msg', 'Se añadieron ' + payValue + '$ a tu deuda de ' + debtAmount)
    res.render('u_services/pay-credits', { debt })
}
module.exports = serviceCtrl;