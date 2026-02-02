import 'dotenv/config';
import app from './app.js';
import connectDB from './services/db.service.js';

const PORT = process.env.PORT;

try {
  await connectDB();
} catch (err) {
  console.error('MongoDB connection failed', err);
  process.exit(1);
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
