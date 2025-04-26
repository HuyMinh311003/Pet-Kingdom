const admin = async (req, res, next) => {
    try {
        if (req.user.role !== 'Admin') {
            throw new Error('Access denied. Admin only.');
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

module.exports = admin;