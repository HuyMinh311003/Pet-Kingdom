const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            categoryId,
            stock,
            imageUrl,
            // Pet specific fields
            birthday,
            gender,
            vaccinated,
            type
        } = req.body;

        // Validate category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Create product
        const product = new Product({
            name,
            description,
            price,
            categoryId,
            stock,
            imageUrl,
            isActive: true,
            type: category.type, // 'pet' or 'tool'
            // Add pet specific fields if it's a pet
            ...(category.type === 'pet' && {
                birthday,
                gender,
                vaccinated
            })
        });

        await product.save();

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { 
            category,
            type,
            minPrice,
            maxPrice,
            search,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const query = { isActive: true };

        // Add filters
        if (category) query.categoryId = category;
        if (type) query.type = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Count total documents for pagination
        const total = await Product.countDocuments(query);

        // Build query with pagination and sorting
        let queryBuilder = Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        // Add sorting
        if (sort) {
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            const sortField = sort.replace(/^-/, '');
            queryBuilder = queryBuilder.sort({ [sortField]: sortOrder });
        } else {
            queryBuilder = queryBuilder.sort({ createdAt: -1 });
        }

        const products = await queryBuilder.populate('categoryId', 'name');

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('categoryId', 'name type');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

exports.getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Get related products based on category and type
        const relatedProducts = await Product.find({
            _id: { $ne: product._id }, // Exclude current product
            $or: [
                { categoryId: product.categoryId }, // Same category
                { type: product.type } // Same type (pet/tool)
            ],
            isActive: true
        })
        .limit(4)
        .populate('categoryId', 'name');

        res.json({
            success: true,
            data: relatedProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching related products',
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updates = req.body;
        
        // Prevent changing product type directly
        delete updates.type;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('categoryId', 'name type');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product.isActive = !product.isActive;
        await product.save();

        res.json({
            success: true,
            data: {
                id: product._id,
                isActive: product.isActive
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error toggling product status',
            error: error.message
        });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { quantity } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update stock
        product.stock = Math.max(0, product.stock + quantity);
        await product.save();

        res.json({
            success: true,
            data: {
                id: product._id,
                stock: product.stock
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating stock',
            error: error.message
        });
    }
};