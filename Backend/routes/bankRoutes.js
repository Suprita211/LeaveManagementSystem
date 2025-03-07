const express = require('express');
const router = express.Router();
const {addbank, updateBank, deleteBank, getBank, getBankbyID} = require('../controllers/bankController');

router.post('/addbank', addbank);
router.get('/get/bank' , getBank);
router.route('/get/:EmpID').get(getBankbyID).put(updateBank).delete(deleteBank);

module.exports = router;