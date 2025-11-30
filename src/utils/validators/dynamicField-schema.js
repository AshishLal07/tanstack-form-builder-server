const { z } = require("zod");
const { FIELD_ENUMS } = require('../Enum');
const { text, textarea, email, checkbox, date, file, number, radio, select, Switch } = FIELD_ENUMS;

function buildFieldSchema(fields) {
    const shape = {};

    fields.forEach(function (field) {
        switch (field.type) {
            case text:
            case textarea:
                validator = z.string();
                break;

            case number:
                validator = z.string().refine(
                    val => !isNaN(parseInt(val)),
                    `${field.label} must be a valid number`
                );
                break;

            case email:
                validator = z.email(`${field.label} must be a valid email`);
                break;

            case date:
                validator = z.string().refine(
                    val => !isNaN(Date.parse(val)),
                    `${field.label} must be a valid date`
                );
                break;

            case Switch:
            case checkbox:
                validator = z.boolean();
                break;


            case radio:
            case select:
                validator = z.string().refine(
                    val => field.options.includes(val),
                    `${field.label} must be one of ${field.options.join(", ")}`
                );
                break;

            default:
                validator = z.any();

        }

        // Required
        if (field.required) validator = validator.min ? validator.min(1) : validator;

        // Min / Max (for number or text)
        if (field.validation_min != null) {
            if (field.type === "number") {
                validator = validator.min(field.validation_min);
            } else {
                validator = validator.refine(
                    val => val.length >= field.validation_min,
                    `${field.label} must be at least ${field.validation_min} characters`
                );
            }
        }

        if (field.validation_max != null) {
            if (field.type === "number") {
                validator = validator.max(field.validation_max);
            } else {
                validator = validator.refine(
                    val => val.length <= field.validation_max,
                    `${field.label} must be at most ${field.validation_max} characters`
                );
            }
        }

        // Regex
        if (field.validation_regex) {
            const regex = new RegExp(field.validation_regex);
            validator = validator.regex(regex, `${field.label} is invalid`);
        }

        // Optional if not required
        if (!field.required) validator = validator.optional();

        shape[field.name] = validator;

    });
    return z.object(shape);
}

module.exports = { buildFieldSchema };
