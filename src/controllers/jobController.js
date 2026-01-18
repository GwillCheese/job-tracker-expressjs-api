const prisma = require("../db/prisma");

const createJob = async (req, res) => {
    try{
  const { companyName, jobTitle, status } = req.body;

  // Required fields
  if (!companyName || !jobTitle || !status) {
    return res.status(400).json({
      message: "companyName, jobTitle, and status are required",
    });
  }

  // Status allowed values
  const allowedStatuses = ["Applied", "Interview", "Rejected", "Offer"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

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

const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const { companyName, jobTitle, status } = req.body;

    const job = await prisma.application.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.userId !== req.userId) return res.status(403).json({ message: "Access denied" });

    const data = {};
    if (companyName) data.companyName = companyName;
    if (jobTitle) data.jobTitle = jobTitle;
    if (status) {
      const allowedStatuses = ["Applied", "Interview", "Rejected", "Offer"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      data.status = status;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedJob = await prisma.application.update({
      where: { id: jobId },
      data,
    });

    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    const job = await prisma.application.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.userId !== req.userId) return res.status(403).json({ message: "Access denied" });

    await prisma.application.delete({ where: { id: jobId } });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };