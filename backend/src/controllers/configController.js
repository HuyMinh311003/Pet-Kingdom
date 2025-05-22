const ShippingConfig = require("../models/ShippingConfig");
const DiscountConfig = require("../models/DiscountConfig");

//Initialize default configurations
const initializeDefaultConfigs = async () => {
  try {
    // Check and create default shipping config
    const shippingConfig = await ShippingConfig.findOne();
    if (!shippingConfig) {
      await ShippingConfig.create({
        shippingFee: 20000,
      });
      console.log("Default shipping config created");
    }

    // Check and create default discount config
    const discountConfig = await DiscountConfig.findOne();
    if (!discountConfig) {
      await DiscountConfig.create({
        tiers: [
          { minSubtotal: 1000000, discountPercentage: 5 },
          { minSubtotal: 3000000, discountPercentage: 10 },
          { minSubtotal: 5000000, discountPercentage: 15 },
        ],
        isActive: true,
      });
      console.log("Default discount config created");
    }
  } catch (error) {
    console.error("Error initializing default configs:", error);
  }
};

// Call initialization when the server starts
initializeDefaultConfigs();

const configController = {
  // Shipping Config
  getShippingConfig: async (req, res) => {
    try {
      const config = await ShippingConfig.findOne().sort({ updatedAt: -1 });
      res.json({
        success: true,
        data: config || {
          shippingFee: 20000,
          updatedAt: new Date(),
          updatedBy: "system",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  },

  updateShippingConfig: async (req, res) => {
    try {
      const { shippingFee } = req.body;
      if (typeof shippingFee !== "number" || shippingFee < 0) {
        return res.status(400).json({
          success: false,
        });
      }

      // Tìm document cũ nhất và cập nhật
      const oldConfig = await ShippingConfig.findOne().sort({ updatedAt: -1 });
      if (oldConfig) {
        oldConfig.shippingFee = shippingFee;
        oldConfig.updatedAt = new Date();
        oldConfig.updatedBy = req.user._id;
        await oldConfig.save();
      } else {
        // Nếu chưa có config nào, tạo mới
        await ShippingConfig.create({
          shippingFee,
          updatedBy: req.user._id,
        });
      }

      res.json({
        success: true,
        data: {
          shippingFee,
          updatedAt: new Date(),
          updatedBy: req.user._id,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  },

  // Discount Config
  getDiscountConfig: async (req, res) => {
    try {
      const config = await DiscountConfig.findOne().sort({ updatedAt: -1 });
      res.json({
        success: true,
        data: config || {
          tiers: [{ minSubtotal: 0, discountPercentage: 0 }],
          isActive: true,
          updatedAt: new Date(),
          updatedBy: "system",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  },

  updateDiscountConfig: async (req, res) => {
    try {
      const { tiers, isActive } = req.body;

      if (!Array.isArray(tiers) || tiers.length === 0) {
        return res.status(400).json({
          success: false,
        });
      }

      // Validate tiers
      for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        if (
          typeof tier.minSubtotal !== "number" ||
          typeof tier.discountPercentage !== "number" ||
          tier.minSubtotal < 0 ||
          tier.discountPercentage < 0 ||
          tier.discountPercentage > 100
        ) {
          return res.status(400).json({
            success: false,
          });
        }

        // Check if tiers are in ascending order
        if (i > 0 && tier.minSubtotal <= tiers[i - 1].minSubtotal) {
          return res.status(400).json({
            success: false,
          });
        }
      }

      // Tìm document cũ nhất và cập nhật
      const oldConfig = await DiscountConfig.findOne().sort({ updatedAt: -1 });
      if (oldConfig) {
        oldConfig.tiers = tiers;
        oldConfig.isActive = isActive;
        oldConfig.updatedAt = new Date();
        oldConfig.updatedBy = req.user._id;
        await oldConfig.save();
      } else {
        // Nếu chưa có config nào, tạo mới
        await DiscountConfig.create({
          tiers,
          isActive,
          updatedBy: req.user._id,
        });
      }

      res.json({
        success: true,
        data: {
          tiers,
          isActive,
          updatedAt: new Date(),
          updatedBy: req.user._id,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  },

  toggleDiscountSystem: async (req, res) => {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
        });
      }

      // Tìm document cũ nhất và cập nhật
      const oldConfig = await DiscountConfig.findOne().sort({ updatedAt: -1 });
      if (oldConfig) {
        oldConfig.isActive = isActive;
        oldConfig.updatedAt = new Date();
        oldConfig.updatedBy = req.user._id;
        await oldConfig.save();

        res.json({
          success: true,
          data: oldConfig,
        });
      } else {
        // Nếu chưa có config nào, tạo mới với giá trị mặc định
        const newConfig = await DiscountConfig.create({
          tiers: [{ minSubtotal: 0, discountPercentage: 0 }],
          isActive,
          updatedBy: req.user._id,
        });

        res.json({
          success: true,
          data: newConfig,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  },
};

module.exports = configController;
