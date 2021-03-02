const helpers = {};

helpers.isAuthenticated = (req, res, next) =>{
     if(req.isAuthenticated()){
          return next();
     }
     req.flash('error_msj', 'No Authorized');
     res.redirect('/users/signin');
};

helpers.randomNumber = () => {
     const possible = 'abcdefghyjklñnmopqrstuvwxyz0123456789';
     let randomnumer = 0;   
     for(let i=0; i<6; i++){
          randomnumer += possible.charAt(Math.floor(Math.random()*possible.length));
     }
     return randomnumer;
}

helpers.isAdmin = (req, res, next) => {
     if(req.user.admin){
          return next();
     }
     req.logout();
     req.flash('error_msj', 'Solo los administradores pueden ingresar');
     res.redirect('/users/signin');
}

module.exports = helpers;