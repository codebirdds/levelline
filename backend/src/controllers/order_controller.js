
const orderService = require('../services/order_service');

// CREATE ORDER
exports.create = async (req, res) => {
  try {
    const order = await orderService.create(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
};

// GET LOGGED-IN USER'S ORDERS
exports.getAll = async (req, res) => {
  try {
    const result = await orderService.findAll(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      ...result
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE ORDER FOR LOGGED-IN USER
exports.getById = async (req, res) => {
  try {
    const order = await orderService.findById(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message
    });
  }
};

// CANCEL CUSTOMER ORDER
exports.cancel = async (req, res) => {
  try {
    const order = await orderService.cancel(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN: GET ALL ORDERS WITH FILTERS
exports.adminGetAll = async (req, res) => {
  try {
    const result = await orderService.adminFindAll(req.query);

    return res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      ...result
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN: GET ANY ORDER BY ID
exports.adminGetById = async (req, res) => {
  try {
    const order = await orderService.adminFindById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN: UPDATE ORDER STATUS
exports.adminUpdateStatus = async (req, res) => {
  try {
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(400).json({
        success: false,
        message: 'order_status is required'
      });
    }

    const order = await orderService.adminUpdateStatus(
      req.params.id,
      order_status
    );

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
}



  // ADMIN: MARK AS ORDER STATUS
  exports.markAsDeliver = async (req, res) => {
    try {
      const { order_id } = req.params;

      if (!order_id) {
        return res.status(400).json({
          success: false,
          message: 'order_id is required'
        });
      }

      const order = await orderService.completeDelivery(
        order_id,
      );

      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  }
