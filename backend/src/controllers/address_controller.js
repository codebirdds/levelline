
const addressService = require('../services/address_service');

// CREATE
exports.create = async (req, res) => {
  try {
    const address = await addressService.create(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
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
    const addresses = await addressService.findAll(req.user.id);

    res.json({
      success: true,
      data: addresses
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
    const address = await addressService.findById(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: address
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
    const address = await addressService.update(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address
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
    await addressService.delete(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// SET DEFAULT
exports.setDefault = async (req, res) => {
  try {
    const address = await addressService.setDefault(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Default address updated successfully',
      data: address
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
