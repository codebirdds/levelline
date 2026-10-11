const db = require('../models');
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize');


class ProductService {

  // 🔥 GENERATE SKU
async generateSku(category_id, categoryName) {
  const prefix = categoryName.substring(0, 3).toUpperCase();

  let sku;
  let exists = true;

  // 🔥 loop until unique SKU is found
  while (exists) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random

    sku = `${prefix}-${randomNumber}`;

    const existing = await Product.findOne({ where: { sku } });

    if (!existing) {
      exists = false;
    }
  }

  return sku;
}

  // CREATE PRODUCT
  async create(data, userId) {
    const { category_id } = data;

    // ✅ Check category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      throw new Error('Category not found');
    }

    // 🔥 AUTO GENERATE SKU (ignore incoming sku)
    const sku = await this.generateSku(category_id, category.name);

    return await Product.create({
      ...data,
      sku,
      created_by: userId
    });
  }

  // GET ALL PRODUCTS
async findAll(query) {
  const {
    page = 1,
    limit = 20,
    search = '',
    category_id,
    sortBy = 'createdAt',
    order = 'DESC'
  } = query;

  const offset = (page - 1) * limit;

  // 🔥 WHERE CONDITION
  const where = {
    status: 'active'
  };

  // 🔍 SEARCH (name + sku)
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { sku: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // 📂 CATEGORY FILTER
  if (category_id) {
    where.category_id = category_id;
  }

  // 🚀 QUERY
  const { rows, count } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, order.toUpperCase()]]
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      limit: parseInt(limit)
    }
  };
}

  // GET BY ID
  async findById(id) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // UPDATE PRODUCT
  async update(id, data, userId) {
    const product = await this.findById(id);

    // ✅ Check category if updating
    let category = null;
    if (data.category_id) {
      category = await Category.findByPk(data.category_id);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    // 🔥 Regenerate SKU if category changes
    let sku = product.sku;
    if (category) {
      sku = await this.generateSku(data.category_id, category.name);
    }

    await product.update({
      ...data,
      sku,
      updated_by: userId
    });

    return product;
  }

  // DELETE PRODUCT
  async delete(id) {
    const product = await this.findById(id);

    await product.destroy();

    return true;
  }
}

module.exports = new ProductService();