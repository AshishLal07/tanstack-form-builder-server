const z = require('zod');

const FieldSchema = z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(["text", "textarea", "number", "email", "date", "checkbox", "radio", "select", "file","switch"]),
    required: z.boolean(),
    order: z.number(),
    options: z.array(z.string()).optional(),
    validation: z
        .object({
            min: z.number().optional(),
            max: z.number().optional(),
            regex: z.string().optional(),
        })
        .optional(),
    dependsOn: z.string().optional(),
    dependsOnValue: z.string().optional(),
})

const FormSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    fields: z.array(FieldSchema),
})


module.exports = FormSchema;