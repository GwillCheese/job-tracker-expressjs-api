const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);
router.get("/:id", authMiddleware, getJobById);
router.patch("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;
