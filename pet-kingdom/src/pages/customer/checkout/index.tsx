import React, { useEffect, useState } from "react";
import "./styles.css";
import BackButton from "../../../components/common/back-button/BackButton";
import {
  getCheckoutInfo,
  placeOrder,
  createZaloPayment
} from "../../../services/customer-api/checkoutApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

interface CartItem {
  product: {
    _id: string;
    name: string;
    imageUrl: string;
    price: number;
  };
  quantity: number;
}

const Checkout: React.FC = () => {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Bank Transfer" | 'CARD'>("COD");
  const [promoCode, setPromoCode] = useState("");
  const [notes, setNotes] = useState("");
  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const res = await getCheckoutInfo();
        setCartItems(res.data.cartItems);
        setSubtotal(res.data.subtotal);
        setShipping(res.data.shipping);
        setDiscount(res.data.discount);
        setTotal(res.data.total);
        setFullName(res.data.user.fullName);
        setPhone(res.data.user.phone);
        setAddress(res.data.user.address);
      } catch (error) {
        console.error("Error loading checkout info:", error);
      }
    };

    fetchCheckout();
  }, []);

  const handleCheckout = async () => {

    try {
      const backendMethod: 'COD' | 'Bank Transfer' = paymentMethod === 'COD' ? 'COD' : 'Bank Transfer';
      const res = await placeOrder({
        name: fullName,
        shippingAddress: address,
        phone,
        paymentMethod: backendMethod,
        promoCode,
        notes,
      });
      const orderId = res.order._id;
      if (paymentMethod !== 'COD') {
        const channel = paymentMethod === 'Bank Transfer' ? 'APP' : (paymentMethod as 'CARD');
        const { orderUrl } = await createZaloPayment(orderId, channel);
        window.location.href = orderUrl;
        return;
      }
      showToast('Đặt hàng thành công!', 'success');
      navigate('/profile/orders');
    } catch (error: any) {  
      const status = error?.response?.status;
      console.log(status);
      showToast("Đặt hàng không thành công", "error");
      if (status === 400) {
        showToast(
          "Một số sản phẩm trong giỏ hàng không còn đủ số lượng. Vui lòng kiểm tra lại giỏ hàng và thử lại.",
          "error"
        );
      } else if (status === 401) {
        showToast("Bạn cần đăng nhập để thực hiện đặt hàng.", "error");
      } else if (status === 500) {
        showToast("Lỗi máy chủ. Vui lòng thử lại sau.", "error");
      }
    }
  };

  return (
    <div className="checkout-container" style={{ position: "relative" }}>
      <BackButton style={{ top: 12, left: 100 }} fallbackPath="/home/cart" />
      <p
        className="checkout-title"
        style={{ fontSize: "40px", fontWeight: "bold" }}
      >
        Thanh toán
      </p>
      <div className="main-container">
        <div className="checkout-info">
          <div className="contact-title">
            <p style={{ fontSize: "20px" }}>Thông tin liên hệ</p>
          </div>
          <div className="firstname">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Họ tên</p>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Họ tên"
            />
          </div>

          <div className="phonenumber">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Số điện thoại</p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
            />
          </div>

          <div className="email">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Ghi chú</p>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú (tùy chọn)"
            />
          </div>

          <div className="delivery-title">
            <p style={{ fontSize: "20px" }}>Vận chuyển</p>
          </div>
          <div className="address">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Địa chỉ</p>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ"
            />
          </div>

          <div className="payment">
            <p style={{ fontSize: "20px" }}>Thanh toán</p>
            <label>
              <input
                type="radio"
                name="paymenttype"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            {/* <label>
              <input
                type="radio"
                name="paymenttype"
                checked={paymentMethod === "Bank Transfer"}
                onChange={() => setPaymentMethod("Bank Transfer")}
              />
              ZaloPay QR
            </label> */}
            <label>
              <input
                type="radio"
                name="paymenttype"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={() => setPaymentMethod("CARD")}
              />
              Credit/Debit Card
            </label>
          </div>
        </div>

        <div className="order-info">
          <div className="yourorder-title">
            <p style={{ fontSize: "20px", fontWeight: 600 }}>Đơn hàng của bạn</p>
            <div className="checkout-item">
              {cartItems.map((item, index) => (
                <div className="checkout-card" key={index}>
                  <img src={item.product.imageUrl} alt={item.product.name} />
                  <div className="yourorder-info">
                    <p style={{ fontSize: "18px" }}>{item.product.name}</p>
                    <div className="price-quantity">
                      <p>{item.product.price.toLocaleString()}đ</p>
                      <p>Số lượng: {item.quantity}</p>
                      <p>
                        Tổng:{" "}
                        {(item.product.price * item.quantity).toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: "20px", fontWeight: 600 }}>Mã giảm giá</p>

          <div className="promo-code">
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="promo-input"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="apply-button">Áp dụng</button>
          </div>
          <div className="checkout-summary">
            <p style={{ fontSize: "18px" }}>
              Tạm tính: {subtotal.toLocaleString()}đ
            </p>
            <p style={{ fontSize: "18px" }}>
              Phí ship: {shipping.toLocaleString()}đ
            </p>
            <p style={{ fontSize: "18px" }}>
              Giảm giá: -{discount.toLocaleString()}đ (Giảm{" "}
              {Math.round((discount / subtotal) * 100)}%)
            </p>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>
              Tổng đơn: {total.toLocaleString()}đ
            </p>
            <button className="checkout-button" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
