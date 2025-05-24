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
            type,
            // Specific fields
            birthday,
            gender,
            vaccinated,
            brand
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
        const productData = new Product({
            name,
            description,
            price,
            categoryId,
            stock,
            imageUrl,
            isActive: true,
            type: category.type
        });
        if (category.type === 'pet') {
            productData.birthday = birthday;
            productData.gender = gender;
            productData.vaccinated = vaccinated;
        }

        if (category.type === 'tool') {
            productData.brand = brand;
        }
        const product = new Product(productData);
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

        // 1) Build base query
        const query = { isActive: true };
        if (category) {
            const catIds = Array.isArray(category) ? category : category.split(',');
            query.categoryId = { $in: catIds };
        }
        if (type) {
            query.type = type;
        }
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

        // 2) Count & fetch page
        const total = await Product.countDocuments(query);
        let qb = Product.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        if (sort) {
            const dir = sort.startsWith('-') ? -1 : 1;
            const field = sort.replace(/^-/, '');
            qb = qb.sort({ [field]: dir });
        } else {
            qb = qb.sort({ createdAt: -1 });
        }

        // 3) Populate and execute
        const products = await qb.populate('categoryId', 'name');

        const productsList = products.map(p => {
            const obj = p.toObject();
            obj.available = obj.stock;
            return obj;
        });

        res.json({
            success: true,
            data: {
                products: productsList,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    } catch (error) {
        console.error(error);
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

        // Use aggregation to get random 4 related products by category or type
        const relatedProducts = await Product.aggregate([
            {
                $match: {
                    _id: { $ne: product._id },
                    isActive: true,
                    $or: [
                        { categoryId: product.categoryId },
                        { type: product.type }
                    ]
                }
            },
            { $sample: { size: 4 } } // <-- random sampling
        ]);

        // Optionally populate categoryId if needed manually
        // (aggregate doesn't support populate directly)
        const populatedProducts = await Product.populate(relatedProducts, {
            path: 'categoryId',
            select: 'name'
        });

        res.json({
            success: true,
            data: populatedProducts
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

exports.searchProducts = async (req, res) => {
    try {
        const { query, limit = 5 } = req.query;

        if (!query || query.length < 2) {
            return res.json({
                success: true,
                data: []
            });
        }

        const products = await Product.find(
            { 
                name: { $regex: query, $options: 'i' },
                isActive: true
            },
            'name imageUrl price type'  // Chỉ lấy các trường cần thiết
        )
        .limit(Number(limit));

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
};