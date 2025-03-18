const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  EmpID: { type: String, required: true }, // Ensure EmpID is present
  month: { type: String, required: true },
  income: {
    basic: { type: Number, required: true },
    da: { type: Number },
    hra: { type: Number },
    medical: { type: Number },
    convence: { type: Number},
    incentive: { type: Number },
    advance: { type: Number },
    others: { type: Number },
  },
  deductions: {
    cpf: { type: Number },
    esi: { type: Number },
    prof_tax: { type: Number },
    tds: { type: Number },
    advance: { type: Number },
    others: { type: Number },
  },
  netIncome: { type: Number, required: true },
});

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
