const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const HolidayList = require("../models/Holiday_List"); 
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
  leavestatus,getAbsentByEmpIDAndMonth,getHolidayList,Addholiday
} = require("../controllers/leaveController");

router.get("/admin/leave-requests", adminLeavePanel);

router.post("/admin/update-leave/:id", updateLeave);

router.post("/admin/approve-reject/:id", adminApporRej);

router.get("/employee/:employeeId/:leaveType", getAllLeaves);

router.post("/submit-leave", upload.array("attachments"), submitLeave);

router.get("/leavestatus", leavestatus);

router.get("/leavestatus/:empId/:month", getAbsentByEmpIDAndMonth);
router.get("/holidays/:year/:month", getHolidayList);

router.post("/holidays", Addholiday);



module.exports = router;
