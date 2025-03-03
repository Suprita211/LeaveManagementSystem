const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const {
  addOrUpdateSalary,
  getSalaryByEmpId,
  deleteSalary,
  addSalary,
  generateSalaryPDF,
  generateSalary,
  saveSalaries,calculateAbsentDays
} = require("../controllers/salaryController");

const router = express.Router();

// Route to download all salary slip PDFs as a ZIP
// router.get("/download-all-pdfs", async (req, res) => {
//   const pdfDir = path.join(__dirname, "../salary_pdfs"); // Directory where PDFs are stored
//   const zipFilePath = path.join(__dirname, "../salary_slips.zip");

//   // Create a ZIP file
//   const output = fs.createWriteStream(zipFilePath);
//   const archive = archiver("zip", { zlib: { level: 9 } });

//   output.on("close", () => {
//     res.download(zipFilePath, "Salary_Slips.zip", (err) => {
//       if (err) console.error("Download error:", err);
//       fs.unlinkSync(zipFilePath); // Delete zip after download
//     });
//   });

//   archive.pipe(output);

//   // Add all PDF files to ZIP
//   fs.readdir(pdfDir, (err, files) => {
//     if (err) {
//       res.status(500).json({ message: "Error reading PDF directory" });
//       return;
//     }

//     files.forEach((file) => {
//       if (file.endsWith(".pdf")) {
//         archive.file(path.join(pdfDir, file), { name: file });
//       }
//     });

//     archive.finalize();
//   });
// });

// PUT for updating or adding salary details, GET for fetching salary details
router.route("/:id/salary").post(addSalary).put(addOrUpdateSalary);
// .get(getSalaryByEmpId);
router.route("/:id/salary/:month").get(getSalaryByEmpId).delete(deleteSalary);
// router.get('/salary-slip/:id/:month', generateSalaryPDF);
router.post("/generate-salary", generateSalary);
router.post("/add-salary", saveSalaries);

router.get("/absent/:id/:month", calculateAbsentDays);
module.exports = router;
