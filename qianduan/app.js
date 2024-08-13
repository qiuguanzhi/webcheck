import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

let dbConnection;

async function connectToDatabase() {
  try {
    dbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Shule543279448',
      database: 'username'
    });
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

app.use(bodyParser.json());
app.post('/api/create_user', async (req, res) => {
  const { username } = req.body;

  try {
    const [results, _] = await dbConnection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (results.length > 0) {
      return res.json({ error: 'Username already exists' });
    }

    await dbConnection.execute(
      'INSERT INTO users (username) VALUES (?)',
      [username]
    );
    res.json({ message: 'Username submitted successfully' });
  } catch (err) {
    console.error('Database operation failed:', err);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('close', async () => {
  if (dbConnection) {
    try {
      await dbConnection.end();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing database connection:', err);
    }
  }
});