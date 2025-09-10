const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/role');
const {
  getProfile,
  updateProfile,
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} = require('../controllers/user');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/students', protect, admin, getStudents);
router.post('/students', protect, admin, addStudent);
router.delete('/students/:id', protect, admin, deleteStudent);
router.put('/students/:id', protect, admin, updateStudent);

module.exports = router;