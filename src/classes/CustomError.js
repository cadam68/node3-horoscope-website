module.exports = class CustomError extends Error {
    constructor(errorCode = 'ERR', ...params) {
      // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
      super(...params);
  
      // Maintenir dans la pile une trace adéquate de l'endroit où l'erreur a été déclenchée (disponible seulement en V8)
      if(Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
      this.name = 'CustomError';
      // Informations de déboguage personnalisées
      this.errorCode = errorCode;
      this.date = new Date();
    }
  }