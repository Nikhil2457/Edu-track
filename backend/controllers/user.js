const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.course = req.body.course || user.course;
  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    course: updatedUser.course,
    role: updatedUser.role,
    isVerified: updatedUser.isVerified,
  });
});


exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const students = await User.find({ role: 'student' })
      .select('-password')
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments({ role: 'student' });
    res.json({ students, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.addStudent = asyncHandler(async (req, res) => {
  const { name, email, password, course, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({
    name,
    email,
    password,
    course,
    role: role || 'student',
  });
  res.status(201).json({ msg: 'Student added' });
});

exports.deleteStudent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role !== 'student') {
    res.status(400);
    throw new Error('Can only delete students');
  }
  await user.deleteOne();
  res.json({ msg: 'Student deleted' });
});

exports.updateStudent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role !== 'student') {
    res.status(400);
    throw new Error('Can only update students');
  }
  const emailExists = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
  if (emailExists) {
    res.status(400);
    throw new Error('Email already in use');
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.course = req.body.course || user.course;
  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    course: updatedUser.course,
    role: updatedUser.role,
    isVerified: updatedUser.isVerified,
  });
});