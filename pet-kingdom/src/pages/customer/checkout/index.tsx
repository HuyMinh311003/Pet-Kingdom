import React, { useState } from "react";
import "./styles.css";
interface Product {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

const Checkout: React.FC = () => {
    const [CheckOutItems, setCheckOutItems] = useState<Product[]>([
        { id: 1, name: "Dog", image: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/bernese-mountain-dog.jpg?crop=1.00xw:0.667xh;0,0.213xh&resize=980:*", quantity: 1, price: 550 },
        { id: 2, name: "Cat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg", quantity: 2, price: 550 },
        { id: 3, name: "Rabbit", image: "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869", quantity: 5, price: 550 }
    ]);


    return (
        <div className="checkout-container">
            <p className="checkout-title" style={{ fontSize: "40px" }}>Checkout</p>
            <div className="main-container">
                <div className="checkout-info">
                    <div className="contact-title">
                        <p style={{ fontSize: "20px" }}>Contact details</p>
                    </div>
                    <div className="firstname">
                        <p >First Name</p>
                        <input type="text" placeholder="Your first name" />
                    </div>

                    <div className="lastname">
                        <p>Last name</p>
                        <input type="text" placeholder="Your last name" />
                    </div>

                    <div className="phonenumber">
                        <p>Phone number</p>
                        <input type="text" placeholder="Your phone number" />
                    </div>

                    <div className="email">
                        <p>Email</p>
                        <input type="email" placeholder="Your email address" />
                    </div>
                    <div className="delivery-title">
                        <p style={{ fontSize: "20px" }}>Delivery</p>
                    </div>
                    <div className="address">
                        <p>Your Address</p>
                        <input type="address" placeholder="Your address" />
                    </div>
                    <div className="payment">
                        <p style={{ fontSize: "20px" }}>Payment</p>
                        <label>
                            <input type="radio" name="paymenttype" defaultChecked />
                            Cash on delivery
                        </label>
                        <label>
                            <input type="radio" name="paymenttype" />
                            Online payment
                        </label>
                    </div>
                </div>

                <div className="order-info">
                    <div className="yourorder-title">
                        <p style={{ fontSize: "20px",fontWeight:600 }}>Your Order</p>
                        <div className="checkout-item">
                            {CheckOutItems.map((item) => (
                                <div className="checkout-card">
                                    <img src={item.image} alt={item.image} />
                                    <div className="yourorder-info">
                                        <p style={{ fontSize: "18px", }}>{item.name}</p>
                                        <div className="price-quantity">
                                            <p style={{ fontSize: "15px" }}>{item.price} </p>
                                            <p style={{marginLeft:"10px",fontSize:"15px"}}>Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p style={{ fontSize: "20px" ,fontWeight:600}}>Promo-code</p>

                    <div className="promo-code">
                        <input type="text" placeholder="Enter promo-code" className="promo-input" />
                        <button className="apply-button">Apply</button>
                    </div>
                    <div className="checkout-summary">
                        <p style={{ fontSize: "18px" }}>Subtotal: $40.00</p>
                        <p style={{ fontSize: "18px" }}>Total: $50.00</p>
                        <button className="checkout-button"  >Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );



};

export default Checkout;
