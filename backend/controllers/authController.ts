import { Request, Response } from 'express';
import AuthService from '../services/authService';
import NotificationService from '../services/notificationService';

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  role?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const body: RegisterBody = req.body;
      
      // Validate input
      if (!body.email || !body.password || !body.name) {
        return res.status(400).json({ message: 'Email, password, and name are required' });
      }
      
      const { user, token } = await AuthService.register(body);
      
      // Create welcome notification
      try {
        await NotificationService.create({
          userId: user.id,
          title: 'Welcome to Shaghelne!',
          message: 'Thank you for joining our platform.',
          type: 'SYSTEM'
        });
      } catch (error) {
        // Continue even if notification creation fails
        console.error('Failed to create welcome notification:', error);
      }

      return res.status(201).json({ user, token });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message === 'Email already registered') {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async login(req: Request, res: Response) {
    try {
      const body: LoginBody = req.body;
      
      // Validate input
      if (!body.email || !body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const { user, token } = await AuthService.login(body);

      return res.status(200).json({ user, token });
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async logout(req: Request, res: Response) {
    // JWT tokens are stateless, so we don't need to invalidate them on the server
    // The client should remove the token from storage
    
    return res.status(200).json({ message: 'Logged out successfully' });
  }
  
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const updatedProfile = await AuthService.updateProfile(userId, req.body);
      
      return res.status(200).json(updatedProfile);
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const body: ChangePasswordBody = req.body;
      
      // Validate input
      if (!body.oldPassword || !body.newPassword) {
        return res.status(400).json({ message: 'Old password and new password are required' });
      }
      
      const result = await AuthService.changePassword(userId, body.oldPassword, body.newPassword);
      
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error.message === 'User not found' || error.message === 'Current password is incorrect') {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async forgotPassword(req: Request, res: Response) {
    try {
      const body: ForgotPasswordBody = req.body;
      
      // Validate input
      if (!body.email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // In a real implementation, you would:
      // 1. Generate a reset token and save it to the user record
      // 2. Send an email with a link containing the token
      
      return res.status(200).json({ 
        message: 'If an account with that email exists, a password reset link has been sent' 
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async resetPassword(req: Request, res: Response) {
    try {
      const body: ResetPasswordBody = req.body;
      
      // Validate input
      if (!body.token || !body.newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
      }
      
      const result = await AuthService.resetPassword(body.token, body.newPassword);
      
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.message === 'Invalid or expired token' || error.message === 'User not found') {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async verifyEmail(req: Request, res: Response) {
    try {
      // In a real implementation, you would:
      // 1. Validate the verification token
      // 2. Update the user's email verification status
      
      return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error: any) {
      console.error('Email verification error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default AuthController; 