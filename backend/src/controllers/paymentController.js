const { createOrder } = require('../services/zaloPayService');
const cfg = require('../config/zaloPayConfig');
const crypto = require('crypto');
const Order = require('../models/Order');

exports.createZaloOrder = async (req, res) => {
    try {
        const { orderId, bankCode } = req.body;
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) return res.status(404).json({ success: false, message: 'Order không tồn tại' });

        // format yyMMdd_orderId
        const prefix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        const app_trans_id = `${prefix}_${order._id}`;

        const items = order.items.map(i => ({
            itemid: i.product._id.toString(),
            itemname: i.product.name,
            itemprice: i.price,
            itemquantity: i.quantity
        }));
        const embed_data = { orderId: order._id.toString() };
        const description = `Thanh toán đơn hàng có mã: ${app_trans_id}`;

        const result = await createOrder({
            app_trans_id,
            app_user: order.user.toString(),
            amount: order.total,
            items,
            embed_data,
            description,
            bank_code: bankCode,
        });

        // Kiểm tra mã trả về
        if (result.return_code !== 1) {
            return res.status(400).json({ success: false, message: result.return_message });
        }

        return res.json({
            success: true,
            data: {
                order_url: result.order_url,
                zp_trans_token: result.zp_trans_token
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


exports.zaloCallback = async (req, res) => {
    try {
        const { data, mac } = req.body;
        const dataStr = (typeof data === 'string') ? data : JSON.stringify(data);
        const expectedMac = crypto
            .createHmac('sha256', cfg.key2)
            .update(dataStr)
            .digest('hex');
        if (mac !== expectedMac) {
            return res.status(400).json({
                return_code: -1,
                return_message: 'mac not equal'
            });
        }

        const payload = (typeof data === 'string') ? JSON.parse(data) : data;

        const embedRaw = payload.embed_data ?? {};
        const embed = (typeof embedRaw === 'string')
            ? JSON.parse(embedRaw)
            : embedRaw;
        const orderId = embed.orderId;

        const order = await Order.findById(orderId);
        if (order) {
            order.status = 'Đã xác nhận';
            order.zp_trans_id = payload.zp_trans_id;
            order.callback_time = payload.server_time;
            order.callback_raw = payload;
            order.statusHistory.push({
                status: 'Đã xác nhận',
                date: new Date(payload.server_time),
                updatedBy: order.user
            });
            await order.save();
        }

        return res.json({
            return_code: 1,
            return_message: 'success'
        });

    } catch (err) {
        console.error('ZaloPay callback error:', err);
        return res.json({
            return_code: 0,
            return_message: err.message
        });
    }
};

