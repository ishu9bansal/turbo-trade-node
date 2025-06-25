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
                ...strategyData,
                createdBy: decoded.sub
            },
            status: 'pending',
        });

        // Send strategy to Python backend asynchronously
        axios.post(`${process.env.PYTHON_SERVER_URI}/backtest`, {
            strategy: strategyData,
            backtest_id: newBacktest._id,
            user_id: decoded.sub
        }).catch(err => {
            console.error("Python backend failed:", err.message);
            // Optionally update status to error in the DB
            Backtest.findByIdAndUpdate(newBacktest._id, {
                status: "error",
                error: "Failed to dispatch to Python backend"
            }).catch(console.error);
        });

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
        const user = await User.findOne({ sub: decoded.sub });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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
