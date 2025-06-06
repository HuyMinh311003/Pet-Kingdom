// src/pages/profile/PersonalInfo.tsx

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/customer-api/profileApi";
import { useToast } from "../../contexts/ToastContext";

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [userId, setUserId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user._id) return;

    setUserId(user._id);

    getProfile(user._id)
      .then((res) => {
        const { name, email, phone } = res.data.data;
        setFormData({ name, email, phone });
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        showToast("Không thể tải thông tin cá nhân", "error");
      });
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSave = () => {
    if (!userId) return;

    if (!validatePhoneNumber(formData.phone)) {
      showToast("Vui lòng nhập đúng định dạng số điện thoại", "error");
      return;
    }

    updateProfile(userId, formData)
      .then(() => showToast("Cập nhật thông tin thành công!", "success"))
      .catch((err) => {
        console.error("Failed to update profile:", err);
        showToast("Không thể cập nhật thông tin cá nhân", "error");
      });
  };

  return (
    <div className="tab-content">
      <h2>Personal Information</h2>
      <div className="info-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            maxLength={10}
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
