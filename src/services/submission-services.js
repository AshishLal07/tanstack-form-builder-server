const { db } = require('../config');
const { randomUUID } = require('crypto');
const { submissionInsertQuery, formCountGetById, formPaginatedData } = require("./queries");
const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');
const { validators } = require('../utils');
const { getFieldsByFormId } = require('./form-services');

const { fieldSchema } = validators;

async function getSubmissions(query) {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const sortBy = query.sortBy || 'created_at';
        const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
        const formId = query.formId || 'employee-onboarding';
        const offset = (page - 1) * limit;
        

        const data = await getPaginatedData({ formId, sortBy, sortOrder, limit, offset, page });
        return data;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR);
    }


}

function getformCountData(formId) {
    const formCountQuery = formCountGetById(formId);

    return new Promise((resolve, reject) => {
        db.get(formCountQuery, (err, countRow) => {
            if (err) {
                return reject(err);
            }

            const totalCount = countRow.count;
            resolve(totalCount)
        })
    })
}

async function getPaginatedData(data) {
    const { formId, sortBy, sortOrder, limit, offset, page } = data;

    const totalCount = await getformCountData(formId);
    const totalPages = Math.ceil(totalCount / limit);

    return new Promise(function (resolve, reject) {
        const formPaginateQuery = formPaginatedData({ sortBy, sortOrder });

        db.all(
            formPaginateQuery,
            [formId, limit, offset],
            (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const submissions = rows.map(row => ({
                    id: row.id,
                    data: JSON.parse(row.data),
                    createdAt: row.created_at
                }));

                resolve({
                    submissions,
                    pagination: {
                        page,
                        limit,
                        totalCount,
                        totalPages
                    }
                });
            }
        );

    })
}

async function createSubmission(data) {
    return new Promise((resolve, reject) => {

        const { formId, submitData } = data;
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            // Insert the submission
            const submissionQuery = submissionInsertQuery();
            const submissionId = randomUUID();

            db.run(submissionQuery, [submissionId, formId, submitData], function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                }

                const submissionId = this.lastID;

                db.run("COMMIT");
                resolve(submissionId);

            })

        });

    })
}

async function validateFormSubmission(input) {
    try {
        const { formId, data } = input;
        let fields = await getFieldsByFormId(formId);

        if (!fields.length) {
            throw new AppError("Form Field request not found", StatusCodes.NOT_FOUND);
        }
        fields = fields.map(f => ({
            ...f,
            options: f.options ? JSON.parse(f.options) : []
        }));
        const validate = fieldSchema.buildFieldSchema(fields);
        let result = validate.safeParse(data);
        if (!result.success) {
            if (result.error.issues) {
                let explanation = [];
                result.error.issues.forEach((err) => {
                    explanation.push(err.message)
                });
                throw new AppError(explanation, StatusCodes.BAD_REQUEST);

            }
        }

        return result;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;

        }
        throw new AppError("Cannot create a submission", StatusCodes.INTERNAL_SERVER_ERROR);

    }

}

module.exports = {
    getSubmissions,
    createSubmission,
    validateFormSubmission
}

