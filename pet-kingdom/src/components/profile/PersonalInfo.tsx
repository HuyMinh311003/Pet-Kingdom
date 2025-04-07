// src/pages/profile/PersonalInfo.tsx


export default function PersonalInfo() {
  return (
    <div className="tab-content">
      <h2>Personal Information</h2>
      <div className="info-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" defaultValue="Nguyễn Đăng Khoa" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" defaultValue="khoa.nd@example.com" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" defaultValue="+1 234 567 890" />
        </div>
        <button className="save-button">Save Changes</button>
      </div>
    </div>
  );
}
