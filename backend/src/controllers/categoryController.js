const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, type, parent, isActive } = req.body;

        // If parent category is specified, verify it exists
        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent category not found'
                });
            }
        }

        const category = new Category({
            name,
            type,
            parent,
            isActive: isActive
        });

        await category.save();

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const { type, includeInactive } = req.query;
        const query = includeInactive ? {} : { isActive: true };
        
        if (type) {
            query.type = type;
        }

        // Get all categories
        const categories = await Category.find(query)
            .populate('parent')
            .sort({ order: 1 });

        // Build category tree
        const buildTree = (items, parentId = null) => {
            const branch = [];

            items.forEach(item => {
                if ((item.parent?._id || null)?.toString() === (parentId || null)?.toString()) {
                    const children = buildTree(items, item._id);
                    if (children.length) {
                        item = item.toObject();
                        item.children = children;
                    }
                    branch.push(item);
                }
            });

            return branch;
        };

        const categoryTree = buildTree(categories);

        res.json({
            success: true,
            data: categoryTree
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Get category path
        const path = await category.getPath();

        // Get immediate children
        const children = await Category.find({ parent: category._id })
            .sort({ order: 1 });

        res.json({
            success: true,
            data: {
                category,
                path,
                children
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const updates = req.body;
        
        // If updating parent, verify it exists and prevent circular reference
        if (updates.parent) {
            const parentCategory = await Category.findById(updates.parent);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent category not found'
                });
            }

            // Check for circular reference
            let current = parentCategory;
            while (current.parent) {
                if (current.parent.toString() === req.params.id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Circular reference detected'
                    });
                }
                current = await Category.findById(current.parent);
            }
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('parent');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        // Check if category has children
        const hasChildren = await Category.exists({ parent: req.params.id });
        if (hasChildren) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with child categories'
            });
        }

        // Check if category has associated products
        const Product = require('../models/Product');
        const hasProducts = await Product.exists({ categoryId: req.params.id });
        if (hasProducts) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with associated products'
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // If deactivating, check if has active children
        if (category.isActive) {
            const hasActiveChildren = await Category.exists({
                parent: category._id,
                isActive: true
            });

            if (hasActiveChildren) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot deactivate category with active child categories'
                });
            }
        }

        category.isActive = !category.isActive;
        await category.save();

        res.json({
            success: true,
            data: {
                id: category._id,
                isActive: category.isActive
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error toggling category status',
            error: error.message
        });
    }
};