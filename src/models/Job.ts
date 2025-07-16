import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  applyLink: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
