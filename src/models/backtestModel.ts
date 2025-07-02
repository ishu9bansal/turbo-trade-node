// src/models/backtestModel.ts
import mongoose from 'mongoose';
import { strategySnapshotSchema } from './strategySchema';
import { tradeResultSchema } from './tradeResultSchema';

const backtestSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    strategy: { type: mongoose.Schema.Types.Mixed, required: true }, // Embedded strategy
    results: { type: mongoose.Schema.Types.Mixed, default: null },         // Embedded result
    error: { type: String, default: null },
    status: {
        type: String,
        enum: ["pending", "error", "completed"],
        default: "pending"
    },
    job_id: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null }
});

export const Backtest = mongoose.model("Backtest", backtestSchema);
