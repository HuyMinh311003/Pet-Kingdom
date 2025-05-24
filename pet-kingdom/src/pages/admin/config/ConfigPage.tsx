import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import {
  configApi,
  type DiscountTier,
} from "../../../services/admin-api/configApi";
import "./ConfigPage.css";

const ConfigPage = () => {
  const { showToast } = useToast();
  const [shippingFee, setShippingFee] = useState<number>(20000);
  const [discountTiers, setDiscountTiers] = useState<DiscountTier[]>([
    { minSubtotal: 0, discountPercentage: 0 },
  ]);
  const [isDiscountActive, setIsDiscountActive] = useState<boolean>(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const [shippingRes, discountRes] = await Promise.all([
        configApi.getShippingConfig(),
        configApi.getDiscountConfig(),
      ]);

      if (shippingRes.success) {
        setShippingFee(shippingRes.data.shippingFee);
      }

      if (discountRes.success) {
        setDiscountTiers(discountRes.data.tiers);
        setIsDiscountActive(discountRes.data.isActive);
      }
    } catch (error) {
      showToast("Không thể tải cài đặt", "error");
    }
  };

  const handleShippingFeeChange = async () => {
    try {
      const response = await configApi.updateShippingConfig({ shippingFee });
      if (response.success) {
        showToast("Cập nhật phí vận chuyển thành công", "success");
      }
    } catch (error) {
      showToast("Không thể cập nhật phí vận chuyển", "error");
    }
  };

  const validateAndUpdateTier = (
    index: number,
    field: keyof DiscountTier,
    value: number
  ) => {
    const newTiers = [...discountTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setDiscountTiers(newTiers);
  };

  const handleDiscountTierChange = (
    index: number,
    field: keyof DiscountTier,
    value: string
  ) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      validateAndUpdateTier(index, field, numericValue);
    }
  };

  const validateDiscountConfig = () => {
    // Kiểm tra các tier
    for (let i = 0; i < discountTiers.length; i++) {
      const tier = discountTiers[i];

      // Kiểm tra giá trị âm
      if (tier.minSubtotal < 0) {
        showToast("Tổng tiền tối thiểu không được âm", "error");
        return false;
      }
      if (tier.discountPercentage < 0) {
        showToast("Phần trăm giảm giá không được âm", "error");
        return false;
      }

      // Kiểm tra phần trăm không vượt quá 100
      if (tier.discountPercentage > 100) {
        showToast("Phần trăm giảm giá không được vượt quá 100%", "error");
        return false;
      }

      // Kiểm tra thứ tự tăng dần của minSubtotal
      if (i > 0 && tier.minSubtotal <= discountTiers[i - 1].minSubtotal) {
        showToast(
          `Tổng tiền tối thiểu của Tier ${i + 1} phải lớn hơn Tier ${i}`,
          "error"
        );
        return false;
      }
    }

    return true;
  };

  const handleDiscountConfigSave = async () => {
    if (!validateDiscountConfig()) {
      return;
    }

    try {
      const response = await configApi.updateDiscountConfig({
        tiers: discountTiers,
        isActive: isDiscountActive,
      });
      if (response.success) {
        showToast("Cập nhật cấu hình giảm giá thành công", "success");
      }
    } catch (error) {
      showToast("Không thể cập nhật cài đặt giảm giá", "error");
    }
  };

  const addDiscountTier = () => {
    const lastTier = discountTiers[discountTiers.length - 1];
    setDiscountTiers([
      ...discountTiers,
      {
        minSubtotal: lastTier.minSubtotal + 1000000, // Tự động tăng 1tr cho tier mới
        discountPercentage: Math.min(lastTier.discountPercentage + 5, 100), // Tự động tăng 5% nhưng không vượt quá 100%
      },
    ]);
  };

  const removeDiscountTier = (index: number) => {
    const newTiers = discountTiers.filter((_, i) => i !== index);
    setDiscountTiers(newTiers);
  };

  const handleDiscountSystemToggle = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStatus = e.target.checked;
    try {
      const response = await configApi.toggleDiscountSystem({
        isActive: newStatus,
      });
      if (response.success) {
        setIsDiscountActive(newStatus);
        showToast(
          newStatus ? "Đã bật hệ thống giảm giá" : "Đã tắt hệ thống giảm giá",
          "success"
        );
      }
    } catch (error) {
      showToast("Không thể thay đổi trạng thái hệ thống giảm giá", "error");
      // Revert checkbox state if failed
      setIsDiscountActive(!newStatus);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="config-page">
      <h1>Cài đặt cấu hình</h1>

      <div className="config-section">
        <h2>Phí vận chuyển</h2>
        <div className="config-shipping">
          <input
            type="number"
            value={shippingFee}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value)) {
                setShippingFee(value);
              }
            }}
            min="0"
            step="1000"
          />
          <span className="config-currency">{formatCurrency(shippingFee)}</span>
          <button className="config-button" onClick={handleShippingFeeChange}>
            Cập nhật phí vận chuyển
          </button>
        </div>
      </div>

      <div className="config-section">
        <h2>Cấp giảm giá</h2>
        <div className="config-discount">
          <div className="config-discount-header">
            <label>
              <input
                type="checkbox"
                checked={isDiscountActive}
                onChange={handleDiscountSystemToggle}
              />
              Bật hệ thống giảm giá
            </label>
          </div>

          {discountTiers.map((tier, index) => (
            <div key={index} className="config-discount-tier">
              <div className="config-tier-number">Tier {index + 1}</div>
              <div className="config-tier-inputs">
                <div className="config-input-group">
                  <input
                    type="number"
                    value={tier.minSubtotal}
                    onChange={(e) =>
                      handleDiscountTierChange(
                        index,
                        "minSubtotal",
                        e.target.value
                      )
                    }
                    placeholder="Tổng tiền tối thiểu"
                    min="0"
                    step="1000"
                  />
                  <span className="config-currency">
                    {formatCurrency(tier.minSubtotal)}
                  </span>
                </div>
                <div className="config-input-group">
                  <input
                    type="number"
                    value={tier.discountPercentage}
                    onChange={(e) =>
                      handleDiscountTierChange(
                        index,
                        "discountPercentage",
                        e.target.value
                      )
                    }
                    placeholder="Phần trăm giảm giá"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <span className="config-percentage">
                    {tier.discountPercentage}%
                  </span>
                </div>
                <button
                  className="config-button remove-discount-tier"
                  onClick={() => removeDiscountTier(index)}
                >
                  Xóa cấp giảm giá
                </button>
              </div>
            </div>
          ))}

          <button
            className="config-button add-discount-tier"
            onClick={addDiscountTier}
          >
            Thêm cấp giảm giá
          </button>
          <button
            className="config-button save-discount"
            onClick={handleDiscountConfigSave}
          >
            Lưu cài đặt giảm giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
