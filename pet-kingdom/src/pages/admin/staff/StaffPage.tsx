// Update in StaffPage.tsx
import React, { useState, useEffect } from "react";
import "./StaffPage.css";
import { staffApi } from "../../../services/admin-api/staffApi";
import { User } from "../../../types/user";

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [newStaff, setNewStaff] = useState<Partial<User>>({
    role: "Shipper",
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const data = await staffApi.getStaffList();
      console.log("Response data:", data); // 👉 kiểm tra kiểu dữ liệu trả về
      const visibleStaff = data.filter((s) => !s.isDeleted);
      setStaff(visibleStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        const updated = await staffApi.updateStaff(editingId, newStaff);
        setStaff(staff.map((s) => (s._id === editingId ? updated.data : s)));
      } else {
        const created = await staffApi.createStaff(newStaff);
        setStaff([...staff, created.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save staff:", error);
    }
  };

  const handleEditStaff = (member: User) => {
    setNewStaff(member);
    setIsAddingStaff(true);
    setIsEditing(true);
    setEditingId(member._id);
  };

  const handleUpdateStaffStatus = async (id: string) => {
    try {
      const updated = await staffApi.toggleStaffStatus(id);
      console.log("Updated staff from API:", updated); // 👉 Kiểm tra response từ API
      setStaff(
        staff.map((s) =>
          s._id === id ? { ...s, isActive: updated.data.isActive } : s
        )
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const resetForm = () => {
    setNewStaff({ role: "Shipper", isActive: true });
    setIsAddingStaff(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDeleteStaff = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );
    if (!confirmDelete) return;

    try {
      await staffApi.deleteStaff(id);
      setStaff(staff.filter((s) => s._id !== id)); // cập nhật UI
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  return (
    <div className="staff-page">
      <div className="staff-page-header">
        <h1>Quản lí nhân viên</h1>
        <button
          className="add-staff-btn"
          onClick={() => {
            setIsAddingStaff(true);
            setNewStaff({ role: "Shipper", isActive: true });
            setIsEditing(false);
          }}
        >
          Thêm nhân viên mới
        </button>
      </div>

      {isAddingStaff && (
        <div className="modal-overlay" onClick={() => setIsAddingStaff(false)}>
          <div
            className="add-staff-form-container"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleAddStaff} className="add-staff-form">
              <h2 style={{ marginBottom: 30 }}>
                {isEditing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
              </h2>
              <div className="form-group">
                <label htmlFor="staffName">Họ tên</label>
                <input
                  id="staffName"
                  type="text"
                  required
                  value={newStaff.name || ""}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="staffEmail">Email</label>
                <input
                  id="staffEmail"
                  type="email"
                  required
                  value={newStaff.email || ""}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="staffPassword">Mật khẩu</label>
                <input
                  id="staffPassword"
                  type="text"
                  required
                  value={newStaff.password || ""}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, password: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="staffPhone">Số điện thoại</label>
                <input
                  id="staffPhone"
                  type="tel"
                  required
                  value={newStaff.phone || ""}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="staffRole">Vai trò</label>
                <select
                  id="staffRole"
                  required
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      role: e.target.value as "Shipper",
                    })
                  }
                >
                  <option value="shipper">Shipper</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsAddingStaff(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {isEditing ? "Lưu thay đổi" : "Thêm nhân viên mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="staff-list">
        <div className="staff-table">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member._id}>
                  <td style={{ fontWeight: 600 }}>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>
                    <span className={`role-badge ${member.role}`}>
                      {member.role.charAt(0).toUpperCase() +
                        member.role.slice(1)}
                    </span>
                  </td>
                  <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        member.isActive ? "active" : "inactive"
                      }`}
                    >
                      {member.isActive ? "Kích hoạt" : "Vô hiệu hóa"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className={`status-toggle-btn ${
                          member.isActive ? "deactivate" : "activate"
                        }`}
                        onClick={() => handleUpdateStaffStatus(member._id)}
                      >
                        {member.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditStaff(member)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteStaff(member._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
