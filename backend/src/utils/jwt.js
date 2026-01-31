import jwt from 'jsonwebtoken';

/**
 * Sign JWT
 * @param {string} user - User identifier
 * @returns {string} JWT
 */
export const signToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email }, // <--- sub and email directly
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION_TIME }
  );
/**
 * Verify JWT
 * @param {string} token
 * @returns {object} decoded payload
 * @throws jwt.JsonWebTokenError | jwt.TokenExpiredError
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
