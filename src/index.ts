import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import strategyRoutes from './routes/strategyRoutes';
import pythonRoutes from "./routes/pythonRoutes"

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // replace with your frontend's actual origin
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/backtests', strategyRoutes);
app.use('/python', pythonRoutes);

// Connect to DB & Start Server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected');

        const port = process.env.PORT || 5000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

startServer();
