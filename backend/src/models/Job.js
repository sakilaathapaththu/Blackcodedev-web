import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    requirements: [{ type: String, required: true, trim: true, maxlength: 500 }],
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const Job = mongoose.models.Job ?? mongoose.model('Job', JobSchema);
