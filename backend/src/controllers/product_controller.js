
const productService = require('../services/product_service');


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

// CREATE PRODUCT
exports.create = async (req, res) => {
    try {
        const body = { ...req.body };


        if (req.files && req.files.length > 0) {
            body.images = req.files.map(file => file.path);
        } else {
            body.images = [];
        }
        console.log('Creating product with data:', body, 'and userId:', req.user.id);

        const product = await productService.create(
            body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL PRODUCTS
exports.getAll = async (req, res) => {
    try {
        const result = await productService.findAll(req.query);

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

// GET PRODUCT BY ID
exports.getById = async (req, res) => {
    try {
        const product = await productService.findById(req.params.id);

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT
exports.update = async (req, res) => {
    try {


        const body = { ...req.body };
        console.log('Received update request with data:', body, 'and userId:', req.user.id);


        if (req.files && req.files.length > 0) {
            body.images = req.files.map(file => file.path);
        } else {
            body.images = [];
        }
        const product = await productService.update(
            req.params.id,
            body,
            req.user.id
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT
exports.remove = async (req, res) => {
    try {
        await productService.delete(req.params.id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};