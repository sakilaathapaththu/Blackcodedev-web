const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true }, // e.g. "Colombo, LK / Remote"
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
