const MeetingRequest = require('../models/MeetingRequest');
const QRCode = require('qrcode');

exports.getAcceptedRequestQRCode = async (req, res) => {
  const { requestId } = req.params;
  const request = await MeetingRequest.findOne({ _id: requestId, visitor: req.user.id, status: 'accepted' });
  if (!request) return res.status(404).json({ message: 'Accepted request not found' });
  const qrData = `MeetingRequest:${request._id}`;
  const qrCode = await QRCode.toDataURL(qrData);
  res.json({ qrCode });
};
