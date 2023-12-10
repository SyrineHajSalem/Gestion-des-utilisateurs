const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const dbUrl = 'mongodb://localhost:27017/syrine';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à la base de données :'));
db.once('open', () => {
  console.log('Connexion réussie à la base de données !');
});
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: Date,
  activite: String,
  numeroTelephone: String
});

const User = mongoose.model('User', userSchema);

// Routes à ajouter ici...

app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${3000}`);
});
// Afficher tous les utilisateurs
app.get('/', async (req, res) => {
    try {
      const foundUsers = await User.find({});
      res.render('index', { users: foundUsers });
    } catch (err) {
      console.error(err);  // Afficher l'erreur dans la console
      res.status(500).send(`Erreur serveur: ${err.message}`);
    }
  });
  
  
  // Afficher le formulaire d'ajout d'utilisateur
  app.get('/ajouter', (req, res) => {
    res.render('ajouter');
  });
  
  // Ajouter un nouvel utilisateur
  app.post('/ajouter', (req, res) => {
    const newUser = new User({
      nom: req.body.nom,
      prenom: req.body.prenom,
      dateNaissance: req.body.dateNaissance,
      activite: req.body.activite,
      numeroTelephone: req.body.numeroTelephone
    });
  
    newUser.save((err) => {
      if (!err) {
        res.redirect('/');
      }
    });
  });
  
  // Supprimer un utilisateur
  app.post('/supprimer', (req, res) => {
    const userId = req.body.userId;
    User.findByIdAndRemove(userId, (err) => {
      if (!err) {
        res.redirect('/');
      }
    });
  });
  
  // Afficher le formulaire de modification d'utilisateur
  app.get('/modifier/:userId', (req, res) => {
    const userId = req.params.userId;
    User.findById(userId, (err, foundUser) => {
      res.render('modifier', { user: foundUser });
    });
  });
  
  // Modifier un utilisateur
  app.post('/modifier', (req, res) => {
    const userId = req.body.userId;
    User.findByIdAndUpdate(userId, {
      nom: req.body.nom,
      prenom: req.body.prenom,
      dateNaissance: req.body.dateNaissance,
      activite: req.body.activite,
      numeroTelephone: req.body.numeroTelephone
    }, (err) => {
      if (!err) {
        res.redirect('/');
      }
    });
  });
  