import { signToken } from '../utils/jwt.js';
import { v4 as uuid } from 'uuid';
import User from '../db_models/user.model.js';
import { sendVerificationMail } from '../mailer/auth.mailer.js';
import bcrypt from 'bcryptjs';

/* ========================= SIGNUP ========================= */

const signup = async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  if (!email || !password || !firstName || !lastName || !phone) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'User exists' });
  }

  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const user = await User.create({
    id: uuid(),
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    verificationStatus: 'PENDING',
    balance: 500
  });

  // Send verification email
  try {
    await sendVerificationMail(email, user.id);
  } catch (err) {
    console.error('Failed to send verification email:', err);

    // Rollback user in DB
    await User.deleteOne({ id: user.id });

    return res.status(500).json({
      success: false,
      error: 'Failed to send verification email'
    });
  }

  res.status(201).json({
    success: true,
    data: {
      userId: user.id,
      email: user.email,
      verificationMethod: 'email'
    }
  });
};

/* ========================= VERIFY ========================= */

const verify = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Token required'
    });
  }

  let userId;
  try {
    userId = decrypt(token);
  } catch {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Invalid token'
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      error: 'User not found'
    });
  }

  if (user.verificationStatus === 'BLOCKED') {
    return res.status(403).json({
      success: false,
      data: null,
      error: 'User is blocked'
    });
  }

  if (user.verificationStatus === 'ACTIVE') {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'User already verified'
    });
  }

  user.verificationStatus = 'ACTIVE';
  await user.save();

  return res.json({
    success: true,
    data: {
      userId: user.id,
      email: user.email,
      verificationStatus: 'ACTIVE'
    }
  });
};

/* ========================= LOGIN ========================= */

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ error: 'User name is not found' });
  if (user.verificationStatus !== 'ACTIVE') return res.status(403).json({ error: 'User not verified' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'User name is not found' });
  }

  const jwt_token = signToken(user);

  res.json({
    success: true,
    data: {
      jwt: jwt_token,
      balance: user.balance?.toString() || '0',
    }
  });
};

/* ========================= LOGOUT ========================= */

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' });
  }

  // BlacklistedToken logic - is not necessary
  // const token = authHeader.split(' ')[1];
  // await BlacklistedToken.create({ token });

  res.json({ success: true, message: 'Logged out successfully' });
};

/* ========================= ME ========================= */

const me = async (req, res) => {
  const user = await User.findOne({ id: req.user.id }).lean();

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  res.json({
    success: true,
    data: {
      profile: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        verificationStatus: user.verificationStatus,
      },
      balance: user.balance,
    },
  });
};

export default { signup, verify, login, logout, me };
