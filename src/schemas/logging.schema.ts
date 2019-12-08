import * as mongoose from 'mongoose';

export const LoggingSchema = new mongoose.Schema({
  user: String,
  operate: String,
});
