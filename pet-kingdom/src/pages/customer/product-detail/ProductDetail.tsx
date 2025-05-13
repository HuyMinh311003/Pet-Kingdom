import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Product } from "../../../types/admin";
import { productApi } from "../../../services/admin-api/productApi";

import RelatedList from "../../../components/products/related-products/RelatedList";
import BackButton from "../../../components/common/back-button/BackButton";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await productApi.getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail-loading-message">
        Không thể tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="product-detail-page" style={{ position: "relative" }}>
      <BackButton
        style={{ top: "40px", left: "18%" }}
        fallbackPath="/products"
      />
      <div className="product-detail-container">
        <div className="image-container">
          <img
            className="product-image"
            src={product.imageUrl}
            alt={product.name}
          />
        </div>
        <div className="info-container">
          <p className="product-title">{product.name}</p>
          <div className="first-info">
            <p>{product.price.toLocaleString()}₫</p>
            <p style={{ marginLeft: "50px" }}>Số lượng: {product.stock}</p>
          </div>

          {product.type === "pet" && (
            <div className="second-info">
              <p>
                Ngày sinh:{" "}
                {product.birthday &&
                  new Date(product.birthday).toLocaleDateString("vi-VN")}
              </p>
              <p>Giới tính: {product.gender === "male" ? "Đực" : "Cái"}</p>
              <p>Tiêm chủng: {product.vaccinated ? "Đã tiêm" : "Chưa tiêm"}</p>
            </div>
          )}

          {product.type === "tool" && product.brand && (
            <div className="second-info">
              <p>Thương hiệu: {product.brand}</p>
            </div>
          )}

          <div className="main-description">
            <p>Mô tả: </p>
            <p>{product.description}</p>
          </div>
          <div className="button-list">
            <button className="pdetail-add-to-cart">Thêm vào giỏ hàng</button>
            <button
              className="pdetail-go-to-cart"
              onClick={() => navigate("/cart")}
            >
              Đi đến giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <RelatedList />
    </div>
  );
}
