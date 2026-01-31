import 'dotenv/config';
import app from './app.js';
import connectDB from './services/db.service.js';

const PORT = process.env.PORT;  // enviroment var

await connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //  // enviroment var
