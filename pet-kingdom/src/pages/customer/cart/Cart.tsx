import React, { useState } from "react";
import "./cart.css";

interface Product {
    id: number;
    name: string;
    image: string;
    quantity: number;
}

const Cart: React.FC = () => {
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
            <h2 className="cart-title"> Cart</h2>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Pet Image</th>
                        <th>Pet Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <img style={{marginBottom:"1px"}} src={item.image} alt={item.name} className="cart-image" />
                            </td>
                            <td>{item.name}</td>
                            <td>
                                <div className="quantity-container">
                                    <button onClick={() => handleDecrement(item.id)} className={`quantity-btn decrement-btn ${item.quantity === 1 ? "disabled-btn" : ""}`}
                                        disabled={item.quantity === 1}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleIncrement(item.id)} className="quantity-btn increment-btn">+</button>
                                </div>
                                <button onClick={() => handleRemove(item.id)} className="remove-btn">Remove</button>
                            </td>
                            <td>$50.00</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cart-footer">
                <input type="text" placeholder="Coupon Code" className="coupon-input" />
                <button className="apply-btn">Apply</button>
                <button className="update-btn">Update Cart</button>
            </div>

            <div className="order-summary">
                <h3>Order Details</h3>
                <p>Subtotal: $50.00</p>
                <p>Total: $50.00</p>
                <button className="checkout-btn">Proceed To Checkout</button>
            </div>

        </div>
    );

};

export default Cart;
