
const paymentService = require('../services/payment_service');

// INITIATE PAYMENT
exports.initiate = async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: 'order_id is required'
      });
    }

    const payment = await paymentService.initiate(
      order_id,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: payment
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
};

// VERIFY PAYMENT
exports.verify = async (req, res) => {
  try {
    const { order_id, gateway_order_id } = req.body;

    if (!order_id || !gateway_order_id) {
      return res.status(400).json({
        success: false,
        message: 'order_id and gateway_order_id are required'
      });
    }

    const payment = await paymentService.verify(
      order_id,
      gateway_order_id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: 'Payment status fetched successfully',
      data: payment
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
};

// GET PAYMENT ATTEMPTS FOR AN ORDER
exports.getByOrder = async (req, res) => {
  try {
    const payments = await paymentService.findByOrder(
      req.params.orderId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: 'Payments fetched successfully',
      data: payments
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message
    });
  }
};


// GET PAYMENT ATTEMPTS FOR AN ORDER
exports.findAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.findAllPayments(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: 'Payments fetched successfully',
      data: payments
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message
    });
  }
};
