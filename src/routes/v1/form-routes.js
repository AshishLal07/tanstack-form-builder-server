const express = require('express');
const { formController } = require('../../controllers');
const { formMiddleware } = require('../../middlewares');


const router = express.Router();

// api/v1/forms 
router.get("/",  formController.getForms);

// api/v1/forms 
router.post("/", formMiddleware.validateFormRequest, formController.createForm);


module.exports = router