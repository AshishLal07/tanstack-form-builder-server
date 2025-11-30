function createSubmissionTable() {
    return `
        CREATE TABLE IF NOT EXISTS submissions (
            id TEXT PRIMARY KEY,
            form_id TEXT NOT NULL,
            data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (form_id) REFERENCES forms(id)
        )
    `
}

module.exports = {
    createSubmissionTable
}