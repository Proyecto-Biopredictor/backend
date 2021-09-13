const express = require('express');
const { getPrivateData } = require('../controllers/private'); //Aqui luego hay que cambiarlo por el home
const notesController = require('../controllers/notes-controller');
const bioprocessesController = require('../controllers/bioprocesses-controller')
const placesController = require('../controllers/places-controller');
const usersController = require('../controllers/users-controller')
const {register } = require('../controllers/auth');

const checkAuth = require('../middleware/auth');

const router = express.Router();

router.use(checkAuth);

router.get("/", getPrivateData); //Esto solo se agrega para tener algo que mostrar en el path de / en el get

router.get('/notes/:nid', notesController.getNoteById);

router.get('/user/', notesController.getNotesByUserId);

router.route("/notes").post(notesController.createNote);


router.route("/notes/:nid").patch(notesController.updateNote);
  
router.delete('/notes/:nid', notesController.deleteNote);


router.route("/bioprocess").post(bioprocessesController.createBioprocess);
router.get('/bioprocess/', bioprocessesController.getBioprocesses);
router.get('/bioprocess/:bid', bioprocessesController.getBioprocessById);
router.get('/filteredbioprocess/:uid', bioprocessesController.getFilteredBioprocesses);
router.delete('/bioprocess/:bid', bioprocessesController.deleteBioprocess);
router.patch('/bioprocess/:bid', bioprocessesController.updateBioprocess);

router.get('/users/', usersController.getUsers);
router.patch('/users/:uid', usersController.updateUser);

router.route("/register").post(register);


router.route("/place").post(placesController.createPlace);
router.get('/place/:pid', placesController.getPlaceById);
router.get('/place/', placesController.getPlaces);
router.get('/filteredplace/:bid', placesController.getFilteredPlaces);
router.get('/placebioprocess/:bid', placesController.getPlacesFromBio);
router.patch('/place/:pid', placesController.updatePlace);


module.exports = router;
