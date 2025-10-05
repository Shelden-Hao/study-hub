const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  generateQRCode,
  checkIn,
  checkOut,
  getUserCheckIns,
  verifyQRCodeAndCheckIn
} = require('../controllers/checkIns');

const router = express.Router();

router.route('/:reservationId/qrcode').get(protect, generateQRCode);
router.route('/checkin').post(protect, checkIn);
router.route('/checkout/:checkInId').put(protect, checkOut);
router.route('/user').get(protect, getUserCheckIns);
router.route('/qrcode/verify-checkin').post(protect, verifyQRCodeAndCheckIn);

module.exports = router;