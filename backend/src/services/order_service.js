
const crypto = require('crypto');
const { Op } = require('sequelize');
const db = require('../models');

const {
    Order,
    Payment,
    Cart,
    Address,
    Product,
    ProductVariant
} = db;

const VALID_ORDER_STATUSES = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned'
];

const VALID_PAYMENT_STATUSES = [
    'pending',
    'paid',
    'failed',
    'partially_refunded',
    'refunded'
];

const VALID_PAYMENT_METHODS = ['cashfree', 'cod'];
const AVAILABLE_PAYMENT_METHODS = ['cod'];

const toCents = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        throw new Error('Invalid price found');
    }

    return Math.round(number * 100);
};

const fromCents = (value) => Number((value / 100).toFixed(2));

const makeOrderNumber = () =>
    `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));

    return {
        page,
        limit,
        offset: (page - 1) * limit
    };
};

const getDateFilter = (query, where) => {
    if (query.start_date || query.end_date) {
        where.createdAt = {};

        if (query.start_date) {
            const start = new Date(`${query.start_date}T00:00:00.000Z`);

            if (Number.isNaN(start.getTime())) {
                throw new Error('Invalid start_date');
            }

            where.createdAt[Op.gte] = start;
        }

        if (query.end_date) {
            const end = new Date(`${query.end_date}T23:59:59.999Z`);

            if (Number.isNaN(end.getTime())) {
                throw new Error('Invalid end_date');
            }

            where.createdAt[Op.lte] = end;
        }
    }
};

const createHttpError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

class OrderService {
    // CREATE ORDER AND INITIAL PAYMENT RECORD

    async create(data, userId) {
        const addressId = Number(data.address_id);
        const paymentMethod = data.payment_method || 'cod';

        if (!Number.isInteger(addressId) || addressId <= 0) {
            throw createHttpError('A valid address_id is required');
        }

        if (!AVAILABLE_PAYMENT_METHODS.includes(paymentMethod)) {
            throw createHttpError(
                'Invalid payment_method. Cash on delivery is currently available.'
            );
        }

        const transaction = await db.sequelize.transaction();

        try {
            const address = await Address.findOne({
                where: {
                    id: addressId,
                    user_id: userId
                },
                transaction
            });

            if (!address) {
                throw createHttpError('Address not found for this user', 404);
            }

            const cartItems = await Cart.findAll({
                where: { user_id: userId },
                include: [
                    { model: Product, as: 'product', required: true },
                    { model: ProductVariant, as: 'variant', required: true }
                ],
                transaction
            });

            if (!cartItems.length) {
                throw createHttpError('Your cart is empty');
            }

            let subtotalCents = 0;
            let discountCents = 0;

            const items = [];

            for (const cart of cartItems) {
                const product = cart.product;

                if (!product || product.status !== 'active') {
                    throw createHttpError(
                        `Product is unavailable (cart item ${cart.id})`
                    );
                }

                // Lock and fetch the latest variant stock.
                const variant = await ProductVariant.findOne({
                    where: {
                        id: cart.product_variant_id,
                        product_id: product.id
                    },
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });

                if (
                    !variant ||
                    variant.status !== 'active' ||
                    Number(variant.product_id) !== Number(product.id)
                ) {
                    throw createHttpError(
                        `Product variant is unavailable (cart item ${cart.id})`
                    );
                }

                const sizes = Array.isArray(variant.sizes)
                    ? variant.sizes
                    : [];

                const sizeEntry = sizes.find(
                    (item) =>
                        String(item.size).toLowerCase() ===
                        String(cart.size).toLowerCase()
                );

                if (!sizeEntry) {
                    throw createHttpError(
                        `Size ${cart.size} is no longer available`
                    );
                }

                const quantity = Number(cart.quantity);

                if (!Number.isInteger(quantity) || quantity < 1) {
                    throw createHttpError(
                        `Invalid quantity for cart item ${cart.id}`
                    );
                }

                const availableStock = Number(sizeEntry.stock);

                if (
                    !Number.isFinite(availableStock) ||
                    availableStock < quantity
                ) {
                    throw createHttpError(
                        `Insufficient stock for ${product.name}, size ${cart.size}`
                    );
                }

                // Deduct stock from the selected size only.
                const updatedSizes = sizes.map((item) => {
                    const isSelectedSize =
                        String(item.size).toLowerCase() ===
                        String(cart.size).toLowerCase();

                    if (isSelectedSize) {
                        return {
                            ...item,
                            stock: Number(item.stock) - quantity
                        };
                    }

                    return item;
                });

                await variant.update(
                    {
                        sizes: updatedSizes
                    },
                    { transaction }
                );

                const originalUnitCents = toCents(product.price);

                const discountedUnitCents =
                    product.discount_price !== null &&
                        product.discount_price !== undefined &&
                        product.discount_price !== ''
                        ? toCents(product.discount_price)
                        : originalUnitCents;

                if (
                    originalUnitCents < 0 ||
                    discountedUnitCents < 0 ||
                    discountedUnitCents > originalUnitCents
                ) {
                    throw createHttpError(
                        `Invalid pricing for ${product.name}`
                    );
                }

                const lineSubtotal = originalUnitCents * quantity;

                const lineDiscount =
                    (originalUnitCents - discountedUnitCents) * quantity;

                subtotalCents += lineSubtotal;
                discountCents += lineDiscount;

                items.push({
                    cart_id: cart.id,
                    product_id: product.id,
                    product_variant_id: variant.id,
                    product_name: product.name,
                    sku: sizeEntry.sku,
                    size: sizeEntry.size,
                    color: variant.color,
                    images: variant.images || [],
                    quantity,
                    unit_price: fromCents(originalUnitCents),
                    discounted_unit_price: fromCents(discountedUnitCents),
                    discount_amount: fromCents(lineDiscount),
                    subtotal: fromCents(discountedUnitCents * quantity)
                });
            }

            // Configure shipping and tax according to your business rules.
            const shippingCents = 0;
            const taxCents = 0;

            const totalCents =
                subtotalCents - discountCents + shippingCents + taxCents;

            if (totalCents <= 0) {
                throw createHttpError('Order total must be greater than zero');
            }

            const order = await Order.create(
                {
                    order_number: makeOrderNumber(),
                    user_id: userId,
                    address_id: address.id,
                    items,
                    subtotal: fromCents(subtotalCents),
                    discount_amount: fromCents(discountCents),
                    shipping_fee: fromCents(shippingCents),
                    tax_amount: fromCents(taxCents),
                    total_amount: fromCents(totalCents),
                    currency: 'INR',
                    payment_method: paymentMethod,
                    order_status: 'pending',
                    payment_status: 'pending'
                },
                { transaction }
            );

            // Create the initial pending payment record.
            await Payment.create(
                {
                    order_id: order.id,
                    user_id: userId,
                    gateway: paymentMethod === 'cod' ? 'cod' : 'cashfree',
                    gateway_order_id: null,
                    transaction_id: null,
                    amount: order.total_amount,
                    currency: order.currency,
                    payment_method: paymentMethod === 'cod' ? 'cash' : null,
                    payment_status: 'pending'
                },
                { transaction }
            );

            // Clear the user's cart after order and payment record creation.
            await Cart.destroy({
                where: {
                    user_id: userId
                },
                transaction
            });

            // Commit order creation and stock deduction together.
            await transaction.commit();

            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }


    // CUSTOMER: LIST THEIR ORDERS
    async findAll(userId, query = {}) {
        const { page, limit, offset } = getPagination(query);
        const where = { user_id: userId };

        if (query.order_status) {
            if (!VALID_ORDER_STATUSES.includes(query.order_status)) {
                throw createHttpError('Invalid order_status filter');
            }

            where.order_status = query.order_status;
        }

        if (query.payment_status) {
            if (!VALID_PAYMENT_STATUSES.includes(query.payment_status)) {
                throw createHttpError('Invalid payment_status filter');
            }

            where.payment_status = query.payment_status;
        }

        if (query.payment_method) {
            if (!VALID_PAYMENT_METHODS.includes(query.payment_method)) {
                throw createHttpError('Invalid payment_method filter');
            }

            where.payment_method = query.payment_method;
        }

        getDateFilter(query, where);

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [{ model: Address, as: 'address' }],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    // CUSTOMER: GET THEIR ORDER
    async findById(id, userId) {
        const order = await Order.findOne({
            where: { id, user_id: userId },
            include: [
                { model: Address, as: 'address' },
                { model: Payment, as: 'payments' }
            ]
        });

        if (!order) {
            throw createHttpError('Order not found', 404);
        }

        return order;
    }

    // CUSTOMER: CANCEL THEIR ORDER
async cancel(id, userId) {
    const transaction = await db.sequelize.transaction();

    try {
        const order = await Order.findOne({
            where: {
                id,
                user_id: userId
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!order) {
            throw createHttpError('Order not found', 404);
        }

        if (order.order_status === 'cancelled') {
            throw createHttpError('Order is already cancelled');
        }

        if (!['pending', 'confirmed'].includes(order.order_status)) {
            throw createHttpError(
                'This order can no longer be cancelled'
            );
        }

        if (order.payment_status === 'paid') {
            throw createHttpError(
                'This order has been paid. Use the refund workflow before cancelling.'
            );
        }

        const items = order.items;

        if (!Array.isArray(items) || items.length === 0) {
            throw createHttpError(
                'Order items are missing; stock cannot be restored'
            );
        }

        // Restore stock for each ordered variant and size.
        for (const item of items) {
            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                !item.product_variant_id ||
                item.size == null
            ) {
                throw createHttpError(
                    'Invalid order item; stock cannot be restored'
                );
            }

            const variant = await ProductVariant.findOne({
                where: {
                    id: item.product_variant_id
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!variant) {
                throw createHttpError(
                    `Product variant ${item.product_variant_id} not found`
                );
            }

            const sizes = Array.isArray(variant.sizes)
                ? variant.sizes
                : [];

            const sizeIndex = sizes.findIndex(
                (sizeItem) =>
                    String(sizeItem.size).toLowerCase() ===
                    String(item.size).toLowerCase()
            );

            if (sizeIndex === -1) {
                throw createHttpError(
                    `Size ${item.size} not found for variant ${variant.id}`
                );
            }

            const currentStock = Number(sizes[sizeIndex].stock);

            if (!Number.isFinite(currentStock) || currentStock < 0) {
                throw createHttpError(
                    `Invalid stock for variant ${variant.id}, size ${item.size}`
                );
            }

            // Add the cancelled quantity back to this size.
            const updatedSizes = sizes.map((sizeItem, index) => {
                if (index !== sizeIndex) {
                    return sizeItem;
                }

                return {
                    ...sizeItem,
                    stock: currentStock + quantity
                };
            });

            await variant.update(
                {
                    sizes: updatedSizes
                },
                { transaction }
            );
        }

        // Update order status only after stock restoration succeeds.
        await order.update(
            {
                order_status: 'cancelled',
                cancelled_at: new Date()
            },
            { transaction }
        );

        await transaction.commit();

        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

    // ADMIN: LIST ALL ORDERS WITH FILTERS
    async adminFindAll(query = {}) {
        const { page, limit, offset } = getPagination(query);
        const where = {};

        if (query.order_status) {
            if (!VALID_ORDER_STATUSES.includes(query.order_status)) {
                throw createHttpError('Invalid order_status filter');
            }

            where.order_status = query.order_status;
        }

        if (query.payment_status) {
            if (!VALID_PAYMENT_STATUSES.includes(query.payment_status)) {
                throw createHttpError('Invalid payment_status filter');
            }

            where.payment_status = query.payment_status;
        }

        if (query.payment_method) {
            if (!VALID_PAYMENT_METHODS.includes(query.payment_method)) {
                throw createHttpError('Invalid payment_method filter');
            }

            where.payment_method = query.payment_method;
        }

        if (query.user_id !== undefined) {
            const filterUserId = Number(query.user_id);

            if (!Number.isInteger(filterUserId) || filterUserId <= 0) {
                throw createHttpError('Invalid user_id filter');
            }

            where.user_id = filterUserId;
        }

        if (query.search) {
            where.order_number = {
                [Op.like]: `%${String(query.search).trim()}%`
            };
        }

        getDateFilter(query, where);

        const allowedSortFields = [
            'createdAt',
            'total_amount',
            'order_status'
        ];

        const sortBy = allowedSortFields.includes(query.sort_by)
            ? query.sort_by
            : 'createdAt';

        const sortOrder =
            String(query.sort_order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [
                { model: Address, as: 'address' },
                {
                    model: db.User,
                    as: 'user',
                    attributes: {
                        exclude: ['password', 'password_hash']
                    }
                }
            ],
            order: [[sortBy, sortOrder]],
            limit,
            offset,
            distinct: true
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    // ADMIN: GET ANY ORDER
    async adminFindById(id) {
        const order = await Order.findByPk(id, {
            include: [
                { model: Address, as: 'address' },
                {
                    model: db.User,
                    as: 'user',
                    attributes: {
                        exclude: ['password', 'password_hash']
                    }
                },
                { model: Payment, as: 'payments' }
            ]
        });

        if (!order) {
            throw createHttpError('Order not found', 404);
        }

        return order;
    }

    // ADMIN: UPDATE ORDER STATUS
    async adminUpdateStatus(id, status) {
        if (!VALID_ORDER_STATUSES.includes(status)) {
            throw createHttpError('Invalid order_status');
        }

        const transaction = await db.sequelize.transaction();

        try {
            const order = await Order.findByPk(id, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!order) {
                throw createHttpError('Order not found', 404);
            }

            if (['cancelled', 'returned'].includes(order.order_status)) {
                throw createHttpError(
                    `Cannot change status from ${order.order_status}`
                );
            }

            if (status === 'shipped' && order.payment_method === 'cashfree' &&
                order.payment_status !== 'paid') {
                throw createHttpError('Cashfree orders must be paid before shipping');
            }

            if (status === 'delivered') {
                throw createHttpError(
                    'Use the delivery completion workflow to mark orders as delivered'
                );
            }

            if (status === 'cancelled' && order.payment_status === 'paid') {
                throw createHttpError(
                    'Paid orders require the refund workflow before cancellation'
                );
            }

            const updateData = { order_status: status };

            if (status === 'cancelled') {
                updateData.cancelled_at = new Date();
            }

            await order.update(updateData, { transaction });

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // DELIVERY: COMPLETE DELIVERY AND COLLECT COD CASH
    async completeDelivery(orderId) {
        const transaction = await db.sequelize.transaction();

        try {
            const order = await Order.findByPk(orderId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!order) {
                throw createHttpError('Order not found', 404);
            }

            if (order.order_status !== 'shipped') {
                throw createHttpError('Only shipped orders can be delivered');
            }

            if (order.payment_method === 'cod') {
                if (order.payment_status === 'paid') {
                    throw createHttpError('COD payment has already been collected');
                }

                const payment = await Payment.findOne({
                    where: {
                        order_id: order.id,
                        user_id: order.user_id,
                        gateway: 'cod'
                    },
                    order: [['createdAt', 'DESC']],
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });

                if (!payment) {
                    throw createHttpError('COD payment record not found', 404);
                }

                // Call only after the delivery person confirms cash collection.
                await payment.update(
                    {
                        payment_method: 'cash',
                        payment_status: 'success',
                        paid_at: new Date(),
                        failure_reason: null
                    },
                    { transaction }
                );

                await order.update(
                    {
                        order_status: 'delivered',
                        payment_status: 'paid',
                        delivered_at: new Date()
                    },
                    { transaction }
                );
            } else {
                if (order.payment_status !== 'paid') {
                    throw createHttpError(
                        'Cashfree payment must be verified before delivery completion'
                    );
                }

                await order.update(
                    {
                        order_status: 'delivered',
                        delivered_at: new Date()
                    },
                    { transaction }
                );
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new OrderService();
