import mongoose, { Document, Schema } from 'mongoose';

export interface IStrategy extends Document {
    user_id: string;
    strategyName: string;
    config: Record<string, any>; // Flexible JSON structure
}

const StrategySchema: Schema = new Schema({
    user_id: { type: String, required: true },
    strategyName: { type: String, required: true },
    config: { type: Schema.Types.Mixed, required: true }, // Flexible JSON field
}, { timestamps: true });

export default mongoose.models.Strategy || mongoose.model<IStrategy>('Strategy', StrategySchema);
