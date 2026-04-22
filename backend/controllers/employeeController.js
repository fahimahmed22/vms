const MeetingRequest = require('../models/MeetingRequest');

exports.getRequestsForEmployee = async (req, res) => {
  const requests = await MeetingRequest.find({ employee: req.user.id })
    .populate('visitor', 'username')
    .sort({ createdAt: -1 });
  res.json(requests);
};

exports.acceptRequest = async (req, res) => {
  const { requestId } = req.body;
  const request = await MeetingRequest.findOneAndUpdate(
    { _id: requestId, employee: req.user.id },
    { status: 'accepted' },
    { new: true }
  );
  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json(request);
};

exports.rejectRequest = async (req, res) => {
  const { requestId } = req.body;
  const request = await MeetingRequest.findOneAndUpdate(
    { _id: requestId, employee: req.user.id },
    { status: 'rejected' },
    { new: true }
  );
  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json(request);
};
