const { StatusCodes } = require('http-status-codes');
const { submissionService } = require('../services');
const { successResponse, AppError, errorResponse } = require('../utils');

async function getSubmission(req, res) {
    try {

        const response = await submissionService.getSubmissions(req.query);
        successResponse.data = response;
        successResponse.message = "successfully fetch the submission";
        return res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        if (error instanceof AppError) {
            errorResponse.error = error;
            return res.status(error.statusCode).json(error);

        }
        errorResponse.message = "Failed to fetch the submission";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Database error' });
    }
}


async function createSubmission(req, res) {
    try {
        const { formId, data } = req.body;
        const submitData = JSON.stringify(data);

        const response = await submissionService.createSubmission({
            formId, submitData
        });
        successResponse.data = response;
        successResponse.message = "successfully created the submission";
        return res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        if (error instanceof AppError) {
            errorResponse.error = error;
            return res.status(error.statusCode).json(error);

        }
        errorResponse.message = "Failed to create the submission";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Database error' });
    }
}


module.exports = {
    getSubmission,
    createSubmission
}