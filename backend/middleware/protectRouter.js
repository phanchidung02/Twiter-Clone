import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
export async function protectRouter(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You not log in',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not Token',
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Not user',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(`Error in protectRouter: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}
