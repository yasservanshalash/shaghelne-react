import User, { Role, UserDocument } from '../models/User';

interface SearchCriteria {
  name?: string;
  skills?: string[];
  location?: any;
  role?: Role;
}

class UserService {
  static async getById(userId: string) {
    const user = await User.findById(userId);
    
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
      profileImage: user.profileImage,
      location: user.location,
      skills: user.skills,
      rating: user.rating,
      totalReviews: user.totalReviews,
      completedJobs: user.completedJobs,
      isVerified: user.isVerified
    };
  }
  
  static async getProfile(userId: string) {
    return this.getById(userId);
  }
  
  static async updateProfile(userId: string, data: any) {
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
      profileImage: user.profileImage,
      location: user.location,
      skills: user.skills,
      rating: user.rating,
      totalReviews: user.totalReviews,
      completedJobs: user.completedJobs,
      isVerified: user.isVerified
    };
  }
  
  static async uploadProfileImage(userId: string, imageUrl: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user.id,
      profileImage: user.profileImage
    };
  }
  
  static async searchUsers(criteria: SearchCriteria) {
    let query: any = {};
    
    if (criteria.name) {
      query.name = { $regex: criteria.name, $options: 'i' };
    }
    
    if (criteria.skills && criteria.skills.length > 0) {
      query.skills = { $in: criteria.skills };
    }
    
    if (criteria.location) {
      if (criteria.location.city) {
        query['location.city'] = criteria.location.city;
      }
      if (criteria.location.subCity) {
        query['location.subCity'] = criteria.location.subCity;
      }
    }
    
    if (criteria.role) {
      query.role = criteria.role;
    }
    
    const users = await User.find(query);
    
    return users.map(user => ({
      id: user.id,
      name: user.name,
      role: user.role,
      bio: user.bio,
      profileImage: user.profileImage,
      location: user.location,
      skills: user.skills,
      rating: user.rating,
      totalReviews: user.totalReviews,
      completedJobs: user.completedJobs,
    }));
  }
  
  static async getPortfolio(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.portfolio;
  }
  
  static async updatePortfolio(userId: string, portfolio: any[]) {
    const user = await User.findByIdAndUpdate(
      userId,
      { portfolio },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.portfolio;
  }
  
  static async getFreelancers(filters: any) {
    let query: any = { role: Role.FREELANCER };
    
    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $in: filters.skills };
    }
    
    if (filters.location) {
      if (filters.location.city) {
        query['location.city'] = filters.location.city;
      }
    }
    
    if (filters.rating) {
      query.rating = { $gte: filters.rating };
    }
    
    const freelancers = await User.find(query);
    
    return freelancers.map(user => ({
      id: user.id,
      name: user.name,
      bio: user.bio,
      profileImage: user.profileImage,
      location: user.location,
      skills: user.skills,
      rating: user.rating,
      totalReviews: user.totalReviews,
      completedJobs: user.completedJobs,
    }));
  }
}

export default UserService; 