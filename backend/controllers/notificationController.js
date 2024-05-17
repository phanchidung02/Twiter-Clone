import User from '../model/userModel.js';
import Notification from '../model/notificationModel.js';

async function getNotifications(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    const notifications = await Notification.find({ to: user._id }).populate({
      path: 'from',
      select: 'username profileImg -_id',
    });
    await Notification.updateMany({ to: user._id }, { read: true });
    return res.json(notifications);
  } catch (err) {
    console.log(`Error in notificationController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function deleteAllNotifications(req, res) {
  try {
    await Notification.deleteMany({ to: req.user._id });
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in notificationController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const notification = await Notification.findById(id);
    if (!notification)
      return res.status(404).json({
        status: 'fail',
        message: 'Notification not found',
      });

    if (notification.to.toString() !== userId.toString()) {
      return res.status(401).json({
        status: 'fail',
        message: 'You not authorized delete this notification',
      });
    }

    await Notification.findByIdAndDelete(id);
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in notificationController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

export { getNotifications, deleteAllNotifications, deleteNotification };
