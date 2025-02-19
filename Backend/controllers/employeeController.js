const EmpMaster = require("../models/EmpMaster");
const Counter = require("../models/Counter");

const getEmployee = async (req, res) => {
  const { empID } = req.params;
  try {
    const employee = await EmpMaster.findOne({ EmpID: empID });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found!" });
    }
    // Return the employee details including leave balances and retirement date
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee details." });
  }
};

const updateEmployeeSingle = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Ensure date fields are formatted properly before updating
    if (updateData.DateOfJoining) {
      updateData.DateOfJoining = new Date(updateData.DateOfJoining);
    }
    if (updateData.BirthDate) {
      updateData.BirthDate = new Date(updateData.BirthDate);
    }
    if (updateData.RetirementDate) {
      updateData.RetirementDate = new Date(updateData.RetirementDate);
    }

    // Remove the retirement date calculation logic

    // Set default for CompanyName if not provided
    updateData.CompanyName = updateData.CompanyName || "N/A";

    // Find and update employee by EmpID
    const updatedEmployee = await EmpMaster.findOneAndUpdate(
      { EmpID: req.params.empID }, // Search by EmpID
      updateData, // Updated fields
      { new: true, runValidators: true } // Return the updated record & apply validation
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const employees = await EmpMaster.find({}, "-_id -__v"); // Exclude MongoDB internal fields

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    // Format dates for consistency
    const formattedEmployees = employees.map((emp) => ({
      ...emp._doc,
      DateOfJoining: emp.DateOfJoining
        ? emp.DateOfJoining.toISOString().split("T")[0]
        : "",
      BirthDate: emp.BirthDate ? emp.BirthDate.toISOString().split("T")[0] : "",
      RetirementDate: emp.RetirementDate
        ? emp.RetirementDate.toISOString().split("T")[0]
        : "",
      CL: emp.CL || 0, // Default to 0 if undefined
      ML: emp.ML || 0, // Default to 0 if undefined
      PL_timesTaken: emp.PL ? emp.PL.timesTaken : 0, // Changed SL to PL (Privilege Leave)
      PL_daysTaken: emp.PL ? emp.PL.daysTaken : 0, // Changed SL to PL (Privilege Leave)
    }));

    res.status(200).json(formattedEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await EmpMaster.findOneAndDelete({
      EmpID: req.params.empID,
    });

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res
      .status(200)
      .json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
};

const addEmployee = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log("Received employee data:", req.body);

    // Fetch and update the counter for EmpID generation
    const counter = await Counter.findOneAndUpdate(
      { name: "empID" },
      { $inc: { value: 1 } }, // Increment the counter by 1
      { new: true, upsert: true } // Create a new counter if it doesn't exist
    );

    // Generate the new EmpID based on the current counter value
    const newEmpID = counter.value.toString().padStart(4, "0"); // Format as 4 digits

    // Prepare the employee data with the generated EmpID
    const employeeData = { ...req.body, EmpID: newEmpID };

    // Create and save the new employee record in the database
    const newEmployee = new EmpMaster(employeeData);
    const savedEmployee = await newEmployee.save();

    // Return the saved employee data as a response
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error storing employee:", error);
    res
      .status(500)
      .json({ error: "Failed to store employee data", details: error.message });
  }
};

module.exports = {
  getEmployee,
  updateEmployeeSingle,
  getAllEmployee,
  deleteEmployee,
  addEmployee,
};
