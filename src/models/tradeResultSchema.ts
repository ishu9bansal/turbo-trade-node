// src/models/tradeResultSchema.ts
import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
    expiry: { type: Date, required: true },
    type: { type: String, enum: ["CE", "PE"], required: true },
    strike: { type: Number, required: true },
    symbol: { type: String, required: true },
    id: { type: String, required: true }
}, { _id: false });

const tradeSchema = new mongoose.Schema({
    contract: { type: contractSchema, required: true },
    quantity: { type: Number, required: true },
    transaction_type: { type: String, enum: ["BUY", "SELL"], required: true },
    entry_time: { type: Date, required: true },
    entry_price: { type: Number, required: true }
}, { _id: false });

export const tradeResultSchema = new mongoose.Schema({
    initial_capital: { type: Number, required: true },
    data: { type: [tradeSchema], required: true }
}, { _id: false });
