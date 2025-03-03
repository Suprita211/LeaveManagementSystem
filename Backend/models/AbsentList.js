const mongoose = require("mongoose");

const absentListSchema = new mongoose.Schema({
    EmpID :{
        type: String,
        required: true,
        unique: true,
        ref: 'EmpMaster'
    },
    EmpName:{
        type: String,
        required: true,
    },
    DaysAbsent :{
        type: Number,
        required: true,
    },
    Month:{
        type: String,
        required: true,
    }
});

const AbsentList = mongoose.model('AbsentList', absentListSchema);

module.exports= AbsentList;
