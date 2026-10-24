
const db = require('../models');
const Product = db.Product;
const ProductVariant = db.ProductVariant;
const { Op } = require('sequelize');

class ProductVariantService {

    // VALIDATE SIZES
    validateSizes(sizes) {
        if (!Array.isArray(sizes) || sizes.length === 0) {
            throw new Error('At least one size is required');
        }

        const seenSizes = new Set();    
        const seenSkus = new Set();

        for (const item of sizes) {
            if (
                !item ||
                typeof item.size !== 'string' ||
                !item.size.trim()
            ) {
                throw new Error('Every size must have a valid size name');
            }

            if (
                !Number.isInteger(item.stock) ||
                item.stock < 0
            ) {
                throw new Error(
                    `Stock for size ${item.size} must be a non-negative integer`
                );
            }

            if (
                typeof item.sku !== 'string' ||
                !item.sku.trim()
            ) {
                throw new Error(
                    `SKU is required for size ${item.size}`
                );
            }

            const normalizedSize = item.size.trim().toUpperCase();
            const normalizedSku = item.sku.trim().toUpperCase();

            if (seenSizes.has(normalizedSize)) {
                throw new Error(
                    `Duplicate size found: ${item.size}`
                );
            }

            if (seenSkus.has(normalizedSku)) {
                throw new Error(
                    `Duplicate SKU found: ${item.sku}`
                );
            }

            seenSizes.add(normalizedSize);
            seenSkus.add(normalizedSku);
        }
    }

    // VALIDATE PARENT PRODUCT
    async validateProduct(productId) {
        if (!productId) {
            throw new Error('product_id is required');
        }

        const product = await Product.findByPk(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    // CREATE VARIANT
    async create(data, userId) {
        const { product_id, color, sizes, price, discount_price, name, description } = data;

        await this.validateProduct(product_id);

        if (!color || !color.trim()) {
            throw new Error('Color is required');
        }

        this.validateSizes(sizes);

        const images = data.images ?? [];

        if (!Array.isArray(images)) {
            throw new Error('Images must be an array');
        }

        // Check SKUs against all existing variant size arrays.
        const existingVariants = await ProductVariant.findAll({
            attributes: ['id', 'sizes']
        });

        if(!price){
            throw new Error('price is required');
        }

        const requestedSkus = new Set(
            sizes.map(item => item.sku.trim().toUpperCase())
        );

        // for (const variant of existingVariants) {
        //     const existingSizes = variant.sizes || [];

        //     for (const item of existingSizes) {
        //         if (
        //             item.sku &&
        //             requestedSkus.has(item.sku.trim().toUpperCase())
        //         ) {
        //             throw new Error(`SKU already exists: ${item.sku}`);
        //         }
        //     }
        // }

        return await ProductVariant.create({
            product_id,
            name,
            description,
            color: color.trim(),
            price,
            discount_price,
            color_code: data.color_code || null,
            sizes,
            images,
            status: data.status || 'active'
        });
    }

    // GET ALL VARIANTS
    async findAll(query) {
        const {
            page = 1,
            limit = 20,
            product_id,
            color,
            status = 'active'
        } = query;

        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = Math.min(
            100,
            Math.max(1, parseInt(limit, 10) || 20)
        );

        const where = {};

        if (product_id) {
            where.product_id = product_id;
        }

        if (color) {
            where.color = { [Op.like]: `%${color}%` };
        }

        if (status) {
            where.status = status;
        }

        const { rows, count } = await ProductVariant.findAndCountAll({
            where,
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: [
                        'id',
                        'name',
                        'brand',
                        'price',
                        'discount_price',
                        'category_id'
                    ]
                }
            ],
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            order: [['createdAt', 'DESC']]
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

    // GET VARIANT BY ID
    async findById(id) {
        const variant = await ProductVariant.findByPk(id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: [
                        'id',
                        'name',
                        'brand',
                        'price',
                        'discount_price',
                        'category_id'
                    ]
                }
            ]
        });

        if (!variant) {
            throw new Error('Product variant not found');
        }

        return variant;
    }

    // UPDATE VARIANT
    async update(id, data, userId) {
        const variant = await ProductVariant.findByPk(id);

        if (!variant) {
            throw new Error('Product variant not found');
        }

        const {
            product_id,
            color,
            sizes,
            images,
            color_code,
            status,
            name,
            description
        } = data;

        if (product_id !== undefined) {
            await this.validateProduct(product_id);
        }

        if (color !== undefined && !color.trim()) {
            throw new Error('Color cannot be empty');
        }

        // if (sizes !== undefined) {
        //     this.validateSizes(sizes);

        //     // Exclude the current variant when checking SKU conflicts.
        //     const otherVariants = await ProductVariant.findAll({
        //         where: {
        //             id: { [Op.ne]: id }
        //         },
        //         attributes: ['sizes']
        //     });

        //     for (const other of otherVariants) {
        //         for (const item of other.sizes || []) {
        //             if (
        //                 item.sku &&
        //                 sizes.some(
        //                     size =>
        //                         size.sku.trim().toUpperCase() ===
        //                         item.sku.trim().toUpperCase()
        //                 )
        //             ) {
        //                 throw new Error(`SKU already exists: ${item.sku}`);
        //             }
        //         }
        //     }
        // }

        if (images !== undefined && !Array.isArray(images)) {
            throw new Error('Images must be an array');
        }

        await variant.update({
            ...(product_id !== undefined && { product_id }),
            ...(color !== undefined && { color: color.trim() }),
            ...(color_code !== undefined && { color_code }),
            ...(sizes !== undefined && { sizes }),
            ...(images !== undefined && { images }),
            ...(status !== undefined && { status }),
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description })
        });

        return await this.findById(id);
    }

    // DELETE VARIANT
    async delete(id) {
        const variant = await ProductVariant.findByPk(id);

        if (!variant) {
            throw new Error('Product variant not found');
        }

        await variant.destroy();

        return true;
    }
}

module.exports = new ProductVariantService();