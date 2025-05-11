import React, { useEffect, useState } from "react";
import "./cart.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import { cartApi } from '../../../services/customer-api/api';


interface CartItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  stock: number;
  expiresAt: string;
}


const Cart: React.FC = () => {
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/cart/checkout");
  };
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const userId = localStorage.getItem("userId") || "";
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await cartApi.getCart(userId);
        // Giả sử API trả về res.data.data.items: [{ product, quantity }]
        const items = res.data.data.items.map((item: any) => ({
          productId: item.product._id,
          name: item.product.name,
          image: item.product.imageUrl,
          quantity: item.quantity,
          price: item.product.price,
          stock: item.product.stock,
          expiresAt: item.expiresAt
        }));
        setCartItems(items);
      } catch (err) {
        console.error("Load cart failed:", err);
      }
    };
    fetchCart();
  }, [userId]);

  const handleIncrement = async (item: CartItem) => {
    if (item.quantity >= item.stock) return;
    try {
      await cartApi.updateQuantity(userId, item.productId, item.quantity + 1);
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.productId === item.productId
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật số lượng thất bại");
    }
  };

  const handleDecrement = async (item: CartItem) => {
    if (item.quantity <= 1) return;
    try {
      await cartApi.updateQuantity(userId, item.productId, item.quantity - 1);
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.productId === item.productId
            ? { ...ci, quantity: ci.quantity - 1 }
            : ci
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật số lượng thất bại");
    }
  };

  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const handleRemove = async (productId: string) => {
    try {
      await cartApi.removeItem(userId, productId);
      setCartItems((prev) => prev.filter((ci) => ci.productId !== productId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3) Khi `now` thay đổi, remove những item đã hết TTL
  useEffect(() => {
    cartItems.forEach(item => {
      const expireMs = new Date(item.expiresAt).getTime();
      if (now >= expireMs) {
        // tự động xóa
        handleRemove(item.productId);
      }
    });
  }, [now, cartItems]);

  const formatTimeLeft = (ms: number) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="cart-container">
      <p
        className="cart-title"
        style={{ fontSize: "40px", fontWeight: "bold", marginLeft: "30px" }}
      >
        Cart
      </p>
      <div className="cart-items">
        {cartItems.map((item) => {
          const expireMs = new Date(item.expiresAt).getTime();
          const timeLeftMs = expireMs - now;
          return (
            <div key={item.productId} className="cart-card">
              <img src={item.image} alt={item.name} className="cart-image" />
              <div className="cart-details">
                <div className="pet-name-mmoney">
                  <div className="pet-name">
                    <p style={{ fontSize: "30px", fontWeight: "bold" }}>
                      {item.name}
                    </p>
                  </div>
                  <p className="pet-price" style={{ fontSize: "20px" }}>
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="countdown">
                  Expires in: {formatTimeLeft(timeLeftMs)}
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() => handleDecrement(item)}
                    className={`quantity-btn decrement-btn ${item.quantity === 1 ? "disabled-btn" : ""
                      }`}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item)}
                    className="quantity-btn increment-btn"
                  >
                    +
                  </button>
                </div>
                <div className="final-price">
                  <DeleteForeverIcon
                    className="delete-icon"
                    onClick={() => handleRemove(item.productId)}
                  />
                  <p style={{ fontSize: "30px" }}> ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="order-summary">
        <h3>Order Price</h3>
        <p style={{ color: "red" }}>Total: ${totalPrice}</p>
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
