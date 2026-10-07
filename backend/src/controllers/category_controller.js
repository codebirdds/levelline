const categoryService = require('../services/category_service.js');

// CREATE
exports.create = async (req, res) => {
  try {
    const category = await categoryService.create(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const categories = await categoryService.findAll();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const category = await categoryService.findById(req.params.id);

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const category = await categoryService.update(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Category updated',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await categoryService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};