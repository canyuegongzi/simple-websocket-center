import * as mongoose from 'mongoose';

export const LineSchema = new mongoose.Schema({
  id: Number,
  userId: String,
  status: Number,
  ip: String,
  address: String,
  wsId: String,
  userName: String,
});
