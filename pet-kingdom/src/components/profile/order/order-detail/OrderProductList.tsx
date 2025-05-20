import "./OrderDetailPage.css";
import { Order } from "../../../../types/order";

type Props = {
  order: Order;
};

export default function OrderProductList({ order }: Props) {
  const getProductInfo = (product: any) => {
    if (typeof product === "string") return `Product ID: ${product}`;
    if (typeof product === "object" && product !== null) {
      return {
        name: product.name || "Unknown Product",
        imageUrl: product.imageUrl || "https://via.placeholder.com/150",
      };
    }
    return {
      name: "Unknown Product",
      imageUrl: "https://via.placeholder.com/150",
    };
  };

  return (
    <div className="order-product-container">
      <p className="order-subtitle">Sản phẩm trong đơn hàng</p>
      <div className="order-product-list">
        {order.items.map((item, index) => {
          const productInfo = getProductInfo(item.product);
          return (
            <div key={index} className="order-product-card">
              <img
                src={
                  typeof productInfo === "string"
                    ? "https://via.placeholder.com/150"
                    : productInfo.imageUrl
                }
                alt={
                  typeof productInfo === "string"
                    ? `Product ${index + 1}`
                    : productInfo.name
                }
              />
              <div className="order-product-info">
                <p style={{ fontSize: "18px" }}>
                  {typeof productInfo === "string"
                    ? productInfo
                    : productInfo.name}
                </p>
                <div className="order-price-quantity">
                  <p>{item.price.toLocaleString()}đ</p>
                  <p>Số lượng: {item.quantity}</p>
                  <p>
                    Tổng: {`${(item.price * item.quantity).toLocaleString()}đ`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
