/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

/**
 * Types
 */
export interface IUser {
  email: string;
  password: string;
  role: 'user' | 'admin';
  totalVisitCount: number;
  passwordResetToken: string | null;
  refreshToken: string | null;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    role: {
      type: String,
      require: true,
      enum: {
        values: ['user', 'admin'],
        message: '`VALUE` is not supported',
      },
    },
    totalVisitCount: {
      type: Number,
      default: 0,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<IUser>('User', userSchema);

export default User;
