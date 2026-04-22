const User = require('../models/User');
const MeetingRequest = require('../models/MeetingRequest');

exports.getOverview = async (req, res) => {
  const [employeeCount, visitorCount, totalRequests, pending, accepted, rejected] = await Promise.all([
    User.countDocuments({ role: 'employee' }),
    User.countDocuments({ role: 'visitor' }),
    MeetingRequest.countDocuments(),
    MeetingRequest.countDocuments({ status: 'pending' }),
    MeetingRequest.countDocuments({ status: 'accepted' }),
    MeetingRequest.countDocuments({ status: 'rejected' }),
  ]);

  res.json({
    employeeCount,
    visitorCount,
    totalRequests,
    pending,
    accepted,
    rejected,
  });
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select('username role').lean();
  const usersWithCounts = await Promise.all(users.map(async (user) => {
    const requests = await MeetingRequest.countDocuments(user.role === 'visitor' ? { visitor: user._id } : { employee: user._id });
    return {
      ...user,
      requests,
      status: 'active',
    };
  }));
  res.json(usersWithCounts);
};

exports.getRequests = async (req, res) => {
  const requests = await MeetingRequest.find().sort({ createdAt: -1 })
    .populate('visitor', 'username')
    .populate('employee', 'username');
  res.json(requests);
};

exports.validateQr = async (req, res) => {
  const { qrData } = req.body;
  if (!qrData || typeof qrData !== 'string') {
    return res.status(400).json({ valid: false, message: 'Invalid QR payload' });
  }

  const match = qrData.match(/^MeetingRequest:([a-fA-F0-9]{24})$/);
  if (!match) {
    return res.status(400).json({ valid: false, message: 'Unsupported QR code format' });
  }

  const requestId = match[1];
  const request = await MeetingRequest.findById(requestId)
    .populate('visitor', 'username')
    .populate('employee', 'username');

  if (!request) {
    return res.status(404).json({ valid: false, message: 'Request not found' });
  }

  const valid = request.status === 'accepted';
  res.json({
    valid,
    status: request.status,
    request: {
      id: request._id,
      visitor: request.visitor?.username,
      employee: request.employee?.username,
      visitorName: request.visitorName,
      contactNumber: request.contactNumber,
      address: request.address,
      nidNumber: request.nidNumber,
      createdAt: request.createdAt,
    },
  });
};
