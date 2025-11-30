const { StatusCodes } = require('http-status-codes');
const { validators, AppError, errorResponse } = require('../utils');

const { formSchema } = validators;


async function validateFormRequest(req, res, next) {
    try {
        const response = formSchema.safeParse(req.body);
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
    validateFormRequest
}