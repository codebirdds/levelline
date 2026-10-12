
const db = require('../models');

const Cart = db.Cart;
const Product = db.Product;
const ProductVariant = db.ProductVariant;

class CartService {

  // CREATE - Add item to cart
  async create(data, userId) {
    const { product_id, product_variant_id, size, quantity = 1 } = data;

    if (!product_id || !product_variant_id || !size) {
      throw new Error(
        'Product ID, variant ID, and size are required'
      );
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      throw new Error('Quantity must be a positive integer');
    }

    // Validate product
    const product = await Product.findByPk(product_id);

    if (!product || product.status !== 'active') {
      throw new Error('Product not found or inactive');
    }

    // Validate variant belongs to this product
    const variant = await ProductVariant.findOne({
      where: {
        id: product_variant_id,
        product_id,
        status: 'active'
      }
    });

    if (!variant) {
      throw new Error('Product variant not found or inactive');
    }

    // Find selected size in variant JSON
    const selectedSize = (variant.sizes || []).find(
      item =>
        item.size?.toLowerCase() === String(size).trim().toLowerCase()
    );

    if (!selectedSize) {
      throw new Error('Selected size is not available');
    }

    if (selectedSize.stock < parsedQuantity) {
      throw new Error(
        `Only ${selectedSize.stock} items available for size ${selectedSize.size}`
      );
    }

    // Check if the same variant and size already exist
    const existingCartItem = await Cart.findOne({
      where: {
        user_id: userId,
        product_variant_id,
        size: selectedSize.size
      }
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + parsedQuantity;

      if (newQuantity > selectedSize.stock) {
        throw new Error(
          `Only ${selectedSize.stock} items available for size ${selectedSize.size}`
        );
      }

      await existingCartItem.update({
        quantity: newQuantity
      });

      return await this.findById(existingCartItem.id, userId);
    }

    return await Cart.create({
      user_id: userId,
      product_id,
      product_variant_id,
      size: selectedSize.size,
      quantity: parsedQuantity
    });
  }

  // GET ALL - Logged-in user's cart
  async findAll(userId) {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: ProductVariant,
          as: 'variant'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate price and subtotal using current product data
    const items = cartItems.map(item => {
      const cartItem = item.toJSON();
      const product = cartItem.product;

      const price = Number(
        product.discount_price ?? product.price
      );

      return {
        ...cartItem,
        unit_price: price,
        subtotal: Number((price * cartItem.quantity).toFixed(2))
      };
    });

    const totalItems = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const subtotal = Number(
      items.reduce((total, item) => total + item.subtotal, 0).toFixed(2)
    );

    return {
      items,
      totalItems,
      subtotal
    };
  }

  // GET BY ID - One cart item belonging to the user
  async findById(id, userId) {
    const cartItem = await Cart.findOne({
      where: {
        id,
        user_id: userId
      },
      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: ProductVariant,
          as: 'variant'
        }
      ]
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    const result = cartItem.toJSON();
    const price = Number(
      result.product.discount_price ?? result.product.price
    );

    return {
      ...result,
      unit_price: price,
      subtotal: Number((price * result.quantity).toFixed(2))
    };
  }

  // UPDATE - Change quantity
  async update(id, data, userId) {
    const cartItem = await Cart.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    const quantity = Number(data.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Quantity must be a positive integer');
    }

    const variant = await ProductVariant.findOne({
      where: {
        id: cartItem.product_variant_id,
        product_id: cartItem.product_id,
        status: 'active'
      }
    });

    if (!variant) {
      throw new Error('Product variant is unavailable');
    }

    const selectedSize = (variant.sizes || []).find(
      item =>
        item.size?.toLowerCase() === cartItem.size.toLowerCase()
    );

    if (!selectedSize) {
      throw new Error('Selected size is no longer available');
    }

    if (quantity > selectedSize.stock) {
      throw new Error(
        `Only ${selectedSize.stock} items available for size ${selectedSize.size}`
      );
    }

    await cartItem.update({ quantity });

    return await this.findById(cartItem.id, userId);
  }

  // DELETE - Remove cart item
  async delete(id, userId) {
    const cartItem = await Cart.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await cartItem.destroy();

    return true;
  }
}

module.exports = new CartService();