require("dotenv").config();
const express = require("express");
const Employee = require("../models/EmpMaster");
const router = express.Router();
const {
    AddAbsent,
    getAbsent,
    getAbsentByEmpID,
    updateLeave,deleteAbsent , getAbsentListByEmpIDAndMonth
} = require("../controllers/absentListController");


router.post("/add", AddAbsent);

// Admin Signup Route
router.get("/get/all", getAbsent);

// Admin Login Route
router.get("/absent/:empId", getAbsentByEmpID);

router.put("/absent/:empId", updateLeave);

router.delete("/absent/:empId", deleteAbsent);

router.get("/absent/:empId/:month", getAbsentListByEmpIDAndMonth);


module.exports = router;
