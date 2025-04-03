import "./ProductDetail.css";

export default function ProductDetail() {
  return (
    <div className="main">
      <div className="product-detail-container">
        <div className="image-container">
          <div className="image-slider"></div>
        </div>
        <div className="info-container">
          <p className="product-title">Tên sản phẩm</p>
          <div className="price">
            <p className="old-price">1.200.000₫</p>
            <p className="product-price">1.000.000₫</p>
          </div>
          <p>Tồn kho: 30</p>
          <p>Số tuổi</p>
          <p>In Stock: 30</p>
          <p className="product-description">
            Đây là một mô tả dài nói về sản phẩm. Sản phẩm này được nhập từ nước
            ngoài với chất lượng tốt. Nó sẽ đem lại cho bạn trải nghiệm tốt
            nhất. Bạn sẽ không phải lo lắng về chất lượng sản phẩm
          </p>
          <div className="button-list">
            <button className="add-to-cart">Thêm vào giỏ hàng</button>
            <button className="go-to-cart">Đi đến giỏ hàng</button>
          </div>
        </div>
      </div>
      <div className="related-container">
        <p className="title">Sản phẩm liên quan</p>
        <div className="related-list">
          <div className="product"></div>
          <div className="product"></div>
          <div className="product"></div>
          <div className="product"></div>
          <div className="product"></div>
        </div>
      </div>
    </div>
  );
}
