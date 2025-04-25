const Promotion = require('../models/Promotion');

// Create a new promotion
exports.createPromotion = async (req, res) => {
    try {
        const {
            code,
            type,
            value,
            minOrderValue,
            startDate,
            endDate,
            description,
            usageLimit
        } = req.body;

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Check if code already exists
        const existingPromo = await Promotion.findOne({ code });
        if (existingPromo) {
            return res.status(400).json({ message: 'Promotion code already exists' });
        }

        const promotion = new Promotion({
            code,
            type,
            value,
            minOrderValue,
            startDate,
            endDate,
            description,
            usageLimit,
            usageCount: 0,
            isActive: true
        });

        await promotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all promotions with optional filtering
exports.getPromotions = async (req, res) => {
    try {
        const { isActive, type } = req.query;
        let query = {};

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }
        if (type) {
            query.type = type;
        }

        const promotions = await Promotion.find(query);
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get promotion by ID
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update promotion
exports.updatePromotion = async (req, res) => {
    try {
        const {
            code,
            type,
            value,
            minOrderValue,
            startDate,
            endDate,
            description,
            usageLimit,
            isActive
        } = req.body;

        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const promotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            {
                code,
                type,
                value,
                minOrderValue,
                startDate,
                endDate,
                description,
                usageLimit,
                isActive
            },
            { new: true }
        );

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete promotion
exports.deletePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validate and apply promotion
exports.validatePromotion = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        const promotion = await Promotion.findOne({ code, isActive: true });

        if (!promotion) {
            return res.status(404).json({ message: 'Invalid promotion code' });
        }

        // Check if promotion is expired
        const now = new Date();
        if (now < new Date(promotion.startDate) || now > new Date(promotion.endDate)) {
            return res.status(400).json({ message: 'Promotion has expired' });
        }

        // Check usage limit
        if (promotion.usageCount >= promotion.usageLimit) {
            return res.status(400).json({ message: 'Promotion usage limit reached' });
        }

        // Check minimum order value
        if (promotion.minOrderValue && orderTotal < promotion.minOrderValue) {
            return res.status(400).json({
                message: `Minimum order value of ${promotion.minOrderValue} required`
            });
        }

        // Calculate discount
        let discount = 0;
        if (promotion.type === 'percentage') {
            discount = (orderTotal * promotion.value) / 100;
        } else if (promotion.type === 'fixed') {
            discount = promotion.value;
        } else if (promotion.type === 'bundle') {
            discount = Math.floor(orderTotal / promotion.bundleMinItems) * promotion.value;
        }

        res.json({
            promotion,
            discount,
            finalTotal: orderTotal - discount
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Toggle promotion status
exports.toggleStatus = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        promotion.isActive = !promotion.isActive;
        await promotion.save();
        res.json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};