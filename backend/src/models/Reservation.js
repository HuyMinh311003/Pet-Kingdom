// models/Reservation.js
const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

// TTL index trên expiresAt: document sẽ tự delete khi expiresAt < now
module.exports = mongoose.model('Reservation', ReservationSchema);
