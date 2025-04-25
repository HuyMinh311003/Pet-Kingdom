const Product = require('../models/Product');
const Category = require('../models/Category');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            categoryId,
            stock,
            imageUrl
        } = req.body;

        // Validate category
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const product = new Product({
            name,
            description,
            price,
            categoryId,
            stock,
            imageUrl,
            isActive: true,
            rating: 0
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
    try {
        const {
            categoryId,
            search,
            minPrice,
            maxPrice,
            sort,
            isActive,
            page = 1,
            limit = 10
        } = req.query;

        let query = {};

        // Category filter
        if (categoryId) {
            query.categoryId = categoryId;
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }

        // Active status filter
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Sorting
        let sortOptions = {};
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    sortOptions.price = 1;
                    break;
                case 'price_desc':
                    sortOptions.price = -1;
                    break;
                case 'rating_desc':
                    sortOptions.rating = -1;
                    break;
                case 'newest':
                    sortOptions.createdAt = -1;
                    break;
            }
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .populate('categoryId');

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.json({
            products,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('categoryId');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get related products
exports.getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const relatedProducts = await Product.find({
            categoryId: product.categoryId,
            _id: { $ne: product._id },
            isActive: true
        })
        .limit(4)
        .populate('categoryId');

        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            categoryId,
            stock,
            imageUrl,
            isActive
        } = req.body;

        // Validate category if provided
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Invalid category' });
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                categoryId,
                stock,
                imageUrl,
                isActive
            },
            { new: true }
        ).populate('categoryId');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle product status
exports.toggleStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isActive = !product.isActive;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product stock
exports.updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        if (stock < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};