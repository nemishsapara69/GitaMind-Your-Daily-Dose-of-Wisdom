const mongoose = require('mongoose');

// Schema for individual items within the cart
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: { // Store the price at the time of adding to cart (for historical accuracy)
        type: Number,
        required: true
    }
}, { _id: false }); // We don't need a separate _id for each cart item subdocument

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true // A user should only have one cart
    },
    items: [cartItemSchema], // Array of cart items
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to calculate total price before saving the cart
cartSchema.pre('save', function(next) {
    let total = 0;
    this.items.forEach(item => {
        total += item.quantity * item.price;
    });
    this.totalPrice = total;
    next();
});

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);