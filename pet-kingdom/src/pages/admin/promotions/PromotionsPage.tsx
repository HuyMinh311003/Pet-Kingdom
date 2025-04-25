import React, { useState, useEffect } from "react";
import "./PromotionsPage.css";

interface Promotion {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "bundle";
  value: number;
  minOrderValue?: number;
  startDate: string;
  endDate: string;
  description: string;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
}

const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isAddingPromotion, setIsAddingPromotion] = useState(false);
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    type: "percentage",
    isActive: true,
    usageLimit: 100,
    usageCount: 0,
  });

  useEffect(() => {
    // TODO: Fetch promotions from API
    // Using mock data for now
    const mockPromotions: Promotion[] = [
      {
        id: "1",
        code: "WELCOME2025",
        type: "percentage",
        value: 15,
        minOrderValue: 500000,
        startDate: "2025-04-01",
        endDate: "2025-05-01",
        description: "Welcome discount for new customers",
        isActive: true,
        usageLimit: 100,
        usageCount: 45,
      },
      {
        id: "2",
        code: "BUNDLE2PETS",
        type: "bundle",
        value: 20,
        startDate: "2025-04-15",
        endDate: "2025-06-15",
        description: "Buy 2 pets, get 20% off",
        isActive: true,
        usageLimit: 50,
        usageCount: 12,
      },
    ];
    setPromotions(mockPromotions);
  }, []);

  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to add promotion
    setPromotions([
      ...promotions,
      {
        ...newPromotion,
        id: Date.now().toString(),
      } as Promotion,
    ]);
    setNewPromotion({
      type: "percentage",
      isActive: true,
      usageLimit: 100,
      usageCount: 0,
    });
    setIsAddingPromotion(false);
  };

  const handleUpdateStatus = (id: string, isActive: boolean) => {
    // TODO: Implement API call to update promotion status
    setPromotions(
      promotions.map((promo) =>
        promo.id === id ? { ...promo, isActive } : promo
      )
    );
  };

  const handleDeletePromotion = (id: string) => {
    // TODO: Implement API call to delete promotion
    setPromotions(promotions.filter((promo) => promo.id !== id));
  };

  const isPromotionExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isPromotionActive = (promotion: Promotion) => {
    return (
      promotion.isActive &&
      !isPromotionExpired(promotion.endDate) &&
      promotion.usageCount < promotion.usageLimit
    );
  };

  return (
    <div className="promotions-page">
      <div className="promotions-header">
        <h1>Promotions Management</h1>
        <button
          className="add-promotion-btn"
          onClick={() => setIsAddingPromotion(true)}
        >
          Add New Promotion
        </button>
      </div>

      {isAddingPromotion && (
        <div
          className="add-promotion-modal"
          onClick={() => setIsAddingPromotion(false)}
        >
          <div
            className="add-promotion-form-container"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleAddPromotion} className="add-promotion-form">
              <h2 style={{ marginBottom: 30 }}>Add promotion code</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="promoCode">Promotion Code</label>
                  <input
                    id="promoCode"
                    type="text"
                    required
                    value={newPromotion.code || ""}
                    onChange={(e) =>
                      setNewPromotion({ ...newPromotion, code: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="promoType">Type</label>
                  <select
                    id="promoType"
                    required
                    value={newPromotion.type}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        type: e.target.value as Promotion["type"],
                      })
                    }
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bundle">Bundle Offer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="promoValue">
                    {newPromotion.type === "percentage"
                      ? "Discount Percentage"
                      : newPromotion.type === "fixed"
                      ? "Discount Amount (VND)"
                      : "Bundle Discount Percentage"}
                  </label>
                  <input
                    id="promoValue"
                    type="number"
                    required
                    min={0}
                    max={newPromotion.type === "percentage" ? 100 : undefined}
                    value={newPromotion.value || ""}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        value: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minOrderValue">
                    Minimum Order Value (VND)
                  </label>
                  <input
                    id="minOrderValue"
                    type="number"
                    min={0}
                    step={1000}
                    value={newPromotion.minOrderValue || ""}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        minOrderValue: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    required
                    value={newPromotion.startDate || ""}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    required
                    value={newPromotion.endDate || ""}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    required
                    value={newPromotion.description || ""}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usageLimit">Usage Limit</label>
                  <input
                    id="usageLimit"
                    type="number"
                    required
                    min={1}
                    value={newPromotion.usageLimit}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        usageLimit: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsAddingPromotion(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="promotions-list">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="promotion-card">
            <div className="promotion-header">
              <div className="promotion-title">
                <h3>{promotion.code}</h3>
                <span
                  className={`status-badge ${
                    isPromotionActive(promotion) ? "active" : "inactive"
                  }`}
                >
                  {isPromotionActive(promotion) ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="promotion-dates">
                <span>
                  {new Date(promotion.startDate).toLocaleDateString()}
                </span>
                <span>→</span>
                <span>{new Date(promotion.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="promotion-description">{promotion.description}</p>

            <div className="promotion-details">
              <div className="detail-item">
                <span className="label">Type:</span>
                <span className="value">
                  {promotion.type.charAt(0).toUpperCase() +
                    promotion.type.slice(1)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Value:</span>
                <span className="value">
                  {promotion.type === "percentage" ||
                  promotion.type === "bundle"
                    ? `${promotion.value}%`
                    : `${promotion.value.toLocaleString()} VND`}
                </span>
              </div>
              {promotion.minOrderValue && (
                <div className="detail-item">
                  <span className="label">Min Order:</span>
                  <span className="value">
                    {promotion.minOrderValue.toLocaleString()} VND
                  </span>
                </div>
              )}
              <div className="detail-item">
                <span className="label">Usage:</span>
                <span className="value">
                  {promotion.usageCount} / {promotion.usageLimit}
                </span>
              </div>
            </div>

            <div className="promotion-actions">
              <button
                className={`status-toggle-btn ${
                  promotion.isActive ? "deactivate" : "activate"
                }`}
                onClick={() =>
                  handleUpdateStatus(promotion.id, !promotion.isActive)
                }
              >
                {promotion.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeletePromotion(promotion.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;
