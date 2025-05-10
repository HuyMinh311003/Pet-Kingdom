const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            phone,
            paymentMethod,
            promoCode
        } = req.body;

        // Validate and calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            // Save current price in order
            orderItems.push({
                product: item.productId,
                quantity: item.quantity,
                price: product.price // Current price when ordering
            });

            subtotal += product.price * item.quantity;

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Apply promotion if valid
        let discount = 0;
        if (promoCode) {
            // TODO: Implement promotion validation and calculation
        }

        // Calculate shipping fee (can be replaced with actual delivery API)
        const shippingFee = 20000; // Default shipping fee

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            subtotal,
            shippingFee,
            discount,
            total: subtotal + shippingFee - discount,
            shippingAddress,
            phone,
            paymentMethod,
            status: 'Chờ xác nhận',
            promoCode,
            statusHistory: [{
                status: 'Chờ xác nhận',
                date: new Date(),
                note: 'Order placed'
            }]
        });

        await order.save();

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { 
            status,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sort = "desc"  // Mặc định là "desc"
        } = req.query;

        const query = {};

        // Add filters
        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const total = await Order.countDocuments(query);

        const sortOrder = sort === "asc" ? 1 : -1;  // Sort ascending (1) hoặc descending (-1)

        const orders = await Order.find(query)
            .sort({ createdAt: sortOrder }) 
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name email')
            .populate('items.product', 'name imageUrl');

        res.json({
            success: true,
            data: {
                orders,
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
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name imageUrl')
            .populate('assignedTo', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check authorization
        if (req.user.role === 'Customer' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, sort = 'desc' } = req.query;
        const query = { user: req.params.userId };

        if (status) query.status = status;

        const total = await Order.countDocuments(query);
        const sortOrder = sort === 'asc' ? 1 : -1;

        const orders = await Order.find(query)
            .sort({ createdAt: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('items.product', 'name imageUrl');

        res.json({
            success: true,
            data: {
                orders,
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
            message: 'Error fetching user orders',
            error: error.message
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Validate status transition
        const validTransitions = {
            'Chờ xác nhận': ['Đã xác nhận', 'Đã hủy'],
            'Đã xác nhận': ['Đang giao', 'Đã hủy'],
            'Đang giao': ['Đã giao', 'Đã hủy'],
            'Đã giao': [],
            'Đã hủy': []
        };

        if (!validTransitions[order.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status transition'
            });
        }

        // Add to status history
        order.statusHistory.push({
            status,
            date: new Date(),
            note,
            updatedBy: req.user._id
        });

        // Update current status
        order.status = status;

        // If order is cancelled, restore product stock
        if (status === 'Đã hủy') {
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

exports.getOrderAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get orders summary
        const orders = await Order.find(query);

        // Calculate analytics
        const analytics = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
            totalShippingFees: orders.reduce((sum, order) => sum + order.shippingFee, 0),
            statusBreakdown: orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {}),
            averageOrderValue: orders.length ? 
                orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0
        };

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order analytics',
            error: error.message
        });
    }
};

// Danh sách order đã xác nhận nhưng shipper chưa chọn
exports.getAssignedOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'desc' } = req.query;

        const query = {
            status: 'Đã xác nhận',
            assignedTo: null
        };

        const total = await Order.countDocuments(query);
        const sortOrder = sort === 'asc' ? 1 : -1;

        const orders = await Order.find(query)
            .sort({ createdAt: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name email')
            .populate('items.product', 'name imageUrl');

        res.json({
            success: true,
            data: {
                orders,
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
            message: 'Error fetching assigned orders',
            error: error.message
        });
    }
};

// Show danh sách order shipper đã chọn
exports.getShipperOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'desc', status } = req.query;

        const query = { assignedTo: req.user._id };
        if (status) query.status = status;

        const total = await Order.countDocuments(query);
        const sortOrder = sort === 'asc' ? 1 : -1;

        const orders = await Order.find(query)
            .sort({ createdAt: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name email')
            .populate('items.product', 'name imageUrl');
            
        res.json({
            success: true,
            data: {
                orders,
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
            message: 'Error fetching orders for shipper',
            error: error.message
        });
    }
};

//Shipper chọn order
exports.assignOrderToShipper = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.assignedTo) {
            return res.status(400).json({
                success: false,
                message: 'Order is already assigned to a shipper'
            });
        }

        if (order.status !== 'Đã xác nhận') {
            return res.status(400).json({
                success: false,
                message: 'Only confirmed orders can be assigned'
            });
        }

        order.assignedTo = req.user._id;
        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning order to shipper',
            error: error.message
        });
    }
};
