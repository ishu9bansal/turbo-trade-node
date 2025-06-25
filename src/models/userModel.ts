import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    sub: string;
}

const userSchema = new Schema<IUser>(
    {
        sub: { type: String, required: true, unique: true }
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
