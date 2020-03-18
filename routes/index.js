/*declaration des constantes requises
J'essaie de sécuriser certaines routes afin que 
seuls les utilisateurs authentifiés puissent y accéder. 
J'utilise passport.js pour l'authentification.
*/
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// la page de welcome
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
