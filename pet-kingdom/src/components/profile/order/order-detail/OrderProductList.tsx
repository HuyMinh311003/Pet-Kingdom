import "./OrderDetailPage.css";

export default function OrderProductList() {
  return (
    <div className="order-product-container">
      <p className="order-subtitle">Sản phẩm trong giỏ hàng</p>
      <div className="order-product-list">
        <div className="order-product-card"></div>
        <div className="order-product-card"></div>
        <div className="order-product-card"></div>
        <div className="order-product-card"></div>
        <div className="order-product-card"></div>
        <div className="order-product-card"></div>
      </div>
    </div>
  );
}
