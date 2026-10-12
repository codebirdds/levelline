
const cartService = require('../services/cart_service.js');

// CREATE - Add item to cart
exports.create = async (req, res) => {
  try {
    const cart = await cartService.create(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL - Get logged-in user's cart
exports.getAll = async (req, res) => {
  try {
    const cart = await cartService.findAll(req.user.id);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET BY ID - Get a specific cart item
exports.getById = async (req, res) => {
  try {
    const cart = await cartService.findById(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE - Update cart item quantity
exports.update = async (req, res) => {
  try {
    const cart = await cartService.update(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Cart quantity updated successfully',
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE - Remove item from cart
exports.remove = async (req, res) => {
  try {
    await cartService.delete(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};