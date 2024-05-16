import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSaveCookie } from '../utils/generateToken.js';

async function signUp(req, res) {
  try {
    const { username, fullName, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid Email',
      });
    }

    const isUsername = await User.findOne({ username });
    if (isUsername) {
      return res.status(400).json({
        status: 'fail',
        message: 'Username is existed',
      });
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is existed',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      password: hashedPassword,
      email,
    });

    if (newUser) {
      generateTokenAndSaveCookie(newUser._id, res);
      await newUser.save();
      return res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        follower: newUser.follower,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'failed',
      });
    }
  } catch (err) {
    console.log(`Error in authController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not User',
      });
    }
    const comparePassword = await bcrypt.compare(password, user?.password);
    if (!comparePassword) {
      return res.status(401).json({
        status: 'fail',
        message: 'Password not match',
      });
    }

    generateTokenAndSaveCookie(user._id, res);

    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in authController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function logout(req, res) {
  try {
    res.cookie('jwt', '');
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in authController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.log(`Error in authController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

export { signUp, login, logout, getMe };
