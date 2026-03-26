const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    slug: { // For SEO-friendly URLs (e.g., /categories/bhagavad-gita-books)
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    // You might add a reference to products later if needed
    // products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }]
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Pre-save hook to generate slug from name
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);