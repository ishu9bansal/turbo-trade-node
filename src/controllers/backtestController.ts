import { Request, Response } from 'express';
import { verifyToken } from '../utils/clerkVerify';
import { User } from '../models/userModel';
import { Backtest } from '../models/backtestModel';
import axios from 'axios';

export const createBacktest = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token); // Clerk ID in decoded.sub
        // const decoded = { sub: "user_2yH0JWs0UtmoeQABQtmfYtq64cU" }

        // Ensure user exists
        let user = await User.findOne({ sub: decoded.sub });
        if (!user) {
            user = await User.create({ sub: decoded.sub });
        }

        const strategyData = req.body;

        // Create initial Backtest entry with pending status
        const newBacktest = await Backtest.create({
            user_id: decoded.sub,
            strategy: {
                ...strategyData
            },
            status: 'pending',
        });

        // Send strategy to Python backend asynchronously
        postBacktest(newBacktest._id.toString(), strategyData);

        return res.status(201).json({
            message: 'Backtest queued successfully.',
            backtestId: newBacktest._id
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};

export const getUserBacktests = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token);

        // Check if user exists
        // const user = await User.findOne({ sub: decoded.sub });
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        const backtests = await Backtest.find({ user_id: decoded.sub }).sort({ created_at: -1 });

        return res.status(200).json({
            message: 'Backtests fetched successfully',
            backtests
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};


const postBacktest = async (backtest_id: string, strategy: any) => {
    try {
        console.log("Posting backtest to Python backend:", strategy);
        const response = await axios.post(`${process.env.PYTHON_SERVER_URI}/backtest`, strategy);
        console.log("Received response from Python backend for backtest_id:", backtest_id);
        // Handle response from Python backend
        if (response.status === 200) {
            throw new Error("testing error handling");
            console.log("Backtest posted successfully to Python backend:", backtest_id);
            // Update backtest status to completed
            await Backtest.findByIdAndUpdate(backtest_id, {
                status: "completed",
                results: response.data // assuming Python returns useful backtest data
            });
            console.log("Backtest updated in database:", backtest_id);
        }
        else {
            throw new Error(`Python backend returned status ${response.status}`);
        }
    } catch (err) {
        console.error("Error posting backtest to Python:", err);
        // Optionally handle error, e.g., update backtest status in DB
        await Backtest.findByIdAndUpdate(backtest_id, {
            status: "error",
            error: "Failed to dispatch to Python backend"
        });
    }
}