// seedAnalyticsData.js
require('dotenv').config({ path: './src/config/.env' });
const mongoose = require('mongoose');
const connectDB = require('./src/config/database');
const bcrypt = require('bcryptjs');

const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

async function seed() {
    await connectDB();

    // 1. Clear data cũ
    await Promise.all([
        User.deleteMany({ role: 'Customer' }),
        Category.deleteMany({}),
        Product.deleteMany({}),
        Order.deleteMany({})
    ]);

    // 2. Tạo user mẫu
    const users = [];
    for (let i = 1; i <= 5; i++) {
        const pwd = await bcrypt.hash('password' + i, 10);
        const u = await new User({
            name: `Test User ${i}`,
            email: `user${i}@example.com`,
            password: pwd,
            phone: `09000000${10 + i}`,
            role: 'Customer'
        }).save();
        users.push(u);
    }

    // 3. Tạo category level-2
    const level2 = await Promise.all([
        new Category({ name: 'Dogs', description: 'Thú cưng – Dogs', type: 'pet' }).save(),
        new Category({ name: 'Cats', description: 'Thú cưng – Cats', type: 'pet' }).save(),
        new Category({ name: 'Pet Tools', description: 'Vật dụng cho thú cưng', type: 'tool' }).save()
    ]);

    // 4. Tạo category level-3
    const subs = [];
    // ví dụ Husky, Golden dưới Dogs
    subs.push(await new Category({ name: 'Husky', parent: level2[0]._id, type: 'pet' }).save());
    subs.push(await new Category({ name: 'Golden', parent: level2[0]._id, type: 'pet' }).save());
    // Yellow cat dưới Cats
    subs.push(await new Category({ name: 'Yellow cat', parent: level2[1]._id, type: 'pet' }).save());
    // một số sub dưới Pet Tools
    subs.push(await new Category({ name: 'Dog Bowl', parent: level2[2]._id, type: 'tool' }).save());
    subs.push(await new Category({ name: 'Cat Litter', parent: level2[2]._id, type: 'tool' }).save());

    // 5. Tạo product chỉ gán vào level-3
    const products = [];
    for (let i = 0; i < subs.length; i++) {
        for (let j = 1; j <= 5; j++) {
            const p = new Product({
                name: `${subs[i].name} Item ${j}`,
                description: `Sản phẩm ${subs[i].name} #${j}`,
                price: Math.floor(Math.random() * 5e6) + 1e6,
                categoryId: subs[i]._id,
                stock: Math.floor(Math.random() * 50) + 10,
                imageUrl: `https://via.placeholder.com/150?text=${encodeURIComponent(subs[i].name + j)}`,
                type: subs[i].type,
                // nếu là thú cưng
                ...(subs[i].type === 'pet'
                    ? { birthday: new Date(Date.now() - Math.random() * 31536e6), gender: Math.random() < 0.5 ? 'male' : 'female', vaccinated: true }
                    : { brand: `Brand-${j}` }
                )
            });
            await p.save();
            products.push(p);
        }
    }

    // 6. Tạo orders trải đều 30 ngày
    const now = Date.now();
    for (let d = 0; d < 30; d++) {
        const date = new Date(now - d * 24 * 60 * 60 * 1000);
        const cnt = Math.floor(Math.random() * 5) + 1;
        for (let k = 0; k < cnt; k++) {
            // chọn user ngẫu nhiên
            const u = users[Math.floor(Math.random() * users.length)];
            // chọn 1-3 product
            const chosen = [];
            let subtotal = 0;
            for (let m = 0; m < Math.floor(Math.random() * 3) + 1; m++) {
                const prod = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 3) + 1;
                chosen.push({ product: prod._id, quantity: qty, price: prod.price });
                subtotal += prod.price * qty;
            }
            const shipFee = Math.floor(Math.random() * 3e4) + 2e4;
            // flatten address
            const addrStr = `Số ${Math.floor(Math.random() * 1000)} Đường ABC, P.1, Q.1, HCM`;

            const order = new Order({
                user: u._id,
                items: chosen,
                subtotal,
                shippingFee: shipFee,
                discount: 0,
                total: subtotal + shipFee,
                shippingAddress: addrStr,
                phone: u.phone,
                paymentMethod: 'COD',
                status: 'Đã giao',
                statusHistory: [{
                    status: 'Đã giao',
                    date,
                    note: 'Auto-seeded',
                    updatedBy: u._id
                }]
            });
            order.createdAt = date;
            order.updatedAt = date;
            await order.save();
        }
    }

    console.log('🎉 Seed hoàn tất với cấu trúc 2 level category và chỉ product level-3.');
    mongoose.connection.close();
}

seed().catch(err => {
    console.error(err);
    mongoose.connection.close();
});
