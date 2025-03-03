const mongoose = require("mongoose");

const holidayListSchema = new mongoose.Schema({
    month: { 
        type: String, 
        required: true 
    }, // Example: "December"
    year: { 
        type: String, 
        required: true 
    }, // Example: "2025"
    date: { 
        type: Date, 
        required: true 
    }, // Example: "2025-12-25"
    day: { 
        type: String, 
        required: true 
    }, // Example: "Monday"
    occasion: { 
        type: String, 
        required: true 
    } // Example: "Christmas"
}, { timestamps: true }); // Automatically adds createdAt & updatedAt

const HolidayList = mongoose.model("HolidayList", holidayListSchema);

module.exports = HolidayList;
