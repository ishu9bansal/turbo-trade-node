import mongoose, { Document, Schema } from 'mongoose';

export interface IStrategy extends Document {
    user_id: string;
    strategyName: string;
    underlyingSymbol: string;
    optionExpiry: string;
    legs: any[];
    selectedTemplate: string;
    entryTime: string;
    entryIndicators: any[];
    exitTime: string;
    exitCriteria: any[];
    initialCapital: number;
    activeDays: string[];
    startDate: string;
    endDate: string;
    commissionPerTrade: number;
    reEnterEnabled: boolean;
    reEnterCount: number;
    idx: string;
}

const StrategySchema: Schema = new Schema({
    user_id: { type: String, required: true },
    strategyName: { type: String, required: true },
    underlyingSymbol: { type: String, required: true },
    optionExpiry: { type: String, required: true },
    legs: { type: Array, default: [] },
    selectedTemplate: { type: String },
    entryTime: { type: String },
    entryIndicators: { type: Array, default: [] },
    exitTime: { type: String },
    exitCriteria: { type: Array, default: [] },
    initialCapital: { type: Number, default: 0 },
    activeDays: { type: [String], default: [] },
    startDate: { type: String },
    endDate: { type: String },
    commissionPerTrade: { type: Number, default: 0 },
    reEnterEnabled: { type: Boolean, default: false },
    reEnterCount: { type: Number, default: 0 },
    idx: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Strategy || mongoose.model<IStrategy>('Strategy', StrategySchema);
