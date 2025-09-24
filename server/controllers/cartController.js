const Cart = require('../models/Cart');
const Product = require('../models/Product'); // To get product details and price

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private (User)
exports.getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name slug price images'); // Populate product details
        if (!cart) {
            // If cart doesn't exist, create an empty one for the user
            const newCart = await Cart.create({ user: req.user.id, items: [], totalPrice: 0 });
            return res.status(200).json({ success: true, data: newCart });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Add item to cart or update quantity if exists
// @route   POST /api/cart
// @access  Private (User)
exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient product stock' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Create a new cart if one doesn't exist for the user
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
            // Ensure price is updated to current if desired, or keep original
            cart.items[itemIndex].price = product.price;
        } else {
            // Add new product to cart
            cart.items.push({
                product: productId,
                quantity,
                price: product.price // Store current price
            });
        }

        await cart.save(); // Pre-save hook will update totalPrice
        res.status(200).json({ success: true, message: 'Item added to cart', data: cart });

    } catch (error) {
        console.error('Error adding item to cart:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error during add to cart' });
    }
};

// @desc    Update quantity of an item in cart
// @route   PUT /api/cart/:productId
// @access  Private (User)
exports.updateCartItemQuantity = async (req, res) => {
    const { quantity } = req.body;
    const { productId } = req.params;

    try {
        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1, use DELETE to remove item' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient product stock for this quantity' });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found for this user' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ success: true, message: 'Item quantity updated', data: cart });
        } else {
            res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ success: false, message: 'Server error during quantity update' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private (User)
exports.removeItemFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found for this user' });
        }

        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ success: false, message: 'Server error during item removal' });
    }
};

// @desc    Clear user's entire cart
// @route   DELETE /api/cart
// @access  Private (User)
exports.clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found for this user' });
        }

        cart.items = [];
        cart.totalPrice = 0; // Reset total price
        await cart.save();

        res.status(200).json({ success: true, message: 'Cart cleared', data: cart });

    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Server error during cart clear' });
    }
};