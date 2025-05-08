const shipper = async (req, res, next) => {
    try {
        if (req.user.role !== 'Shipper') {
            throw new Error('Access denied. Shipper only.');
        }
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            message: 'Access denied',
            error: error.message
        });
    }
};

module.exports = shipper;