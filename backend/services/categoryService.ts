import Category, { CategoryDocument } from '../models/Category';

interface CategoryInput {
  name: string;
  description: string;
  subcategories?: string[];
  icon?: string;
}

class CategoryService {
  static async getAll() {
    return Category.find().sort({ name: 1 }).exec();
  }

  static async getById(categoryId: string) {
    return Category.findById(categoryId).exec();
  }

  static async create(data: CategoryInput) {
    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name: data.name });
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = new Category({
      name: data.name,
      description: data.description,
      subcategories: data.subcategories || [],
      icon: data.icon
    });

    return category.save();
  }

  static async update(categoryId: string, data: Partial<CategoryInput>) {
    // Check for duplicate name if name is being updated
    if (data.name) {
      const existingCategory = await Category.findOne({ 
        name: data.name,
        _id: { $ne: categoryId }
      });
      
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }
    }

    return Category.findByIdAndUpdate(
      categoryId,
      { $set: data },
      { new: true, runValidators: true }
    ).exec();
  }

  static async delete(categoryId: string) {
    return Category.findByIdAndDelete(categoryId).exec();
  }

  static async getByName(name: string) {
    return Category.findOne({ name }).exec();
  }

  static async getSubcategories(categoryId: string) {
    const category = await Category.findById(categoryId).exec();
    return category ? category.subcategories : [];
  }

  static async addSubcategory(categoryId: string, subcategory: string) {
    return Category.findByIdAndUpdate(
      categoryId,
      { $addToSet: { subcategories: subcategory } },
      { new: true }
    ).exec();
  }

  static async removeSubcategory(categoryId: string, subcategory: string) {
    return Category.findByIdAndUpdate(
      categoryId,
      { $pull: { subcategories: subcategory } },
      { new: true }
    ).exec();
  }

  static async search(query: string) {
    const regex = new RegExp(query, 'i');
    return Category.find({
      $or: [
        { name: regex },
        { description: regex },
        { subcategories: regex }
      ]
    }).sort({ name: 1 }).exec();
  }
}

export default CategoryService; 