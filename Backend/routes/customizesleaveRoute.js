const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
// Set up file storage using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File renaming
  },
});
const upload = multer({ storage });

const {
  getAllLeaves,
  submitLeave,
  adminLeavePanel,
  updateLeave,
  adminApporRej,
  leavestatus,
} = require("../controllers/leaveController");

router.get("/admin/leave-requests", adminLeavePanel);

router.post("/admin/update-leave/:id", updateLeave);

router.post("/admin/approve-reject/:id", adminApporRej);

router.get("/employee/:employeeId/:leaveType", getAllLeaves);

router.post("/submit-leave", upload.array("attachments"), submitLeave);
// router.get("/leavestatus", async (req, res) => {
//   try {
//     const approvedLeaves = await CustomizeLeave.find({ approvalStatus: "Approved" }).select(
//       "employeeId name designation leaveType numOfDays approvalStatus createdAt"
//     );

//     if (!approvedLeaves.length) {
//       return res.status(404).json({ message: "No approved leave applications found" });
//     }

//     res.json(approvedLeaves);
//   } catch (error) {
//     console.error("Error fetching approved leaves:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/leavestatus", leavestatus);

module.exports = router;
