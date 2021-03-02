const router = require('express').Router();
const Note = require('../models/Note');
const path = require('path');
const fs = require('fs-extra');

const {isAuthenticated, randomNumber, isAdmin} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, isAdmin, (req,res) =>
{
     res.render('notes/new-notes');
})

router.post('/notes/new-notes', isAuthenticated, isAdmin, async (req,res) =>
{
     const {title, description, precio} = req.body;
     const imgUrl = randomNumber()
     const imagenes = Note.find({filename: imgUrl});
     while(imagenes.length>0){
          imgUrl = randomNumber()
          imganes = await Note.find({filename: imgUrl});
     }
     const imageTempPath = req.file.path;
     const ext = path.extname(req.file.originalname).toLowerCase();
     const targetPath = path.resolve('src/public/upload/'+imgUrl+ext);
     const errors = [];
     if(title==""){
          errors.push({text:'Escribe un titulo valido'});
     }
     if(description==""){
          errors.push({text:'Escribe una descripcion valida'});
     }
     if(precio<=0){
          errors.push({text:'Precio invalido'});
     }
     if(errors.length>0){
          res.render('notes/new-notes', {
               errors,
               title,
               description,
               precio
          });
     }
     else{
          /*AQUI SE GUARDAN LOS DATOS*/ 
          await fs.rename(imageTempPath, targetPath);
          const NewNote = new Note({title, description, precio, filename: imgUrl + ext});
          NewNote.user=req.user.id;
          NewNote.author=req.user.name;
          const imageSaved = await NewNote.save();
          req.flash('success_msj','Producto agregado correctamente');
          res.redirect('/notes');
     }
});

router.get('/notes/edit', isAuthenticated, isAdmin, async (req,res) =>{
     const notes = await Note.find().sort({date:'desc'});
     res.render('notes/edit',{notes});
})

router.get('/notes', async (req,res) =>
{
     const notes = await Note.find().sort({date:'desc'});
     res.render('notes/alls-notes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, isAdmin, async (req, res) =>{
     const note = await Note.findById(req.params.id)
     res.render('notes/edit-notes', {note});
});

router.put('/notes/edit/:id', isAuthenticated, isAdmin, async (req, res) => {
     const {title,description}=req.body;
     await Note.findByIdAndUpdate(req.params.id, {title,description});
     req.flash('success_msj', 'Producto modificado correctamente');
     res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, isAdmin, async (req,res) =>{
     await Note.findByIdAndDelete(req.params.id);
     req.flash('success_msj', 'Producto borrada correctamente');
     res.redirect('/notes/edit');
});

module.exports = router;