import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    sub: string;
    strategies: mongoose.Types.ObjectId[];
    tradeResults: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    sub: { type: String, required: true, unique: true },
    strategies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Strategy" }],
    tradeResults: [{ type: mongoose.Schema.Types.ObjectId, ref: "TradeResult" }]
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
