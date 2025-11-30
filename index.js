const express = require('express');
const cors = require('cors');
const { serverConfig } = require('./src/config')

const { db } = require('./src/config');
const routes = require('./src/routes');


const PORT = serverConfig.PORT || 3000;
const app = express();


app.use(cors({
  origin: serverConfig.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

})

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
