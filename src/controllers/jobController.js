const prisma = require("../db/prisma");

const createJob = async (req, res) => {
    try{
  const { companyName, jobTitle, status } = req.body;

  const job = await prisma.application.create({
    data: {
      companyName,
      jobTitle,
      status,
      userId: req.userId,
    },
  });

  res.status(201).json(job);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getJobs = async (req, res) => {
try{
  const jobs = await prisma.application.findMany({
    where: { userId: req.userId },
  });

  res.json(jobs);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await prisma.application.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.userId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createJob, getJobs, getJobById };
