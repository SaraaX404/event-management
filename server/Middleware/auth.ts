import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../Modals/User';

export const authenticate = async (
  req: Request,
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies.token;    
    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };

    // Find user
    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Add user to request object
    req.user = {
      id: user._id
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};
