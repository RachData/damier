const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');

const { ensureAuthenticated ,forwardAuthenticated } = require('../config/auth');

// on definit la route vers la page d'aceuill en s'assurant que l'user s'est authentifié
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// on definit la route vers la page de connexion en s'assurant que l'user s'est authentifié
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//router.get('/Echiquier.html',(req,res)=>res.sendFile('Echiquier.html'));

var path = require('path');
router.get('/Echiquier.html', ensureAuthenticated,(req,res) => res.sendFile(path.resolve('views/Echiquier/Echiquier.html')));


// Logout
router.get('/logout', usersCtrl.logoutuser);


// c'est a ce niveau que ce fait la gestion du formulaire

router.post('/register',usersCtrl.signup);

// Login
router.post('/login',usersCtrl.login);

module.exports = router;
