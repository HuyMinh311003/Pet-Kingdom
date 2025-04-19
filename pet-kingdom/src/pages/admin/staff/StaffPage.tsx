// Update in StaffPage.tsx
import React, { useState, useEffect } from "react";
import "./StaffPage.css";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "shipper";
  phoneNumber: string;
  isActive: boolean;
  joinDate: string;
  password: string;
}

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    role: "shipper",
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  //Điều kiện bật tắt popup, state là true thì bật popup
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const mockStaff: StaffMember[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@petkingdom.com",
        role: "admin",
        phoneNumber: "0123456789",
        isActive: true,
        joinDate: "2025-01-01",
        password: "123456",
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane.doe@petkingdom.com",
        role: "shipper",
        phoneNumber: "0987654321",
        isActive: true,
        joinDate: "2025-02-15",
        password: "123456",
      },
    ];
    setStaff(mockStaff);
  }, []);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      setStaff(
        staff.map((member) =>
          member.id === editingId
            ? { ...member, ...(newStaff as StaffMember) }
            : member
        )
      );
    } else {
      setStaff([
        ...staff,
        {
          ...newStaff,
          id: Date.now().toString(),
          joinDate: new Date().toISOString().split("T")[0],
        } as StaffMember,
      ]);
    }
    setNewStaff({ role: "shipper", isActive: true });
    setIsAddingStaff(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditStaff = (member: StaffMember) => {
    setNewStaff(member);
    setIsAddingStaff(true);
    setIsEditing(true);
    setEditingId(member.id);
  };

  const handleUpdateStaffStatus = (id: string, isActive: boolean) => {
    setStaff(
      staff.map((member) =>
        member.id === id ? { ...member, isActive } : member
      )
    );
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id));
  };

  return (
    <div className="staff-page">
      <div className="staff-page-header">
        <h1>Staff Management</h1>
        <button
          className="add-staff-btn"
          onClick={() => {
            setIsAddingStaff(true);
            setNewStaff({ role: "shipper", isActive: true });
            setIsEditing(false);
          }}
        >
          Add New Staff
        </button>
      </div>

      {isAddingStaff && (
        <div className="modal-overlay" onClick={() => setIsAddingStaff(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddStaff} className="add-staff-form">
              <h2 style={{ marginBottom: 30 }}>
                {isEditing ? "Edit Staff" : "Add New Staff"}
              </h2>
              <div className="form-group">
                <label htmlFor="staffName">Full Name</label>
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
                <label htmlFor="staffPassword">Password</label>
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
                <label htmlFor="staffPhone">Phone Number</label>
                <input
                  id="staffPhone"
                  type="tel"
                  required
                  value={newStaff.phoneNumber || ""}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, phoneNumber: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="staffRole">Role</label>
                <select
                  id="staffRole"
                  required
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      role: e.target.value as "admin" | "shipper",
                    })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="shipper">Shipper</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsAddingStaff(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {isEditing ? "Save Changes" : "Add Staff Member"}
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td style={{ fontWeight: 600 }}>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phoneNumber}</td>
                  <td>
                    <span className={`role-badge ${member.role}`}>
                      {member.role.charAt(0).toUpperCase() +
                        member.role.slice(1)}
                    </span>
                  </td>
                  <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        member.isActive ? "active" : "inactive"
                      }`}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className={`status-toggle-btn ${
                          member.isActive ? "deactivate" : "activate"
                        }`}
                        onClick={() =>
                          handleUpdateStaffStatus(member.id, !member.isActive)
                        }
                      >
                        {member.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditStaff(member)}
                        style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteStaff(member.id)}
                      >
                        Delete
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
