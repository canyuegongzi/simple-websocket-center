import { Document } from 'mongoose';

export interface Message extends Document {
  readonly id: number;
  readonly content: string;
  readonly type: number;
  readonly to: number;
  readonly from: number;
  readonly time: Date;
  readonly user: string;
  readonly operate: string;
  readonly status: boolean;
}
