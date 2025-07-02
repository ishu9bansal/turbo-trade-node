// src/controllers/pythonProxyController.ts
import { Request, Response } from 'express';
import axios from 'axios';

export const getContracts = async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${process.env.PYTHON_SERVER_URI}/contracts/NIFTY`);
        return res.status(200).json(response.data);
    } catch (err: any) {
        console.error('Error proxying contracts:', err.message);
        return res.status(500).json({ message: 'Error fetching contracts', error: err.message });
    }
};

export const getConfig = async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${process.env.PYTHON_SERVER_URI}/config`);
        return res.status(200).json(response.data);
    } catch (err: any) {
        console.error('Error proxying config:', err.message);
        return res.status(500).json({ message: 'Error fetching config', error: err.message });
    }
};
