const express = require('express');
const {submissionMiddleware} = require('../../middlewares');
const { submissionController } = require('../../controllers');

const router = express.Router();

// GET api/v1/submissions 
router.get("/",submissionController.getSubmission);

// POST api/v1/submissions 
router.post("/",submissionMiddleware.validateSubmissionRequest, submissionController.createSubmission);


module.exports = router

