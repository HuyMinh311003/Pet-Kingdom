// src/pages/profile/PersonalInfo.tsx

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/customer-api/profileApi";

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user._id) return;

    setUserId(user._id);

    getProfile(user._id)
      .then((res) => {
        const { name, email, phone } = res.data.data;
        setFormData({ name, email, phone });
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!userId) return;

    updateProfile(userId, formData)
      .then(() => alert("Profile updated successfully!"))
      .catch((err) => {
        console.error("Failed to update profile:", err);
        alert("Failed to update profile!");
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
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
