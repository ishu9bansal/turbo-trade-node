// src/controllers/pythonProxyController.ts
import { Request, Response } from 'express';
import { verifyToken } from '../utils/clerkVerify';
import axios from 'axios';

export const getContracts = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        await verifyToken(token); // Ensure the user is authenticated

        const response = await axios.get(`${process.env.PYTHON_SERVER_URI}/contracts/NIFTY`);
        console.log(response);
        return res.status(200).json(response.data);

    } catch (err: any) {
        console.error('Error proxying contracts:', err.message);
        return res.status(500).json({ message: 'Error fetching contracts', error: err.message });
    }
};

export const getConfig = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        await verifyToken(token); // Check token

        const response = await axios.get(`${process.env.PYTHON_SERVER_URI}/config`);
        return res.status(200).json(response.data);

    } catch (err: any) {
        console.error('Error proxying config:', err.message);
        return res.status(500).json({ message: 'Error fetching config', error: err.message });
    }
};
