const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Employee = require("../models/EmpMaster");
const CustomizeLeave = require("../models/customizeLeave");

const { sendLeaveDecisionNotification } = require("../utils/email");
const { sendLeaveRequestNotification } = require("../utils/email"); // Nodemailer utility

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

const getAllLeaves = async (req, res) => {
  try {
    const { employeeId, leaveType } = req.params;
    const employee = await Employee.findOne({ EmpID: employeeId });

    if (employee) {
      let leaveBalance;
      let plTimesTaken = 0; // Changed from SL to PL

      if (leaveType === "CL") {
        leaveBalance = employee.CL;
      } else if (leaveType === "ML") {
        leaveBalance = employee.ML;
      } else if (leaveType === "PL") {
        // Changed from SL to PL
        plTimesTaken = employee.PL.timesTaken || 0; // Changed from SL to PL
      }

      return res.json({
        exists: true,
        name: employee.EmpName,
        designation: employee.Designation, // Added designation
        leaveBalance: leaveBalance || undefined,
        plTimesTaken, // Changed from SL to PL
      });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ exists: false, message: "Error fetching employee details" });
  }
};

const submitLeave = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      leaveType,
      fromDate,
      toDate,
      numOfDays,
      reason,
      designation,
    } = req.body;

    const fromDateParsed = new Date(fromDate);
    const toDateParsed = new Date(toDate);

    const attachments = Array.isArray(req.files)
      ? req.files.map((file) => file.path)
      : [];

    if (
      !employeeId ||
      !name ||
      !leaveType ||
      !fromDate ||
      !toDate ||
      !numOfDays ||
      !reason ||
      !designation
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (leaveType === "ML" && numOfDays > 2 && attachments.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Attachment is required for ML leave when number of days is greater than 2",
        });
    }

    if (leaveType === "PL" && attachments.length === 0) {
      // Changed from SL to PL
      return res
        .status(400)
        .json({
          success: false,
          message: "Attachment is required for PL leave",
        }); // Changed from SL to PL
    }

    if (leaveType === "CL" && attachments.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Attachment should not be added for CL leave",
        });
    }

    if (toDateParsed < fromDateParsed) {
      return res
        .status(400)
        .json({
          success: false,
          message: "To date must be greater than or equal to From date",
        });
    }

    const employee = await Employee.findOne({ EmpID: employeeId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const leaveBalance = {
      CL: employee.CL, // Casual Leave Balance
      ML: employee.ML, // Medical Leave Balance
      PL: {
        daysTaken: employee.PL.daysTaken, // Privilege Leave Days Taken (PL instead of SL)
        timesTaken: employee.PL.timesTaken, // Privilege Leave Times Taken (PL instead of SL)
      },
    };

    const leaveRequest = new CustomizeLeave({
      employeeId,
      name,
      leaveType,
      fromDate,
      toDate,
      numOfDays,
      reason,
      designation,
      attachments,
    });

    await leaveRequest.save();

    try {
      await sendLeaveRequestNotification(leaveRequest, leaveBalance);
    } catch (error) {
      console.error("Error sending leave request notification:", error);
    }

    return res.json({
      success: true,
      message: "Leave request submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting leave request",
      error: error.message || error,
    });
  }
};

const adminLeavePanel = async (req, res) => {
  try {
    const leaveRequests = await CustomizeLeave.find({
      approvalStatus: "Pending",
    }); // Only pending leave requests
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leave requests" });
  }
};

const updateLeave = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      numOfDays,
      reason,
      designation,
      reportingHeadSignature,
      reportingHeadReason,
      sanctioningAuthoritySignature,
      sanctioningAuthorityReason,
    } = req.body;

    if (!designation) {
      return res.status(400).json({ message: "Designation is required" });
    }

    const leaveRequest = await CustomizeLeave.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leaveRequest.fromDate = fromDate;
    leaveRequest.toDate = toDate;
    leaveRequest.numOfDays = numOfDays;
    leaveRequest.reason = reason;
    leaveRequest.designation = designation;

    leaveRequest.reportingHeadSignature = reportingHeadSignature;
    leaveRequest.reportingHeadReason = reportingHeadReason;
    leaveRequest.sanctioningAuthoritySignature = sanctioningAuthoritySignature;
    leaveRequest.sanctioningAuthorityReason = sanctioningAuthorityReason;

    await leaveRequest.save();

    console.log("After Update:", leaveRequest);
    res.status(200).json({ message: "Leave request updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const adminApporRej = async (req, res) => {
  try {
    const leaveRequest = await CustomizeLeave.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const {
      status,
      reportingHeadSignature,
      reportingHeadReason,
      sanctioningAuthoritySignature,
      sanctioningAuthorityReason,
    } = req.body;

    if (status !== "Approved" && status !== "Rejected") {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    leaveRequest.approvalStatus = status;
    leaveRequest.notified = true;
    leaveRequest.reportingHeadSignature = reportingHeadSignature;
    leaveRequest.reportingHeadReason = reportingHeadReason;
    leaveRequest.sanctioningAuthoritySignature = sanctioningAuthoritySignature;
    leaveRequest.sanctioningAuthorityReason = sanctioningAuthorityReason;

    await leaveRequest.save();

    if (status === "Approved") {
      const employee = await Employee.findOne({
        EmpID: leaveRequest.employeeId,
      });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      if (typeof employee.PL !== "object" || Array.isArray(employee.PL)) {
        employee.PL = { timesTaken: 0, daysTaken: 0 };
      }

      const { timesTaken, daysTaken } = employee.PL;
      const numOfDays = leaveRequest.numOfDays;

      if (isNaN(numOfDays) || numOfDays <= 0) {
        return res.status(400).json({ message: "Invalid number of days" });
      }

      switch (leaveRequest.leaveType) {
        case "CL":
          employee.CL = Math.max(0, employee.CL - numOfDays);
          break;
        case "ML":
          employee.ML = Math.max(0, employee.ML - numOfDays);
          break;
        case "PL": // Changed from SL to PL
          employee.PL = {
            timesTaken: timesTaken + 1, // Increment timesTaken by 1
            daysTaken: daysTaken + numOfDays, // Add the requested days
          };
          break;
        default:
          return res.status(400).json({ message: "Invalid leave type" });
      }

      await employee.save();
    }

    await sendLeaveDecisionNotification(leaveRequest);

    res
      .status(200)
      .json({ message: "Leave request updated and employee notified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllLeaves,
  submitLeave,
  adminLeavePanel,
  updateLeave,
  adminApporRej,
};
