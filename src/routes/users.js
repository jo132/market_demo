const router = require('express').Router();
const Users = require('../models/Users');
const passport = require('passport');

//Ingresar un usuario
router.get('/users/signin', (req,res) =>{
     res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
     successRedirect: '/notes',
     failureRedirect: '/users/signin',
     failureFlash: true
}));

//Crear un usuario
router.get('/users/signup', (req, res) =>{
     res.render('users/signup');
});

router.post('/users/signup', async (req, res) =>{
     const {name, email, password, confirm_password, telefono} = req.body;
     const errors=[];

     if(name.length==0 || email==0 || password==0 || confirm_password==0 || telefono==0){
          errors.push({text: 'Faltan campos por introducir'});
     }
     if(password!=confirm_password){
          errors.push({text: 'Las contraseñas no coinciden'});
     }
     if(password.length<4){
          errors.push({text: 'La contraseña tiene que tener mas de 4 digitos'});
     }
     if(errors.length>0){
          res.render('users/signup' , {errors, name,email,telefono,password,confirm_password});
     }
     else{
          /*AQUI SE GUARDAN LOS DATOS*/ 
          const emailUsers = await Users.findOne({email: email});
          const nameUsers = await Users.findOne({name: name});
          const telefonoUsers = await Users.findOne({telefono: telefono});
          if(emailUsers){
               req.flash('errors_msj','El email ya se encuentra en uso');
               res.redirect('/users/signup');
          }
          else
          {
               if(nameUsers){
                    req.flash('errors_msj','El nombre ya se encuentra en uso');
                    res.redirect('/users/signup');
               }
               else{
                    if(telefonoUsers){
                         req.flash('errors_msj','El telefono ya se encuentra en uso');
                         res.redirect('/users/signup');
                    }
                    else{
                         const newUsers = new Users({name,email,telefono,password});
                         newUsers.password = await newUsers.encryptPassword(password);
                         await newUsers.save();
                         req.flash('success_msj','Tu registro se completo satisfactoriamente');
                         res.redirect('/users/signin');
                    }
               }
          }  
     }
});

router.get('/users/logout', (req,res) =>{
     req.logout();
     res.redirect('/');
});

module.exports = router;