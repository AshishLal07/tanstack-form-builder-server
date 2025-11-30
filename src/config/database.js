const sqlite3 = require('sqlite3');
const { join } = require('path');
const { form, submission } = require('../models');
const {formSeederDB} = require('../seeders')
const db = new sqlite3.Database(join(__dirname, '../database.sqlite'));
db.serialize(() => {
  // FORMS table
  db.run(form.createFormTable());

  // FIELDS table
  db.run(form.createFormFieldsTable());
  

  // SUBMISSION table
  db.run(submission.createSubmissionTable());

  formSeederDB.seedDatabase(db);

});


module.exports = db;