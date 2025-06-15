import { Request, Response } from 'express';
import { verifyToken } from '../utils/clerkVerify';
import { User } from '../models/userModel';
import { Strategy } from '../models/strategyModel';
import { TradeResult } from '../models/tradeResultModel'; // <-- import TradeResult
import axios from 'axios';

export const createStrategy = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token); // Clerk ID is in decoded.sub

        // Find or create user
        let user = await User.findOne({ sub: decoded.sub });
        if (!user) {
            user = await User.create({ sub: decoded.sub, strategies: [], tradeResults: [] });
        }

        // Create strategy
        const strategy = await Strategy.create(req.body);
        user.strategies.push(strategy._id);

        // Send strategy to Python backend
        const pythonResponse = await axios.post<BacktestResponse>(`${process.env.PYTHON_SERVER_URI}/backtest`, req.body);
        const { data, initial_capital } = pythonResponse.data;

        // Create trade result
        const tradeResult = await TradeResult.create({
            user: user._id,
            strategy: strategy._id,
            initial_capital,
            data
        });

        // Link trade result to user
        user.tradeResults.push(tradeResult._id);
        await user.save();

        return res.status(201).json({
            message: 'Strategy saved, backtest result stored, and response sent to frontend.',
            tradeResult
        });

    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        } else {
            return res.status(500).json({ message: 'Server error', error: 'Unknown error' });
        }
    }
};
