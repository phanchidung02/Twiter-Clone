import User from '../model/userModel.js';
import Notification from '../model/notificationModel.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

export async function getUserProfile(req, res) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        status: 'fail',
        message: 'Not user',
      });
    return res.status(200).json(user);
  } catch (err) {
    console.log(`Error in userController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

export async function followUnfollowUser(req, res) {
  try {
    const { id } = req.params;
    const userWillFollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (!userWillFollow || !currentUser)
      return res.status(400).json({
        status: 'fail',
        message: 'Not found user',
      });

    if (req.user._id === id) {
      return res.status.json({
        status: 'fail',
        message: 'You not follow yourself',
      });
    }

    const isFollowed = currentUser.following.includes(id);
    if (isFollowed) {
      currentUser.following.pull(id);
      userWillFollow.follower.pull(req.user._id);
      const sendNotification = new Notification({
        from: req.user._id,
        to: userWillFollow._id,
        type: 'unfollow',
      });
      await sendNotification.save();
    } else {
      currentUser.following.push(id);
      userWillFollow.follower.push(req.user._id);
      const sendNotification = new Notification({
        from: req.user._id,
        to: userWillFollow._id,
        type: 'follow',
      });
      await sendNotification.save();
    }

    await currentUser.save();
    await userWillFollow.save();

    return res.status(200).json({
      status: 'success',
      message: isFollowed ? 'User unfollowed' : 'User followed',
    });
  } catch (err) {
    console.log(`Error in userController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

export async function getSuggestedUsers(req, res) {
  try {
    const usersFollowedByMe = await User.findById(req.user._id).select(
      'following'
    );
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: req.user._id },
        },
      },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    return res.status(200).json({
      status: 'success',
      users: suggestedUsers,
    });
  } catch (err) {
    console.log(`Error in userController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

export async function updateUser(req, res) {
  try {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Not found',
      });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide currentPassword',
      });
    }

    if (currentPassword && newPassword) {
      const comparePassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!comparePassword)
        return res.status(400).json({
          status: 'fail',
          message: 'Password not match',
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split('/').pop().split('.')[0]
        );
      }
      const uploadProfileImg = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadProfileImg.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split('/').pop().split('.')[0]
        );
      }
      const uploadProfileImg = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadProfileImg.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    console.log(`Error in userController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}
