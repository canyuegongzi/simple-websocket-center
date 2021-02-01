import { Document } from 'mongoose';

export interface Line extends Document {
  readonly id: number;
  readonly userId: string;
  readonly status: number;
  readonly ip: string;
  readonly address: string;
  readonly wsId: string;
  readonly userName: string;
}
