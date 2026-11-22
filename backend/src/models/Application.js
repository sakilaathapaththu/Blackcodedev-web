import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    position: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    cvOriginalName: { type: String, required: true },
    /** Blob pathname, used by the admin download endpoint. */
    cvPath: { type: String },
    cvAccess: { type: String, enum: ['public', 'private'], default: 'public' },
    /** Direct URL (only meaningful for public blobs / legacy records). */
    cvUrl: { type: String },
  },
  { timestamps: true },
);

ApplicationSchema.index({ createdAt: -1 });

export const Application =
  mongoose.models.Application ?? mongoose.model('Application', ApplicationSchema);
