import express  from 'express';
import connectDB from './db/connect.js';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import { app , server } from './socket/socket.js';


dotenv.config();


app.use (cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({limit: '10mb'}));
app.use(cookieParser());

app.use('/api', router);

app.use('/health', (req, res) => {
  res.send('Server is running'); // Health check endpoint
});

server.listen(5000, () => {
  connectDB();
  console.log('Server is running on http://localhost:5000');
});