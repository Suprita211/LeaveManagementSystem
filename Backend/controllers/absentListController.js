const express = require("express");
const router = express.Router();
const AbsentList = require("../models/AbsentList"); // Ensure correct path

// Create a new absent record
    const AddAbsent = async (req, res) => {
    try {
        const newAbsent = new AbsentList(req.body);
        const savedAbsent = await newAbsent.save();
        res.status(201).json(savedAbsent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all absent records
    const getAbsent = async (req, res) => {
    try {
        const absents = await AbsentList.find();
        res.json(absents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific absent record by EmpID
    const getAbsentByEmpID = async (req, res) => {
    try {
        const absent = await AbsentList.findOne({ EmpID: req.params.empId });
        if (!absent) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json(absent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get absent record by EmpID and Month
const getAbsentListByEmpIDAndMonth = async (req, res) => {
    try {
        const absent = await AbsentList.findOne({ 
            EmpID: req.params.empId,
            Month: req.params.month 
        });
        
        if (!absent) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json(absent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update an absent record
    const updateLeave = async (req, res) => {
    try {
        const updatedAbsent = await AbsentList.findOneAndUpdate(
            { EmpID: req.params.empId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAbsent) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json(updatedAbsent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an absent record
    const deleteAbsent =  async (req, res) => {
    try {
        const deletedAbsent = await AbsentList.findOneAndDelete({ EmpID: req.params.empId });
        if (!deletedAbsent) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    AddAbsent,
    getAbsent,
    getAbsentByEmpID,
    getAbsentListByEmpIDAndMonth,
    updateLeave,
    deleteAbsent
  };
  
