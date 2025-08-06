import { Request, Response } from 'express';
import { verifyToken } from '../utils/clerkVerify';
import { User } from '../models/userModel';
import { Backtest } from '../models/backtestModel';
import axios from 'axios';

export const createBacktest = async (req: Request, res: Response) => {
    try {
        // Clerk user ID is already attached by authMiddleware
        const userId = req.user?.sub;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Ensure user exists
        let user = await User.findOne({ sub: userId });
        if (!user) {
            user = await User.create({ sub: userId });
        }

        const strategyData = req.body;

        // Create initial Backtest entry with pending status
        const newBacktest = await Backtest.create({
            user_id: userId,
            strategy: { ...strategyData },
            status: 'pending',
        });

        // Send strategy to Python backend asynchronously
        postBacktest(newBacktest, strategyData);

        return res.status(201).json({
            message: 'Backtest queued successfully.',
            backtestId: newBacktest._id
        });

    } catch (err) {
        console.error('CreateBacktest Error:', err);
        return res.status(500).json({
            message: 'Server error',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};

export const getUserBacktests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const backtests = await Backtest.find({ user_id: userId }).sort({ created_at: -1 });

        return res.status(200).json({
            message: 'Backtests fetched successfully',
            backtests
        });

    } catch (err) {
        console.error('GetUserBacktests Error:', err);
        return res.status(500).json({
            message: 'Server error',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};

const postBacktest = async (backtest: any, strategy: any) => {
    try {
        console.log("Posting backtest to Python backend:", strategy);
        const response = await axios.post(`${process.env.PYTHON_SERVER_URI}/backtest`, strategy);
        console.log("Received response from Python backend for backtest_id:", backtest._id);
        // Handle response from Python backend
        if (response.status === 200) {
            // throw new Error("Test error case");
            console.log("Backtest posted successfully to Python backend:", backtest._id);
            // Update backtest status to completed
            backtest.status = "completed";
            backtest.results = response.data; // assuming Python returns useful backtest data
            const saveRes = await backtest.save();
            console.log("Backtest updated in database:", saveRes);
        }
        else {
            throw new Error(`Python backend returned status ${response.status}`);
        }
    } catch (err) {
        console.error("Error posting backtest to Python:", err);
        // Optionally handle error, e.g., update backtest status in DB
        backtest.status = "error";
        backtest.error = err;
        const saveRes = await backtest.save();
        console.log("Backtest updated in database:", saveRes);
    }
}