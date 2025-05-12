import "./RelatedList.css";
import ProductCard from "../ProductCard";
import { useEffect, useState } from "react";
import { productApi } from "../../../services/admin-api/productApi";
import { Product } from "../../../types/admin";
import { useParams } from "react-router-dom";

export default function RelatedList() {
  const { id } = useParams(); // Lấy productId từ URL
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!id) return;
        const res = await productApi.getRelatedProducts(id);
        if (res.success) {
          setRelatedProducts(res.data);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [id]);

  return (
    <div className="related-container">
      <p className="title">Sản phẩm liên quan</p>
      <div className="related-list">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.imageUrl}
            title={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}
