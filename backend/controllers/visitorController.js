const User = require('../models/User');
const MeetingRequest = require('../models/MeetingRequest');

exports.listEmployees = async (req, res) => {
  const employees = await User.find({ role: 'employee' }).select('-password');
  res.json(employees);
};

exports.requestMeeting = async (req, res) => {
  const { employeeId, visitorName, contactNumber, address, nidNumber } = req.body;
  const visitorId = req.user.id;
  try {
    const meeting = await MeetingRequest.create({
      visitor: visitorId,
      employee: employeeId,
      visitorName,
      contactNumber,
      address,
      nidNumber,
    });
    res.status(201).json(meeting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getVisitorRequests = async (req, res) => {
  const requests = await MeetingRequest.find({ visitor: req.user.id }).populate('employee', 'username');
  res.json(requests);
};
