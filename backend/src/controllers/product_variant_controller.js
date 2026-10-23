const productVariantService = require('../services/product_variant_service');

// Parse JSON values submitted through multipart/form-data.
const parseJsonField = (value, fieldName) => {
    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        throw new Error(`Invalid JSON provided for ${fieldName}`);
    }
};

// CREATE PRODUCT VARIANT
exports.create = async (req, res) => {
    try {
        const body = { ...req.body };

        if (body.sizes !== undefined) {
            body.sizes = parseJsonField(body.sizes, 'sizes');
        }

        if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
            throw new Error('At least one size is required');
        }   

        // Handle Cloudinary-uploaded images.
        if (req.files && req.files.length > 0) {
            body.images = req.files.map((file, index) => ({
                url: file.path,
                is_primary: index === 0,
                sort_order: index + 1
            }));
        } else if (body.images !== undefined) {
            body.images = parseJsonField(body.images, 'images');
        } else {
            body.images = []; 
        }

        const variant = await productVariantService.create(
            body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: 'Product variant created successfully',
            data: variant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL PRODUCT VARIANTS
exports.getAll = async (req, res) => {
    try {
        const result = await productVariantService.findAll(req.query);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET PRODUCT VARIANT BY ID
exports.getById = async (req, res) => {
    try {
        const variant = await productVariantService.findById(
            req.params.id
        );

        res.json({
            success: true,
            data: variant
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT VARIANT
exports.update = async (req, res) => {
    try {
        const body = { ...req.body };

        if (body.sizes !== undefined) {
            body.sizes = parseJsonField(body.sizes, 'sizes');

            if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
                throw new Error('At least one size is required');
            }
        }

        if (req.files && req.files.length > 0) {
            body.images = req.files.map((file, index) => ({
                url: file.path,
                is_primary: index === 0,
                sort_order: index + 1
            }));
        } else if (body.images !== undefined) {
            body.images = parseJsonField(body.images, 'images');
        }

        const variant = await productVariantService.update(
            req.params.id,
            body,
            req.user.id
        );

        res.json({
            success: true,
            message: 'Product variant updated successfully',
            data: variant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT VARIANT
exports.remove = async (req, res) => {
    try {
        await productVariantService.delete(req.params.id);

        res.json({
            success: true,
            message: 'Product variant deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};