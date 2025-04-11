import { useNavigate } from "react-router-dom";
import RelatedList from "../../../components/products/related-products/RelatedList";
import "./ProductDetail.css";
import BackButton from "../../../components/common/back-button/BackButton";

export default function ProductDetail() {
  const navigate = useNavigate();

  return (
    <div className="product-detail-page" style={{ position: "relative" }}>
      <BackButton fallbackPath="/products" />
      <div className="product-detail-container">
        <div className="image-container">
          <img
            className="product-image"
            src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800"
          />
        </div>
        <div className="info-container">
          <p className="product-title">Chó vàng</p>
          <div className="price">
            <p className="old-price">800.000₫</p>
            <p className="product-price">600.000₫</p>
          </div>
          <p className="text">Số lượng: 1</p>
          <div className="sub-description">
            <p className="text">Ngày sinh: 10/5/2018</p>
            <p className="text">Tuổi: 7</p>
            <p className="text">Giới tính: Đực</p>
          </div>
          <p className="text">Tiêm chủng: Đã tiêm</p>
          <div className="main-description">
            <p className="text">Mô tả: </p>
            <p className="text">
              Đây là một mô tả dài nói về sản phẩm. Sản phẩm này được nhập khẩu
              từ nước ngoài với chất lượng tốt. Nó sẽ đem lại cho bạn trải
              nghiệm tốt nhất. Bạn sẽ không phải lo lắng về chất lượng sản phẩm!
            </p>
          </div>
          <div className="button-list">
            <button className="add-to-cart">Thêm vào giỏ hàng</button>
            <button className="go-to-cart" onClick={() => navigate("/cart")}>
              Đi đến giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <RelatedList />
    </div>
  );
}
