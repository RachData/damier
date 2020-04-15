const bcrypt = require('bcryptjs');
const passport = require('passport');
// chargement du modele 
const User = require('../models/User');




exports.signup = (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];//declaration d'une variable locale qui memeorise les erreurs lors de l'enregistrement de l'user

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Svp entrer tous les champs requis' });
  }

  if (password != password2) {
    errors.push({ msg: 'les deux mots de passes ne correspondent pas' });
  }
/*
  if (name.length < 256) {
    errors.push({ msg: 'la taille de champ nom ne doit pas depasser 256 caractères' });
  }*/
  if (password.length < 6 && password.length <32) {
    errors.push({ msg: 'Votre mot de passe doit contenir au minimum 8 caractères' });
  }
  if (password.length >32) {
    errors.push({ msg: 'la taille de votre mot de passe ne doit depassé plus de 32 ' });
  }
//si il ya eu des erreurs on les passe a la page register avec  name ,email etc
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email déja existants' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
//on hash le mot de passe que l'on stocke
        bcrypt.genSalt(10, (err, salt) => { //Longueur de salt à générer par défaut à 10
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser//on stocke dans la BD
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'vous etes maintenant enregistrez avec succes'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
}


exports.login= (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}

exports.logoutuser=(req, res,next) => {
  req.logout();
  req.flash('success_msg', 'Vous etes bien deconnecté');
  res.redirect('/users/login');
}