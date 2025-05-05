import { Request, Response } from 'express';
import User from '../Modals/User';
import bcryptjs from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { CookieOptions } from 'express';
import mongoose from 'mongoose';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: mongoose.Types.ObjectId;
      };
    }
  }
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const user = new User({
      id: Math.random().toString(36).substring(2, 11), // Generate random ID
      username,
      password: hashedPassword,
      name
    });

    await user.save();

    // Generate JWT token
    const token = sign(
      { id: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = sign(
      { id: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true });
};

export const getUserList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all users except the requesting user
    const users = await User.find(
      { id: { $ne: req.user?.id } },
      'id name'
    );

    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name
      }))
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const value = req.user;

    // Find user by ID      
    const user = await User.findOne({ _id: value?.id });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

