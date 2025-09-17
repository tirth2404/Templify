const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDb } = require('./db');

const port = process.env.PORT || 3000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 User API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });


