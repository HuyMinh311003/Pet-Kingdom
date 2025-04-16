import React, { useState } from "react";
import "./styles.css";
import BackButton from "../../../components/common/back-button/BackButton";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const [CheckOutItems, setCheckOutItems] = useState<Product[]>([
    {
      id: 1,
      name: "Dog",
      image:
        "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/bernese-mountain-dog.jpg?crop=1.00xw:0.667xh;0,0.213xh&resize=980:*",
      price: 550000,
      quantity: 1,
    },
    {
      id: 2,
      name: "Cat",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg",
      price: 550000,
      quantity: 1,
    },
    {
      id: 3,
      name: "Rabbit A",
      image:
        "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869",
      price: 550000,
      quantity: 1,
    },
    {
      id: 4,
      name: "Rabbit B",
      image:
        "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869",
      price: 550000,
      quantity: 1,
    },
    {
      id: 5,
      name: "Rabbit C",
      image:
        "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869",
      price: 550000,
      quantity: 1,
    },
  ]);

  return (
    <div className="checkout-container" style={{ position: "relative" }}>
      <BackButton style={{ top: 12, left: 100 }} fallbackPath="/home/cart" />
      <p
        className="checkout-title"
        style={{ fontSize: "40px", fontWeight: "bold" }}
      >
        Checkout
      </p>
      <div className="main-container">
        <div className="checkout-info">
          <div className="contact-title">
            <p style={{ fontSize: "20px" }}>Contact details</p>
          </div>
          <div className="firstname">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>First Name</p>
            <input type="text" placeholder="Your first name" />
          </div>

          <div className="lastname">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Last name</p>
            <input type="text" placeholder="Your last name" />
          </div>

          <div className="phonenumber">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Phone number</p>
            <input type="text" placeholder="Your phone number" />
          </div>

          <div className="email">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Email</p>
            <input type="email" placeholder="Your email address" />
          </div>
          <div className="delivery-title">
            <p style={{ fontSize: "20px" }}>Delivery</p>
          </div>
          <div className="address">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Your Address</p>
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
            <p style={{ fontSize: "20px", fontWeight: 600 }}>Your Order</p>
            <div className="checkout-item">
              {CheckOutItems.map((item) => (
                <div className="checkout-card">
                  <img src={item.image} alt={item.name} />
                  <div className="yourorder-info">
                    <p style={{ fontSize: "18px" }}>{item.name}</p>
                    <div className="price-quantity">
                      <p>{item.price}</p>
                      <p>Số lượng: {item.quantity}</p>
                      <p>
                        Tổng:{" "}
                        {`${(
                          Number(item.price) * item.quantity
                        ).toLocaleString()}đ`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: "20px", fontWeight: 600 }}>Promo-code</p>

          <div className="promo-code">
            <input
              type="text"
              placeholder="Enter promo-code"
              className="promo-input"
            />
            <button className="apply-button">Apply</button>
          </div>
          <div className="checkout-summary">
            <p style={{ fontSize: "18px" }}>Subtotal: 500000</p>
            <p style={{ fontSize: "18px" }}>Total: 500000</p>
            <button className="checkout-button">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
