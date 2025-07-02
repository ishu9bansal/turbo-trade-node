// src/controllers/pythonProxyController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import { getCachedOrFetch } from '../utils/staticCache';

export const getContracts = async (req: Request, res: Response) => {
    try {
        const data = await getCachedOrFetch('contracts_NIFTY', async () => {
            const response = await axios.get(`${process.env.PYTHON_SERVER_URI}/contracts/NIFTY`);
            return response.data;
        });

        return res.status(200).json(data);

    } catch (err: any) {
        console.error('Error proxying contracts:', err.message);
        return res.status(500).json({ message: 'Error fetching contracts', error: err.message });
    }
};

export const getConfig = async (req: Request, res: Response) => {
    try {
        const data = await getCachedOrFetch('config_data', async () => {
            const response = await axios.get(`${process.env.PYTHON_SERVER_URI}/config`);
            return response.data;
        });

        return res.status(200).json(data);

    } catch (err: any) {
        console.error('Error proxying config:', err.message);
        return res.status(500).json({ message: 'Error fetching config', error: err.message });
    }
};
