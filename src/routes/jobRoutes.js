const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getJobById } = require("../controllers/jobController");
const { 
    
    createJob, 
    getJobs,
    getJobById
} = require("../controllers/jobController");

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);
router.get("/:id", authMiddleware, getJobById);

module.exports = router;
