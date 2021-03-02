const router = require('express').Router();
const Pedidos = require('../models/Pedidos');
const Nota = require('../models/Note');
const path = require('path');
const fs = require('fs-extra');

const {isAuthenticated, isAdmin} = require('../helpers/auth');

router.get('/pedidos/admin', isAuthenticated, isAdmin, async (req,res) =>{
     const pedido = await Pedidos.find().sort({date:'desc'});
     res.render('pedidos/all-pedidos', {pedido} );
})

router.get('/pedido', isAuthenticated, async (req,res) =>{
     const pedido = await Pedidos.find({user:req.user.id}).sort({date:'desc'});
     res.render('pedidos/all-pedidos', {pedido} );
});

router.get('/pedido/new/:id', isAuthenticated, async (req, res) => {
     const note = await Nota.findById(req.params.id);
     res.render('pedidos/add-pedido', {note});
});

router.post('/pedido/new/:id', isAuthenticated, async (req,res) => {
     const note = await Nota.findById(req.params.id);
     var cantidad = req.body.cantidad;
     var total=0;
     const errors = [];
     var pre=note.precio;
     if(cantidad<=0){
          errors.push({text:'Cantidad invalida'});
     }
     if(errors.length>0){
          res.render('pedidos/new/:id', {
               errors,
               cantidad
          });
     }
     else{
          total=cantidad * pre;
          const NewPedido = new Pedidos({cantidad, total});
          NewPedido.title=note.title;
          NewPedido.user=req.user.id;
          NewPedido.prod=note.id;
          NewPedido.save();
          req.flash('success_msj','Pedido realizado');
          res.redirect('/pedido');
     }
});

router.delete('/pedido/delete/:id');

module.exports = router;