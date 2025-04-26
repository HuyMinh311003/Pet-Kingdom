import "./OrderDetailPage.css";

interface OrderItem {
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

interface OrderProductListProps {
  items: OrderItem[];
}

export default function OrderProductList({ items }: OrderProductListProps) {
  return (
    <div className="order-product-container">
      <p className="order-subtitle">Sản phẩm trong đơn hàng</p>
      <div className="order-product-list">
        {items.map((item) => (
          <div key={item.product.id} className="order-product-card">
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div className="order-product-info">
              <p style={{ fontSize: "18px" }}>{item.product.name}</p>
              <div className="order-price-quantity">
                <p>{item.price.toLocaleString()}đ</p>
                <p>Số lượng: {item.quantity}</p>
                <p>
                  Tổng: {(item.price * item.quantity).toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
