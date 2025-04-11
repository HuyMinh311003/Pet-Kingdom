import React, { useState } from "react";
import "./cart.css";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from "react-router-dom";
interface Product {
    id: number;
    name: string;
    image: string;
    quantity: number;
}

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const handleCheckout = () => {
        navigate("/checkout");
    };
    const [cartItems, setCartItems] = useState<Product[]>([
        { id: 1, name: "Dog", image: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/bernese-mountain-dog.jpg?crop=1.00xw:0.667xh;0,0.213xh&resize=980:*", quantity: 1 },
        { id: 2, name: "Cat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg", quantity: 2 },
        { id: 3, name: "Rabbit", image: "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869", quantity: 5 }
    ]);

    const handleIncrement = (id: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecrement = (id: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleRemove = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <div className="cart-container">
            <p className="cart-title" style={{fontSize:"40px",fontWeight:"bold",marginLeft:"30px"}}>Cart</p>
            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-card">
                        <img src={item.image} alt={item.name} className="cart-image" />
                        <div className="cart-details">
                            <div className="pet-name-mmoney">
                                <div className="pet-name">
                                    <p style={{fontSize:"30px",fontWeight:"bold"}}>{item.name}</p>
                                </div>
                                <p className="pet-price"style={{fontSize:"20px",fontWeight:"bold"}}>$50.00</p>
                            </div>
                            <div className="quantity-control">
                                <button onClick={() => handleDecrement(item.id)}
                                    className={`quantity-btn decrement-btn ${item.quantity === 1 ? "disabled-btn" : ""}`}
                                    disabled={item.quantity === 1}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleIncrement(item.id)} className="quantity-btn increment-btn">+</button>
                            </div>
                            <div className="final-price">
                                <DeleteForeverIcon  className="delete-icon" onClick={() => handleRemove(item.id)} />
                                <p style={{fontSize:"30px"}}> $50.00</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-footer">
                <input type="text" placeholder="Coupon Code" className="coupon-input" />
                <button className="apply-btn">Apply</button>
            </div>

            <div className="order-summary">
                <h3>Order Details</h3>
                <p>Total: $50.00</p>
                <button className="checkout-btn" onClick={handleCheckout} >Proceed To Checkout</button>
            </div>
        </div>
    );



};

export default Cart;
