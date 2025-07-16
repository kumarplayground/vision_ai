import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  buyLink: string;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  buyLink: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
