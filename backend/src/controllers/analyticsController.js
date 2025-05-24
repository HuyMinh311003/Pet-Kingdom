const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');


exports.getSalesOverview = async (req, res) => {
    try {
        const { range = 'week' } = req.query;
        // 1. Xác định startDate dựa trên range
        let groupFormat;
        let startDate = new Date();
        if (range === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
            groupFormat = '%Y-%m-%d';          // nhóm theo ngày
        } else if (range === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupFormat = '%Y-%m';             // nhóm theo tháng
        } else {
            startDate.setDate(startDate.getDate() - 6);
            groupFormat = '%Y-%m-%d';          // nhóm theo ngày
        }

        // 2. Aggregation trên Order
        const sales = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: groupFormat, date: '$createdAt' }
                    },
                    amount: { $sum: '$total' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // 3. Định dạng lại key thành date
        const result = sales.map(item => ({
            date: item._id,
            amount: item.amount
        }));

        return res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error in getSalesOverview', error: error.message });
    }
};

exports.getCategorySales = async (req, res) => {
    try {
        const { range = 'week' } = req.query;
        let startDate = new Date();
        if (range === 'month') startDate.setMonth(startDate.getMonth() - 1);
        else if (range === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
        else startDate.setDate(startDate.getDate() - 6);

        const pipeline = [
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: Product.collection.name,
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'prod'
                }
            },
            { $unwind: '$prod' },
            {
                $lookup: {
                    from: Category.collection.name,
                    localField: 'prod.categoryId',
                    foreignField: '_id',
                    as: 'cat'
                }
            },
            { $unwind: '$cat' },
            // lookup parent của category (nếu có)
            {
                $lookup: {
                    from: Category.collection.name,
                    localField: 'cat.parent',
                    foreignField: '_id',
                    as: 'parentCat'
                }
            },
            {
                $unwind: {
                    path: '$parentCat',
                    preserveNullAndEmptyArrays: true
                }
            },
            // xác định key để group: nếu có parent (level-2) thì dùng parentCat.name, ngược lại dùng cat.name
            {
                $addFields: {
                    groupKey: {
                        $cond: [
                            { $ifNull: ['$parentCat.name', false] },
                            '$parentCat.name',
                            '$cat.name'
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$groupKey',
                    sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { sales: -1 } }
        ];

        const stats = await Order.aggregate(pipeline);
        const result = stats.map(x => ({
            category: x._id,
            sales: x.sales
        }));

        return res.json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error in getCategorySales', error: err.message });
    }
};

// Trả về [{ month: 'YYYY-MM', cost: Number, orders: Number }, …]
exports.getDeliveryCosts = async (req, res) => {
    try {
        const months = parseInt(req.query.months) || 6;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - (months - 1));

        // Group theo tháng, tính tổng phí và tổng đơn
        const data = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    totalCost: { $sum: '$shippingFee' },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const result = data.map(d => ({
            month: d._id,
            cost: d.totalCost,
            orders: d.totalOrders
        }));

        return res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error in getDeliveryCosts', error: error.message });
    }
};

