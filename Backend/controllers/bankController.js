const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BankSchema = require("../models/BankModel");

// Create Bank Details (POST)
const addbank =  async (req, res) => {
  try {
    const newBankDetail = new BankSchema(req.body);
    const savedBankDetail = await newBankDetail.save();
    res.status(201).json( savedBankDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read All Bank Details (GET)
const getBank =  async (req, res) => {
  try {
    const bankDetails = await BankSchema.find();
    res.status(200).json(bankDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Single Bank Detail by EmpID (GET)
const getBankbyID = async (req, res) => {
  try {
    const bankDetail = await BankSchema.findOne({ EmpID: req.params.EmpID });
    if (!bankDetail) {
      return res.status(404).json({ message: "Bank details not found" });
    }
    res.status(200).json(bankDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Bank Details by EmpID (PUT)
const updateBank= async (req, res) => {
  try {
    const updatedBankDetail = await BankSchema.findOneAndUpdate(
      { EmpID: req.params.EmpID },
      req.body,
      { new: true }
    );
    if (!updatedBankDetail) {
      return res.status(404).json({ message: "Bank details not found" });
    }
    res.status(200).json(updatedBankDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Bank Details by EmpID (DELETE)
const deleteBank =  async (req, res) => {
  try {
    const deletedBankDetail = await BankSchema.findOneAndDelete({
      EmpID: req.params.EmpID,
    });
    if (!deletedBankDetail) {
      return res.status(404).json({ message: "Bank details not found" });
    }
    res.status(200).json({ message: "Bank details deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    addbank,getBank,updateBank,deleteBank,getBankbyID
};
