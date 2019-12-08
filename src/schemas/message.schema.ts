import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  id: Number,
  content: String,
  type: String,
  to: String,
  from: String,
  time: Date,
  user: String,
  operate: String,
  // 消息状态
  status: String,
});
