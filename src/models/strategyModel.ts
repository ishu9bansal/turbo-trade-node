// src/models/strategyModel.ts
import mongoose from "mongoose";

const legSchema = new mongoose.Schema({
    strike: {
        offset: { type: Number, required: true }
    },
    type: { type: String, enum: ["CE", "PE"], required: true },
    transaction: { type: String, enum: ["BUY", "SELL"], required: true }
}, { _id: false });

const expirySchema = new mongoose.Schema({
    weekday: { type: Number, required: true },  // 0-6 (Sun-Sat)
    frequency: { type: String, enum: ["WEEKLY", "MONTHLY"], required: true }
}, { _id: false });

const focusSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    step: { type: Number, required: true },
    expiry: { type: expirySchema, required: true }
}, { _id: false });

const entryExitSchema = new mongoose.Schema({
    time: { type: String, required: true },
    movement: { type: Number } // optional for entry, required for exit
}, { _id: false });

const positionSchema = new mongoose.Schema({
    entry: { type: entryExitSchema, required: true },
    exit: { type: entryExitSchema, required: true },
    per_day_positions_threshold: { type: Number, required: true },
    focus: { type: focusSchema, required: true },
    legs: { type: [legSchema], required: true }
}, { _id: false });

const strategySchema = new mongoose.Schema({
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    capital: { type: Number, required: true },
    lot_size: { type: Number, required: true },
    position: { type: positionSchema, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Strategy = mongoose.model("Strategy", strategySchema);