const express = require('express');
const { successResponse } = require('../../utils');
const formRoutes = require('./form-routes');
const submissionRoutes = require('./submission-routes');

const router = express.Router();

router.get('/info', (req, res) => {
    successResponse.message = "Api is live";
    return res.status(200).json(successResponse);
})

router.use('/forms', formRoutes);
router.use('/submissions', submissionRoutes)

module.exports = router;