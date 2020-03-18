/*
dans cette partie on permet à la fonction ensureAuthenticated et forwardAuthenticated d'etre visible dans les autres 
packages en gros ces deux fonctions assurent que l'utilisateur s'est authentifié avant d'acceder aux ressources 

*/
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  }
};
