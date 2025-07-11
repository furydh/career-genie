const Job = require('../models/Job');
const Application = require('../models/application');
const Notification = require('../models/Notification');
const User = require('../models/User');


exports.createJob = async (req, res) => {
  try {
    const { title, company, description } = req.body;
    const job = new Job({ title, company, description, postedBy: req.user.id });
    await job.save();


    const students = await User.find({ role: 'student' });
    const notifications = students.map(student => ({
      user: student._id,
      message: `New job posted: "${title}" at ${company}`
    }));
    await Notification.insertMany(notifications);

    res.json({ message: 'Job created!', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job' });
  }
};


exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your jobs' });
  }
};


exports.getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await Application.find({ job: jobId }).populate('student', 'email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

exports.acceptApplication = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const application = await Application.findById(applicationId).populate('student');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    application.status = 'accepted';
    await application.save();

    // Create notification for the student
    await Notification.create({
      user: application.student._id,
      message: `Your application for job "${application.job}" has been accepted!`
    });

    res.json({ message: 'Application accepted!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept application' });
  }
};
