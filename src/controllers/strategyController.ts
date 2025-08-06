import { Request, Response } from 'express';
import Strategy from '../models/strategyModel';
import { verifyToken } from '../utils/clerkVerify';

// GET /strategies -> Fetch all strategies of user
export const getUserStrategies = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token);
        // const decoded = { sub: "user_2yH0JWs0UtmoeQABQtmfYtq64cU" };

        const strategies = await Strategy.find({ user_id: decoded.sub });

        return res.status(200).json({ strategies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch strategies', error });
    }
};

// POST /strategies -> Save new strategy
export const createStrategy = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token);
        // const decoded = { sub: "user_2yH0JWs0UtmoeQABQtmfYtq64cU" };

        const strategyData = req.body;

        const newStrategy = await Strategy.create({
            user_id: decoded.sub,
            ...strategyData
        });

        return res.status(201).json({ message: 'Strategy saved successfully', strategy: newStrategy });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to save strategy', error });
    }
};

// PUT /strategies/:id -> Update existing strategy
export const updateStrategy = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token);
        // const decoded = { sub: "user_2yH0JWs0UtmoeQABQtmfYtq64cU" };

        const { id } = req.params;
        const strategyData = req.body;

        const strategy = await Strategy.findOne({ _id: id, user_id: decoded.sub });

        if (!strategy) {
            return res.status(404).json({ message: 'Strategy not found' });
        }

        Object.assign(strategy, strategyData);
        await strategy.save();

        return res.status(200).json({ message: 'Strategy updated successfully', strategy });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update strategy', error });
    }
};
