import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { Role, UserDocument } from '../models/User';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateProfileInput {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  location?: any;
  skills?: string[];
}

class AuthService {
  static async generateToken(userId: string): Promise<string> {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
  }

  static async register(input: RegisterInput) {
    const { email, password, name, role } = input;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || Role.USER
    });

    // Generate token
    const token = await this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  static async login(input: LoginInput) {
    const { email, password } = input;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = await this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await User.findByIdAndUpdate(
      userId,
      { ...data },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      location: user.location,
      skills: user.skills
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update user's password
      const user = await User.findByIdAndUpdate(
        decoded.userId,
        { password: hashedPassword },
        { new: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    return { message: 'Password changed successfully' };
  }
}

export default AuthService; 