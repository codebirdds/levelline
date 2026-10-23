
const db = require('../models');
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize');

class ProductService {

    // CREATE PRODUCT
    async create(data, userId) {

        const { category_id, variants, ...productData } = data;
        

        if (!category_id) {
            throw new Error('Category ID is required');
        }
        // Variants must be managed through the variant API.
        if (variants !== undefined) {
            throw new Error(
                'Create product first, then create variants separately.'
            );
        }

        const category = await Category.findByPk(category_id);

        if (!category) {
            throw new Error('Category not found');
        }

        return await Product.create({
            ...productData,
            category_id,
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
            gender,
            sortBy = 'createdAt',
            order = 'DESC'
        } = query;

        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = Math.min(
            100,
            Math.max(1, parseInt(limit, 10) || 20)
        );

        const offset = (currentPage - 1) * pageSize;

        const allowedSortFields = [
            'id',
            'name',
            'price',
            'createdAt',
            'updatedAt'
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : 'createdAt';

        const sortOrder = order.toUpperCase() === 'ASC'
            ? 'ASC'
            : 'DESC';

        const where = {
            status: 'active'
        };

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { brand: { [Op.like]: `%${search}%` } },
                { product_type: { [Op.like]: `%${search}%` } }
            ];
        }

        if (category_id) {
            where.category_id = category_id;
        }

        if (gender) {
            where.gender = gender;
        }

        const { rows, count } = await Product.findAndCountAll({
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: db.ProductVariant,
                    as: 'variants',
                    required: false,
                    where: { status: 'active' }
                }
            ],
            distinct: true,
            limit: pageSize,
            offset,
            order: [[sortField, sortOrder]]
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: currentPage,
                pages: Math.ceil(count / pageSize),
                limit: pageSize
            }
        };
    }

    // GET PRODUCT BY ID
    async findById(id) {
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: db.ProductVariant,
                    as: 'variants'
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
        const product = await Product.findByPk(id);

        if (!product) {
            throw new Error('Product not found');
        }

        const {sku, stock, ...productData } = data;

        if (productData.category_id !== undefined) {
            const category = await Category.findByPk(
                productData.category_id
            );

            if (!category) {
                throw new Error('Category not found');
            }
        }

        console.log('Updating product with data:', data, 'and userId:', userId);

        await product.update({
            ...productData,
            updated_by: userId
        });

        return await this.findById(id);
    }

    // DELETE PRODUCT
    async delete(id) {
        const product = await Product.findByPk(id);

        if (!product) {
            throw new Error('Product not found');
        }

        // Associated variants are deleted through the database
        // foreign key configured with ON DELETE CASCADE.
        await product.destroy();

        return true;
    }
}

module.exports = new ProductService();