const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    position: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    cvFilename: { type: String, required: true }, // stored file name
    cvOriginalName: { type: String, required: true } // user’s filename
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
