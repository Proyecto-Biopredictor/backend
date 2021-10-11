const express = require('express');
const { getPrivateData } = require('../controllers/private'); //Aqui luego hay que cambiarlo por el home
const notesController = require('../controllers/notes-controller');
const bioprocessesController = require('../controllers/bioprocesses-controller');
const placesController = require('../controllers/places-controller');
const usersController = require('../controllers/users-controller');
const factorsController = require('../controllers/factors-controller');
const recordsController = require('../controllers/records-controller');
const upload_fileController = require('../controllers/upload_file-controller');
const {register } = require('../controllers/auth');
const upload = require("../middleware/upload");

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
router.get('/allUsers/', usersController.getAllUsers);
router.patch('/users/:uid', usersController.updateUser);
router.delete('/users/:uid', usersController.deleteUser);
router.get('/users/:uid', usersController.getUserById);

router.route("/register").post(register);


router.route("/place").post(placesController.createPlace);
router.get('/place/:pid', placesController.getPlaceById);
router.get('/place/', placesController.getPlaces);
router.get('/filteredplace/:bid', placesController.getFilteredPlaces);
router.get('/placebioprocess/:bid', placesController.getPlacesFromBio);
router.patch('/place/:pid', placesController.updatePlace);
router.delete('/place/:pid', placesController.deletePlace);


router.route("/factor").post(factorsController.createFactor);
router.get('/factor/', factorsController.getFactors);
router.get('/factor/:fid', factorsController.getFactorById);
router.delete('/factor/:fid/:bid', factorsController.deleteFactor);
router.patch('/factor/:fid', factorsController.updateFactor);
router.get('/factorbioprocess/:bid', factorsController.getFactorsFromBio);

router.route("/record").post(recordsController.createRecord);
router.get('/record/:bid/:pid', recordsController.getRecordsFromBioXPlace);

router.post("/upload_file", upload.single("file"), upload_fileController.saveImage);
router.get('/fetchImage/:file(*)', upload_fileController.getImage);

module.exports = router;
