const { StatusCodes } = require('http-status-codes');
const { errorResponse, AppError, successResponse } = require('../utils');
const { formServices } = require('../services');

async function getForms(req, res) {
    try {
        const response = await formServices.getAllForms();
        successResponse.data = response;
        successResponse.message = "successfully Fetch the forms";
        return res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        if (error instanceof AppError) {
            errorResponse.error = error;
            return res.status(error.statusCode).json(error);

        }
        errorResponse.message = "Failed to fetch the data";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}


async function createForm(req, res) {
    try {
        const response = await formServices.createForm({
            title: req.body.title,
            description: req.body.description,
            fields: req.body.fields
        });
        successResponse.data = response;
        successResponse.message = "successfully created the form";
        return res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        if (error instanceof AppError) {
            errorResponse.error = error;
            return res.status(error.statusCode).json(error);

        }
        errorResponse.message = "Failed to create the form";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Database error' });
    }
}


module.exports = {
    createForm,
    getForms
}