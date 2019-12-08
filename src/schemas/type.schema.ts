import * as mongoose from 'mongoose';

export const TypeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  desc: String,
  code: String,
});
