const productService = require('../services/product_service');

// CREATE PRODUCT
exports.create = async (req, res) => {
  try {
    // 🔥 Handle Cloudinary image upload
    if (req.file) {
      req.body.images = [req.file.path]; // single image
    }

    // 🔥 If using multiple images (optional)
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }

    const product = await productService.create(req.body, req.user.id);

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
    // 🔥 Handle image update
    if (req.file) {
      req.body.images = [req.file.path];
    }

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }

    const product = await productService.update(
      req.params.id,
      req.body,
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