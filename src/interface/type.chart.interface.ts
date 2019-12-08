import { Document } from 'mongoose';

export interface Type extends Document {
  readonly id: number;
  readonly name: string;
  readonly code: string;
  readonly desc: string;
}
