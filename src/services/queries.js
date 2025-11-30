/** Forms Queries */

function fieldsInsertQuery() {
  return `
                 INSERT INTO fields (
                    form_id, name, label, type, required, "order", options,
                    validation_min, validation_max, validation_regex,
                    depends_on, depends_on_value
                )
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `
}


function formInsertQuery() {
  return `INSERT INTO forms (title, description) VALUES (?, ?)`
}

function formGetQuery() {
  return `
    SELECT 
      f.id AS form_id,
      f.title,
      f.description,
      f.created_at,

      fld.id AS field_id,
      fld.name,
      fld.label,
      fld.type,
      fld.required,
      fld."order",
      fld.options,
      fld.validation_min,
      fld.validation_max,
      fld.validation_regex,
      fld.depends_on,
      fld.depends_on_value

    FROM forms f
    LEFT JOIN fields fld
      ON f.id = fld.form_id
    ORDER BY f.id, fld."order";
  `;

}

function fieldsGetById(formId) {
  return `SELECT * FROM fields WHERE form_id = ${formId} ORDER BY \"order\" ASC`;
}


function formGetById(formId) {
  return `SELECT * as count FROM submissions WHERE form_id = ${formId}`;
}



function formCountGetById(formId) {
  return `SELECT COUNT(*) as count FROM submissions WHERE form_id = ${formId}`;
}

function formPaginatedData(data) {
  const {  sortBy, sortOrder } = data;
  return `SELECT * FROM submissions WHERE form_id = ? ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`
}

/** Submission Queries */

function submissionInsertQuery() {
  return 'INSERT INTO submissions (id, form_id, data) VALUES (?, ?, ?)'
}

module.exports = {
  fieldsInsertQuery,
  formInsertQuery,
  formGetQuery,
  fieldsGetById,
  formGetById,
  formCountGetById,
  formPaginatedData,
  submissionInsertQuery
}