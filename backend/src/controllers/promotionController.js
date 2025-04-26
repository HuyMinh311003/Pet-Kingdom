const Promotion = require('../models/Promotion');

exports.createPromotion = async (req, res) => {
    try {
        const {
            code,
            type,
            value,
            startDate,
            endDate,
            minOrderValue,
            maxDiscount,
            usageLimit,
            productType,
            categories,
            description
        } = req.body;

        // Validate dates
        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Check if code already exists
        const existingPromo = await Promotion.findOne({ code: code.toUpperCase() });
        if (existingPromo) {
            return res.status(400).json({
                success: false,
                message: 'Promotion code already exists'
            });
        }

        const promotion = new Promotion({
            code: code.toUpperCase(),
            type,
            value,
            startDate,
            endDate,
            minOrderValue,
            maxDiscount,
            usageLimit,
            productType,
            categories,
            description
        });

        await promotion.save();

        res.status(201).json({
            success: true,
            data: promotion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating promotion',
            error: error.message
        });
    }
};

exports.getPromotions = async (req, res) => {
    try {
        const {
            isActive,
            productType,
            search,
            current = false,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        // Filter by active status
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Filter by product type
        if (productType) {
            query.productType = productType;
        }

        // Filter current promotions
        if (current === 'true') {
            const now = new Date();
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
            query.isActive = true;
        }

        // Search by code or description
        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Promotion.countDocuments(query);

        const promotions = await Promotion.find(query)
            .populate('categories', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: {
                promotions,
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
            message: 'Error fetching promotions',
            error: error.message
        });
    }
};

exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id)
            .populate('categories', 'name');

        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found'
            });
        }

        res.json({
            success: true,
            data: promotion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching promotion',
            error: error.message
        });
    }
};

exports.validatePromoCode = async (req, res) => {
    try {
        const { code, orderValue, productType } = req.body;

        const promotion = await Promotion.findOne({ 
            code: code.toUpperCase(),
            isActive: true
        });

        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Invalid promotion code'
            });
        }

        if (!promotion.isValid(orderValue, productType)) {
            return res.status(400).json({
                success: false,
                message: 'Promotion code is not applicable',
                data: {
                    minOrderValue: promotion.minOrderValue,
                    productType: promotion.productType,
                    endDate: promotion.endDate
                }
            });
        }

        const discount = promotion.calculateDiscount(orderValue);

        res.json({
            success: true,
            data: {
                promotion,
                discount
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error validating promotion code',
            error: error.message
        });
    }
};

exports.updatePromotion = async (req, res) => {
    try {
        const updates = req.body;

        // Don't allow updating the code
        delete updates.code;
        delete updates.usageCount;

        // Validate dates if updating
        if (updates.startDate && updates.endDate) {
            if (new Date(updates.endDate) <= new Date(updates.startDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }

        const promotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('categories', 'name');

        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found'
            });
        }

        res.json({
            success: true,
            data: promotion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating promotion',
            error: error.message
        });
    }
};

exports.deletePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);

        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found'
            });
        }

        res.json({
            success: true,
            message: 'Promotion deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting promotion',
            error: error.message
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);

        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found'
            });
        }

        promotion.isActive = !promotion.isActive;
        await promotion.save();

        res.json({
            success: true,
            data: {
                id: promotion._id,
                isActive: promotion.isActive
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error toggling promotion status',
            error: error.message
        });
    }
};