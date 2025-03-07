const mongoose = require("mongoose");

const BankModelSchema = new mongoose.Schema({
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
    bankName :{
        type: String,
        required: true,
    },
    
    Acc_no:{
        type: String,
        required: true,
    },
    IFSC_no:{
        type: String,
        required: true,
    },
    paymentMode:{
        type : String,
        required : false,
        enum: ['NEFT', 'RTGS', 'IMPS'],
    },
});

const BankSchema = mongoose.model('bankdetails', BankModelSchema);

module.exports= BankSchema;
