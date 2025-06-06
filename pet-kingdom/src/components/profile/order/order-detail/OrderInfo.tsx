import "./OrderDetailPage.css";
import { Order } from "../../../../types/order";

type Props = {
  order: Order;
};

export default function OrderInfo({ order }: Props) {
  // Format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="order-detail-info-container">
      <div className="order-detail-info">
        <p className="order-subtitle">Thông tin đơn hàng</p>
        <div className="order-info-row">
          <span>Mã đơn hàng:</span> <span>{order._id}</span>
        </div>
        <div className="order-info-row">
          <span>Ngày đặt hàng:</span> <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-info-row">
          <span>Tên người nhận hàng:</span>{" "}
          <span>{order.name}</span>
        </div>
        <div className="order-info-row">
          <span>Số điện thoại:</span> <span>{order.phone}</span>
        </div>
        <div className="order-info-row">
          <span>Địa chỉ giao hàng:</span> <span>{order.shippingAddress}</span>
        </div>
        <div className="order-info-row">
          <span>Ghi chú:</span> <span>{order.notes || "Không có"}</span>
        </div>
      </div>

      <div className="order-payment-info">
        <p className="order-subtitle">Thông tin thanh toán</p>
        <div className="order-info-row">
          <span>PT thanh toán:</span> <span>{order.paymentMethod}</span>
        </div>
        <div className="order-info-row">
          <span>Tổng tiền sản phẩm:</span>{" "}
          <span>{order.subtotal.toLocaleString()}đ</span>
        </div>
        <div className="order-info-row">
          <span>Phí vận chuyển:</span>{" "}
          <span>{order.shippingFee.toLocaleString()}đ</span>
        </div>
        <div className="order-info-row">
          <span>Giảm giá:</span>{" "}
          <span>-{order.discount.toLocaleString()}đ</span>
        </div>
        <div className="order-info-row">
          <span>Tổng thanh toán:</span>{" "}
          <span>{order.total.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
}
