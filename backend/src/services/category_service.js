const db = require('../models');
const Category = db.Category;

class CategoryService {

  async create(data, userId) {
    const existing = await Category.findOne({ where: { name: data.name } });

    if (existing) {
      throw new Error('Category already exists');
    }

    return await Category.create({
      ...data,
      created_by: userId
    });
  }

  async findAll() {
    return await Category.findAll({
      where: { status: 'active' },
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id) {
    const category = await Category.findByPk(id);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async update(id, data, userId) {
    const category = await this.findById(id);

    await category.update({
      ...data,
      updated_by: userId
    });

    return category;
  }

  async delete(id) {
    const category = await this.findById(id);

    await category.destroy();

    return true;
  }
}

module.exports = new CategoryService();