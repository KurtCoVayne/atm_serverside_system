const User = require('../models/User')
const userCtrl = {};
const bcrypt = require('bcryptjs');
const { encryptPassword } = require('../helpers/val')

userCtrl.signup = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0 || password.length <= 0 || confirm_password.length <= 0 || email.length <= 0) {
        errors.push({ text: 'Yo creo que te falto alguno de los campos amigo' })
    } else if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    } else if (password.length <= 4) {
        errors.push({ text: 'Deberías usar una contraseña más larga' })
        errors.splice(1, 1);
    } else {
        await User.findOne({ $or: [{ email: email }, { name: name }] }, { name: 1, email: 1 })
            .then(existUser => {
                if (existUser) {
                    if (existUser.email === email) {
                        errors.push({ text: 'Alguien ya uso ese e-mail' })
                    } else if (existUser.name === name) {
                        errors.push({ text: 'Alguien ya uso ese nombre' })
                    }
                }
            }).catch(err => console.error(err))
    } if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password });
    } else {
        const newUser = new User({ name, email, password, confirm_password });
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg', 'Estas registrado. Bienvenido a mi aplicación bancaria!')
        res.redirect('/users/login')
    }
}

//Sistema de configuración
userCtrl.changeName = async (req, res) => {
    const { name, password } = req.body;
    const { id } = req.user
    const errors = [];
    const ret = await bcrypt.compare(password, req.user.password)
    if (name === req.user.name) {
        errors.push({ text: 'Tu nombre anterior y tu nombre nuevo son iguales' })
        res.render('users/us_conf/changeName', { errors })
    } else {
        if (ret) {
            await User.findOne({ name }, { name: 1 })
                .then(existUser => {
                    if (existUser) {
                        errors.push({ text: 'Alguien ya uso ese nombre' })
                    }
                }).catch(err => console.error(err))
            if (errors.length > 0) {
                res.render('users/us_conf/changeName', { errors, name });
            } else {
                req.flash('success_msg', 'Nombre cambiado satisfactoriamente. Hola! Señor@: ' + name)
                await User.findByIdAndUpdate(id, { $set: { name } })
                res.redirect('/users/account');
            }
        } else {
            errors.push({ text: 'Contraseña incorrecta' })
            res.render('users/us_conf/changeMail', { errors, name });
        }
    }
}
userCtrl.changeMail = async (req, res) => {
    const { email, password } = req.body;
    const { id } = req.user;
    const errors = [];
    if (email === req.user.email) {
        errors.push({ text: 'Tu Correo anterior y tu correo nuevo son iguales' })
        res.render('users/us_conf/changeMail', { errors })
    } else {
        const ret = await bcrypt.compare(password, req.user.password)
        if (ret) {
            await User.findOne({ email }, { email: 1 })
                .then(existUser => {
                    if (existUser) {
                        errors.push({ text: 'Alguien ya uso ese correo' })
                    }
                }).catch(err => console.error(err))
            if (errors.length > 0) {
                res.render('users/us_conf/changeName', { errors, email });
            } else {
                req.flash('success_msg', 'Correo cambiado satisfactoriamente. Tu correo fue cambiado por: ' + email)
                await User.findByIdAndUpdate(id, { $set: { email } })
                res.redirect('/users/account');
            }
        } else {
            errors.push({ text: 'Contraseña incorrecta' })
            res.render('users/us_conf/changeName', { errors, email });
        }
    }
}
userCtrl.changePass = async (req, res) => {
    let { a_pass, n_pass, cn_pass } = req.body;
    const { id, password } = req.user;
    const errors = [];
    if (a_pass === n_pass) {
        errors.push({ text: 'Tu \”contraseña anterior\” y tu \”contraseña nueva\” son iguales' })
        res.render('users/us_conf/changePass', { errors })
    } else {
        if (n_pass === cn_pass) {
            const ret = await bcrypt.compare(a_pass, password)
            if (ret) {
                n_pass = await encryptPassword(n_pass)
                await User.findByIdAndUpdate(id, { $set: { password: n_pass } })
                req.flash('success_msg', 'Tu contraseña fue cambiada satisfatoriamente!')
                req.logOut()
                res.redirect('/users/login')
            } else {
                errors.push({ text: 'Tu contraseña anterior no es correcta!' })

            }
        } else {
            errors.push({ text: 'Las contraseñas no coinciden' })
            res.render('users/us_conf/changePass', { errors })
        }
    }
}
module.exports = userCtrl;