import "./OrderDetailPage.css";

export default function OrderInfo() {
  return (
    <div className="order-detail-info-container">
      <div className="order-detail-info">
        <p className="order-subtitle">Thông tin đơn hàng</p>
        <div className="order-info-row">
          <span>Mã đơn hàng:</span> <span>00001</span>
        </div>
        <div className="order-info-row">
          <span>Ngày đặt hàng:</span> <span>10/4/2025</span>
        </div>
        <div className="order-info-row">
          <span>Tên người nhận hàng:</span> <span>Nguyễn Đăng Khoa</span>
        </div>
        <div className="order-info-row">
          <span>Số điện thoại:</span> <span>0123456789</span>
        </div>
        <div className="order-info-row">
          <span>Địa chỉ giao hàng:</span>{" "}
          <span>Số xx/xx, đường ABC, phường x, quận 8, TPHCM</span>
        </div>
      </div>

      <div className="order-payment-info">
        <p className="order-subtitle">Thông tin thanh toán</p>
        <div className="order-info-row">
          <span>Phương thức thanh toán:</span> <span>COD</span>
        </div>
        <div className="order-info-row">
          <span>Tổng tiền sản phẩm:</span> <span>500,000đ</span>
        </div>
        <div className="order-info-row">
          <span>Phí vận chuyển:</span> <span>20,000đ</span>
        </div>
        <div className="order-info-row">
          <span>Giảm giá:</span> <span>-50,000đ</span>
        </div>
        <div className="order-info-row">
          <span>Tổng thanh toán:</span> <span>470,000đ</span>
        </div>
      </div>
    </div>
  );
}
