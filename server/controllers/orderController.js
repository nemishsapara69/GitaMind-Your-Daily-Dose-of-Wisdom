const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // To update product stock
const User = require('../models/User'); // To potentially get user address details later

// Helper function to calculate prices (can be moved to a utility file later)
const calculatePrices = (items) => {
    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = 0.15 * itemsPrice; // 15% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

// @desc    Place a new order from user's cart
// @route   POST /api/orders
// @access  Private (User)
exports.placeOrder = async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    try {
        // 1. Find the user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty. Cannot place an order.' });
        }

        // 2. Prepare order items (snapshot product details from cart)
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            image: item.product.images && item.product.images.length > 0 ? item.product.images[0].url : 'no-image.jpg',
            price: item.price // Use the price stored in the cart
        }));

        // 3. Calculate prices (items price, shipping, tax, total)
        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices(orderItems);

        // 4. Create the new order
        const order = new Order({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: false, // Will be updated after actual payment
            isDelivered: false,
            orderStatus: 'Pending'
        });

        await order.save();

        // 5. Deduct product stock and clear the user's cart
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
        }
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ success: true, message: 'Order placed successfully', data: order });

    } catch (error) {
        console.error('Error placing order:', error.message);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error during order placement' });
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private (User)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('user', 'username email');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).json({ success: false, message: 'Server error fetching orders' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'username email fullName')
            .populate('orderItems.product', 'name slug price images');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Ensure only the owner or an admin can view the order
        if (order.user._id.toString() !== req.user.id && !req.user.roles.includes('admin')) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error fetching order by ID:', error.message);
        // Handle CastError for invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Order ID format' });
        }
        res.status(500).json({ success: false, message: 'Server error fetching order' });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        // Find all orders and populate user information, but not order items
        const orders = await Order.find().populate('user', 'username email fullName');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error('Error fetching all orders:', error.message);
        res.status(500).json({ success: false, message: 'Server error fetching all orders' });
    }
};

// @desc    Update order to paid (Admin can do this, or payment gateway callback)
// @route   PUT /api/orders/:id/pay
// @access  Private (Admin)
exports.updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        // paymentResult would typically come from a payment gateway webhook
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error updating order to paid:', error.message);
        res.status(500).json({ success: false, message: 'Server error updating order to paid' });
    }
};

// @desc    Update order to delivered (Admin only)
// @route   PUT /api/orders/:id/deliver
// @access  Private (Admin)
exports.updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = 'Delivered';

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error updating order to delivered:', error.message);
        res.status(500).json({ success: false, message: 'Server error updating order to delivered' });
    }
};