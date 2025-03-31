var express = require('express');
const { signUp, login, createProj, saveProject, getProjects, getProject, deleteProject, editProject } = require('../controllers/userController');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", signUp); 
router.post("/login", login); 
router.post("/createProj", createProj); 
router.post("/saveProject", saveProject); 
router.post("/getProjects", getProjects); 
router.post("/getProject", getProject); 
router.post("/deleteProject", deleteProject); 
router.post("/editProject", editProject); 

module.exports = router;