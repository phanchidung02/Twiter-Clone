import jwt from 'jsonwebtoken';

export function generateTokenAndSaveCookie(id, res) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '15d',
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  });
}
