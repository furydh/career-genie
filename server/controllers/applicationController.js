// server/controllers/applicationController.js
const Application = require('../models/application');

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    // Only prevent duplicate application to the SAME job
    const existing = await Application.findOne({ job: jobId, student: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this job.' });
    }
    const application = new Application({
      job: jobId,
      student: req.user.id,
      resumeUrl
    });
    await application.save();
    res.json({ message: 'Application submitted!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply to job.' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    console.error('getMyApplications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
