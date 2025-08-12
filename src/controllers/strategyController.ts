import { Request, Response } from 'express';
import Strategy from '../models/strategyModel';
import { verifyToken } from '../utils/clerkVerify';

// GET /strategies -> Fetch all strategies of user
export const getUserStrategies = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;

        if (!userId) 
            return res.status(401).json({ message: 'Unauthorized' });

        const strategies = await Strategy.find({ user_id: userId });

        return res.status(200).json({ strategies });
    } catch (error) {
        console.error('GetUserStrategies Error:', error);
        return res.status(500).json({ message: 'Failed to fetch strategies', error });
    }
};

// POST /strategies -> Save new strategy
export const createStrategy = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;

        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });

        const strategyData = req.body;

        const newStrategy = await Strategy.create({
            user_id: userId,
            ...strategyData
        });

        return res.status(201).json({ message: 'Strategy saved successfully', strategy: newStrategy });
    } catch (error) {
        console.error('CreateStrategy Error:', error);
        return res.status(500).json({ message: 'Failed to save strategy', error });
    }
};

// PUT /strategies/:id -> Update existing strategy
export const updateStrategy = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;

        if (!userId) 
            return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;
        const strategyData = req.body;

        const strategy = await Strategy.findOne({ _id: id, user_id: userId });

        if (!strategy) 
            return res.status(404).json({ message: 'Strategy not found' });

        Object.assign(strategy, strategyData);
        await strategy.save();

        return res.status(200).json({ message: 'Strategy updated successfully', strategy });
    } catch (error) {
        console.error('UpdateStrategy Error:', error);
        return res.status(500).json({ message: 'Failed to update strategy', error });
    }
};