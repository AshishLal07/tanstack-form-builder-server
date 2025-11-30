const { StatusCodes } = require('http-status-codes');
const { AppError, errorResponse } = require('../utils');
const { validateFormSubmission } = require('../services/submission-services');

async function validateSubmissionRequest(req, res, next) {
    try {
        const { formId, data } = req.body;
        if (!formId) {
            errorResponse.message = "Form id is missing incoming request";
            return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
        }
        if (!data) {
            errorResponse.message = "Data is missing incoming request";
            return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
        }

        const response = await validateFormSubmission({formId, data});
        if (!response.success) {
            throw new AppError(response.error.message, StatusCodes.BAD_REQUEST);
        }

        next();

    } catch (error) {
        if (error instanceof AppError) {
            errorResponse.message = error.message;
            return res.status(error.statusCode).json(error)

        }
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors })
    }

}

module.exports = {
    validateSubmissionRequest
}