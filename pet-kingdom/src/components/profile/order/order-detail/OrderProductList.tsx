import { useState } from "react";
import "./OrderDetailPage.css";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function OrderProductList() {
  const [CheckOutItems, setCheckOutItems] = useState<Product[]>([
    {
      id: 1,
      name: "Dog A",
      image:
        "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/bernese-mountain-dog.jpg?crop=1.00xw:0.667xh;0,0.213xh&resize=980:*",
      price: 550000,
      quantity: 1,
    },
    {
      id: 2,
      name: "Dog B",
      image:
        "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/bernese-mountain-dog.jpg?crop=1.00xw:0.667xh;0,0.213xh&resize=980:*",
      price: 550000,
      quantity: 1,
    },
    {
      id: 3,
      name: "Cat",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg",
      price: 550000,
      quantity: 1,
    },
    {
      id: 4,
      name: "Rabbit A",
      image:
        "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869",
      price: 550000,
      quantity: 1,
    },
    {
      id: 5,
      name: "Rabbit B",
      image:
        "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869",
      price: 550000,
      quantity: 1,
    },
    {
      id: 6,
      name: "Rabbit C",
      image:
        "https://cdn.shopify.com/s/files/1/0040/8997/0777/files/Cute_Bunny_7d_1024x1024.jpg?v=1698453869",
      price: 550000,
      quantity: 1,
    },
  ]);

  return (
    <div className="order-product-container">
      <p className="order-subtitle">Sản phẩm trong giỏ hàng</p>
      <div className="order-product-list">
        {CheckOutItems.map((item) => (
          <div className="order-product-card">
            <img src={item.image} alt={item.name} />
            <div className="order-product-info">
              <p style={{ fontSize: "18px" }}>{item.name}</p>
              <div className="order-price-quantity">
                <p>{item.price}</p>
                <p>Số lượng: {item.quantity}</p>
                <p>
                  Tổng:{" "}
                  {`${(Number(item.price) * item.quantity).toLocaleString()}đ`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
