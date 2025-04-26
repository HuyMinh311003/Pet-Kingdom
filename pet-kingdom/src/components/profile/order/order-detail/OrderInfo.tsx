import "./OrderDetailPage.css";

interface OrderInfoProps {
  orderData: {
    id: string;
    user: {
      name: string;
      email: string;
    };
    shippingAddress: {
      street: string;
      ward: string;
      district: string;
      city: string;
    };
    phone: string;
    paymentMethod: string;
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
  };
}

export default function OrderInfo({ orderData }: OrderInfoProps) {
  const formatAddress = (address: typeof orderData.shippingAddress) => {
    return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
  };

  return (
    <div className="order-detail-info-container">
      <div className="order-detail-info">
        <p className="order-subtitle">Thông tin đơn hàng</p>
        <div className="order-info-row">
          <span>Tên người nhận hàng:</span>
          <span>{orderData.user.name}</span>
        </div>
        <div className="order-info-row">
          <span>Số điện thoại:</span>
          <span>{orderData.phone}</span>
        </div>
        <div className="order-info-row">
          <span>Địa chỉ giao hàng:</span>
          <span>{formatAddress(orderData.shippingAddress)}</span>
        </div>
      </div>

      <div className="order-payment-info">
        <p className="order-subtitle">Thông tin thanh toán</p>
        <div className="order-info-row">
          <span>Phương thức thanh toán:</span>
          <span>{orderData.paymentMethod}</span>
        </div>
        <div className="order-info-row">
          <span>Tổng tiền sản phẩm:</span>
          <span>{orderData.subtotal.toLocaleString()}đ</span>
        </div>
        <div className="order-info-row">
          <span>Phí vận chuyển:</span>
          <span>{orderData.shippingFee.toLocaleString()}đ</span>
        </div>
        <div className="order-info-row">
          <span>Giảm giá:</span>
          <span>-{orderData.discount.toLocaleString()}đ</span>
        </div>
        <div className="order-info-row">
          <span>Tổng thanh toán:</span>
          <span style={{ color: "#FF9800", fontWeight: "bold" }}>
            {orderData.total.toLocaleString()}đ
          </span>
        </div>
      </div>
    </div>
  );
}
