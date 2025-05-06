import { Request, Response } from 'express';
import User from '../models/User';

class UserController {
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error: any) {
      console.error('Get user error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error: any) {
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name, email, bio, skills, location, hourlyRate, languages } = req.body;
      
      // Find and update user
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update fields if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (bio !== undefined) user.bio = bio;
      if (skills) user.skills = skills;
      if (location) user.location = location;
      if (hourlyRate) user.hourlyRate = hourlyRate;
      if (languages) user.languages = languages;
      
      await user.save();
      
      // Return updated user without password
      const updatedUser = await User.findById(userId).select('-password');
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async uploadProfileImage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { imageUrl } = req.body;
      
      // Validate input
      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }
      
      // Find and update user
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      user.profileImage = imageUrl;
      await user.save();
      
      return res.status(200).json({ 
        message: 'Profile image updated successfully',
        profileImage: imageUrl
      });
    } catch (error: any) {
      console.error('Upload profile image error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async searchUsers(req: Request, res: Response) {
    try {
      const { name, skills, city, role } = req.query;
      
      const query: any = {};
      
      if (name) {
        query.name = { $regex: name as string, $options: 'i' };
      }
      
      if (skills) {
        const skillsArray = (skills as string).split(',').map(skill => skill.trim());
        query.skills = { $in: skillsArray };
      }
      
      if (city) {
        query['location.city'] = { $regex: city as string, $options: 'i' };
      }
      
      if (role) {
        query.role = role;
      }
      
      const users = await User.find(query).select('-password');
      
      return res.status(200).json(users);
    } catch (error: any) {
      console.error('Search users error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getPortfolio(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId).select('portfolio');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user.portfolio || []);
    } catch (error: any) {
      console.error('Get portfolio error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async updatePortfolio(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { portfolio } = req.body;
      
      // Validate input
      if (!portfolio || !Array.isArray(portfolio)) {
        return res.status(400).json({ message: 'Valid portfolio array is required' });
      }
      
      // Find and update user
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      user.portfolio = portfolio;
      await user.save();
      
      return res.status(200).json(portfolio);
    } catch (error: any) {
      console.error('Update portfolio error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getFreelancers(req: Request, res: Response) {
    try {
      const { skills, city, rating } = req.query;
      
      const query: any = { role: 'FREELANCER' };
      
      if (skills) {
        const skillsArray = (skills as string).split(',').map(skill => skill.trim());
        query.skills = { $in: skillsArray };
      }
      
      if (city) {
        query['location.city'] = { $regex: city as string, $options: 'i' };
      }
      
      if (rating) {
        const minRating = parseFloat(rating as string);
        if (!isNaN(minRating)) {
          query.rating = { $gte: minRating };
        }
      }
      
      const freelancers = await User.find(query).select('-password');
      
      return res.status(200).json(freelancers);
    } catch (error: any) {
      console.error('Get freelancers error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default UserController; 