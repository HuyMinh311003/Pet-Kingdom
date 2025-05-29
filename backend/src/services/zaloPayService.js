const axios = require('axios');
const crypto = require('crypto');
const cfg = require('../config/zaloPayConfig');

async function createOrder({
    app_trans_id,
    app_user,
    amount,
    items = [],
    embed_data = {},
    description,
    bank_code = 'zalopayapp' | 'CC',
    bank_group
}) {
    const app_time = Date.now();
    if (bank_group) embed_data.bankgroup = bank_group;
    const itemStr = JSON.stringify(items);
    const fullEmbed = {
        ...embed_data,
        redirecturl: cfg.redirect_url
    };
    const embedStr = JSON.stringify(fullEmbed);
    const raw = [
        cfg.app_id, app_trans_id, app_user,
        amount, app_time, embedStr, itemStr
    ].join('|');
    const mac = crypto
        .createHmac('sha256', cfg.key1)
        .update(raw)
        .digest('hex');

    const params = new URLSearchParams();
    params.append('app_id', cfg.app_id);
    params.append('app_trans_id', app_trans_id);
    params.append('app_user', app_user);
    params.append('app_time', app_time);
    params.append('amount', amount);
    params.append('item', itemStr);
    params.append('embed_data', embedStr);
    params.append('description', description);
    params.append('bank_code', bank_code);
    params.append('mac', mac);

    const { data } = await axios.post(
        cfg.endpoint,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('🔔 ZaloPay createOrder response:', data);
    return data;
}

module.exports = { createOrder };
