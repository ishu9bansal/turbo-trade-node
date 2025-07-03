// src/models/backtestModel.ts
import mongoose from 'mongoose';
import { strategySnapshotSchema } from './strategySchema';
import { tradeResultSchema } from './tradeResultSchema';

const backtestSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    strategy: { type: JSON, required: true }, // Embedded strategy
    results: { type: JSON, default: null },         // Embedded result
    error: { type: String, default: null },
    status: {
        type: String,
        enum: ["pending", "error", "completed"],
        default: "pending"
    },
    job_id: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export const Backtest = mongoose.model("Backtest", backtestSchema);
