const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    slug: { // For SEO-friendly URLs
        type: String,
        lowercase: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    images: [ // Array of image URLs/objects
        {
            url: { type: String, required: true },
            alt: { type: String, default: 'product image' }
        }
    ],
    category: {
        type: mongoose.Schema.ObjectId, // Reference to the Category model
        ref: 'Category', // The 'ref' option tells Mongoose which model to use during population
        required: [true, 'Product must belong to a category']
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0'],
        max: [5, 'Rating must be below 5'],
        set: val => Math.round(val * 10) / 10 // e.g., 4.666 -> 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true } // Include virtuals when converting to Object
});

// Pre-save hook to generate slug from name
productSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);