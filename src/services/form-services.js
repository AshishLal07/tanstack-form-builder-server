const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils");
const db = require('../config/database');
const { fieldsInsertQuery, formInsertQuery, formGetQuery, fieldsGetById } = require('./queries')

async function getAllForms() {
    const query = formGetQuery();
    return await new Promise((resolve, reject) => {
        
            db.all(query, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const forms = {};

                // Transform flat rows → nested JSON { form → fields[] }
                rows.forEach(row => {
                    if (!forms[row.form_id]) {
                        forms[row.form_id] = {
                            id: row.form_id,
                            title: row.title,
                            description: row.description,
                            fields: []
                        };
                    }

                    // If a form has no fields, row.field_id will be null
                    if (row.field_id) {
                        forms[row.form_id].fields.push({
                            id: row.field_id,
                            name: row.name,
                            label: row.label,
                            type: row.type,
                            required: !!row.required,
                            order: row.order,
                            options: row.options ? JSON.parse(row.options) : [],
                            validation: {
                                min: row.validation_min,
                                max: row.validation_max,
                                regex: row.validation_regex
                            },
                            dependsOn: row.depends_on,
                            dependsOnValue: row.depends_on_value
                        });
                    }
                });
                resolve(forms)

            });

       
    })


}

async function createForm(data) {
    return new Promise((resolve, reject) => {

        const { title, description, fields } = data;


        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            // Insert the form
            const formQuery = formInsertQuery();

            db.run(formQuery, [title, description], function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                }
                const formId = this.lastID;

                const fieldQuery = fieldsInsertQuery();

                let errors = [];

                fields.forEach((f, index) => {
                    db.run(
                        fieldQuery,
                        [
                            formId,
                            f.name,
                            f.label,
                            f.type,
                            f.required ? 1 : 0,
                            f.order || index + 1,
                            f.options ? JSON.stringify(f.options) : null,
                            f.validation?.min ?? null,
                            f.validation?.max ?? null,
                            f.validation?.regex ?? null,
                            f.dependsOn ?? null,
                            f.dependsOnValue ?? null
                        ],
                        function (err) {
                            if (err) {
                                errors.push({ field: f.name, error: err.message });
                            }
                        }
                    );
                });

                setImmediate(() => {
                    if (errors.length > 0) {
                        db.run("ROLLBACK");
                        return reject(errors);
                    }

                });

                db.run("COMMIT");
                resolve(formId);

            })

        });

    })
}

function getFieldsByFormId(formId) {
    return new Promise(function (resolve, reject) {
        const formByIdQuery = fieldsGetById(formId);
        db.all(formByIdQuery, function (err, fields) {
            if (err) {
                return reject(err);
            }
            resolve(fields)
        })
    })

}

module.exports = {
    createForm,
    getAllForms,
    getFieldsByFormId
}


