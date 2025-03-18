const mongoose = require("mongoose");

const empMasterSchema = new mongoose.Schema(
  {
    EmpID: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
    },
    EmpName: {
      type: String,
      required: true,
      maxlength: 40,
    },
    Designation: {
      type: String,
      required: true,
      maxlength: 45,
    },
    Department: {
      type: String,
      required: true,
      maxlength: 45, // Adjust as needed
    },
    CompanyName: {
      type: String,
      required: true,
      maxlength: 70,
    },
    EmployeeEmailID: {
      type: String,
      // match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    AadharNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Aadhar number must be 12 digits"],
    },
    PANNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"],
    },

    ResidenceAddress: {
      type: String,
      required: true,
      maxlength: 180,
    },
    PrimaryContactNumber: {
      type: String,
      required: true,
    },
    SecondaryContactNumber: {
      type: String,
    },
    DateOfJoining: {
      type: Date,
      required: true,
    },
    BirthDate: {
      type: Date,
      required: true,
    },
    ML: {
      type: Number,
      default: 6,
    },
    PL: {
      timesTaken: { type: Number, default: 0 },
      daysTaken: { type: Number, default: 0 },
    },
    CL: {
      type: Number,
      default: 12,
    },
    Gender: {
      type: String,
      maxlength: 6,
    },
    MarriedStatus: {
      type: String,
      maxlength: 10,
    },
    GuardianSpouseName: {
      type: String,
      maxlength: 40,
    },
    RetirementDate: {
      type: Date,
    },
    UAN: {
      type: String,
      // required: true,
      // match: [/^\d{12}$/],
    },
    basic: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const EmpMaster = mongoose.model("EmpMaster", empMasterSchema);

module.exports = EmpMaster;
