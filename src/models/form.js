const { Enums } = require('../utils');

const fieldEnums = Enums.FIELD_ENUMS;


function createFormTable() {
    return `
        CREATE TABLE IF NOT EXISTS forms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `
}

function createFormFieldsTable() {
    return `
    CREATE TABLE IF NOT EXISTS fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_id INTEGER NOT NULL,

      name TEXT NOT NULL,
      label TEXT NOT NULL,

      type TEXT NOT NULL CHECK (
        type IN (
          '${fieldEnums.text}',
          '${fieldEnums.textarea}',
          '${fieldEnums.checkbox}',
          '${fieldEnums.date}',
          '${fieldEnums.email}',
          '${fieldEnums.file}',
          '${fieldEnums.number}',
          '${fieldEnums.radio}',
          '${fieldEnums.select}',
          '${fieldEnums.Switch}'
        )
      ),

      required INTEGER DEFAULT 0,
      "order" INTEGER NOT NULL,

      options TEXT,
      validation_min REAL,
      validation_max REAL,
      validation_regex TEXT,

      depends_on TEXT,
      depends_on_value TEXT,

      FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
    );
  `
} 


module.exports = {
    createFormFieldsTable,
    createFormTable
}