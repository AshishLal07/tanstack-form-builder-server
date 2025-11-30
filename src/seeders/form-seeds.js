const { fieldsInsertQuery } = require("../services/queries");
const { Enums } = require("../utils");
const { FIELD_ENUMS } = Enums;

function seedDatabase(db) {
  db.get(`SELECT COUNT(*) as count FROM forms`, (err, row) => {
    if (err) {
      console.error("Error checking seed", err);
      return;
    }

    // Already seeded
    if (row.count > 0) {
      console.log("✓ Database already seeded.");
      return;
    }

    console.log("🌱 Seeding initial database...");

    db.serialize(() => {
      // Insert a sample form
      db.run(
        `INSERT INTO forms (title, description)
                 VALUES (?, ?)`,
        ["Employee Onboarding Form", "Collect employee onboarding details"],
        function (err) {
          if (err) return console.error("Error seeding form", err);

          const formId = this.lastID;

          // Insert fields for this form
          const fields = [
            {
              name: "fullName",
              label: "Full Name",
              type: FIELD_ENUMS.text,
              required: 1,
              order: 0,
              options: null,
              validation_min: null,
              validation_max: null,
              validation_regex: null
            },
            {
              name: "email",
              label: "Email Address",
              type: FIELD_ENUMS.email,
              required: 1,
              order: 1,
              options: null
            },
            {
              name: "age",
              label: "Age",
              type: FIELD_ENUMS.number,
              required: 0,
              order: 2,
              validation_min: 18,
              validation_max: 60
            },
            {
              name: "department",
              label: "Department",
              type: FIELD_ENUMS.select,
              required: 1,
              order: 3,
              options: ["HR", "Engineering", "Sales"]
            },
            {
              name: "startDate",
              label: "Start Date",
              type: FIELD_ENUMS.date,
              required: 1,
              order: 4
            },
            {
              name: "newsletter",
              label: "Subscribe to Newsletter",
              type: FIELD_ENUMS.checkbox,
              required: 0,
              order: 5
            }
          ];
          const fieldQuery = fieldsInsertQuery();



          // const insertFieldStmt = db.prepare(`
          //               INSERT INTO fields (
          //                   form_id, name, label, type, required, "order",
          //                   options, validation_min, validation_max, validation_regex
          //               )
          //               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          //           `);
          let errors = {};
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

          // insertFieldStmt.finalize();
          console.log("🌱 Seed completed!");
        }
      );
    });
  });
}


module.exports = {
  seedDatabase,
}