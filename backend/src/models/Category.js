const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true
    },
    description: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ['pet', 'tool'],
        required: [true, 'Category type is required']
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    icon: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Add index for faster tree traversal
categorySchema.index({ parent: 1, order: 1 });

// Virtual for getting child categories
categorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});

// Method to get full category path
categorySchema.methods.getPath = async function() {
    const path = [this];
    let current = this;

    while (current.parent) {
        current = await this.model('Category').findById(current.parent);
        if (!current) break;
        path.unshift(current);
    }

    return path;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;