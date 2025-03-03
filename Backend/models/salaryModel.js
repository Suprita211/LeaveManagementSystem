const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  EmpID: { type: String, required: true }, // Ensure EmpID is present
  month: { type: String, required: true },
  income: {
    basic: { type: Number, required: true },
    da: { type: Number, required: true },
    hra: { type: Number, required: true },
    medical: { type: Number, required: true },
    convence: { type: Number, required: true },
    incentive: { type: Number },
    advance: { type: Number },
    others: { type: Number },
  },
  deductions: {
    cpf: { type: Number, required: true },
    esi: { type: Number, required: true },
    prof_tax: { type: Number, required: true },
    tds: { type: Number },
    advance: { type: Number },
    others: { type: Number },
  },
  netIncome: { type: Number, required: true },
});

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
