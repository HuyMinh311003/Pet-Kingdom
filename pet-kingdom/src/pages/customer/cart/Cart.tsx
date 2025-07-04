import React, { useEffect, useState } from "react";
import "./cart.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from '../../../services/customer-api/api';
import { productApi } from "../../../services/admin-api/productApi";
import { useToast } from "../../../contexts/ToastContext";


interface CartItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  stock: number;
  overStock: boolean;
  expiresAt: string;
}


const Cart: React.FC = () => {
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/cart/checkout");
  };
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

  const stored = localStorage.getItem('user');
  if (!stored) return;
  const userId = JSON.parse(stored)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchCart = async () => {
      try {
        // 1) Lấy cart items
        const resCart = await cartApi.getCart(userId._id);
        // 2) Với mỗi item, fetch stock mới nhất
        const items: CartItem[] = await Promise.all(
          resCart.data.data.items.map(async (it: any) => {
            const prodRes = await productApi.getProductById(it.product._id);
            const stock = prodRes.data.stock;
            return {
              productId: it.product._id,
              name: it.product.name,
              image: it.product.imageUrl,
              quantity: it.quantity,
              price: it.product.price,
              stock,
              overStock: it.quantity > stock,
            };
          })
        );
        setCartItems(items);
        if (items.some(i => i.overStock)) {
          showToast('Một số sản phẩm trong giỏ đã vượt quá tồn kho, vui lòng điều chỉnh.', 'warning');
        }
      } catch (err) {
        console.error("Load cart failed:", err);
      }
    };
    fetchCart();
  }, []);


  const handleIncrement = async (item: CartItem) => {
    if (item.quantity >= item.stock) return;
    try {
      await cartApi.updateQuantity(userId._id, item.productId, item.quantity + 1);
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.productId === item.productId
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        )
      );
    } catch (err: any) {
      showToast(err.response?.data?.message || "Cập nhật số lượng thất bại", "error");
    }
  };

  const handleDecrement = async (item: CartItem) => {
    if (item.quantity <= 1) return;
    try {
      await cartApi.updateQuantity(userId._id, item.productId, item.quantity - 1);
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.productId === item.productId
            ? { ...ci, quantity: ci.quantity - 1 }
            : ci
        )
      );
    } catch (err: any) {
      showToast(err.response?.data?.message || "Cập nhật số lượng thất bại", "error");
    }
  };

  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleRemove = async (productId: string) => {
    try {
      await cartApi.removeItem(userId._id, productId);
      setCartItems((prev) => prev.filter((ci) => ci.productId !== productId));
    } catch (err: any) {
      showToast(err.response?.data?.message || "Xóa sản phẩm thất bại", "error");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <p>Giỏ hàng của bạn đang trống.</p>
        <Link to="/products" className="checkout-btn">
          Mua ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <p
        className="cart-title"
        style={{ fontSize: "40px", fontWeight: "bold", marginLeft: "30px" }}
      >
        Giỏ hàng của bạn
      </p>
      <div className="cart-items">
        {cartItems.map((item) => {
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
                    {(item.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </p>
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
                {item.overStock && (
                  <p style={{ color: 'red', margin: '4px 0' }}>
                    Chỉ còn {item.stock} sản phẩm trong kho.
                  </p>
                )}
                <div className="final-price">
                  <DeleteForeverIcon
                    className="delete-icon"
                    onClick={() => handleRemove(item.productId)}
                  />
                  <p style={{ fontSize: "30px" }}> {(item.price * item.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="order-summary">
        <h3>Giá trị đơn hàng</h3>
        <p style={{ color: "red" }}>Tổng: {totalPrice}</p>
        <button className="checkout-btn" onClick={handleCheckout} disabled={cartItems.some(i => i.overStock)}>
          Đến trang thanh toán
        </button>
      </div>


    </div>

  );
};

export default Cart;
