import "./RelatedList.css";
import "../ProductCard";
import ProductCard from "../ProductCard";

const products = [
  {
    id: 1,
    title: "Premium Dog Bed",
    description: "High-quality and comfortable dog bed for your pet.",
    price: 175.0,
    image:
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 1,
    title: "Premium Dog Bed",
    description: "High-quality and comfortable dog bed for your pet.",
    price: 175.0,
    image:
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 1,
    title: "Premium Dog Bed",
    description: "High-quality and comfortable dog bed for your pet.",
    price: 175.0,
    image:
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 1,
    title: "Premium Dog Bed",
    description: "High-quality and comfortable dog bed for your pet.",
    price: 175.0,
    image:
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 1,
    title: "Premium Dog Bed",
    description: "High-quality and comfortable dog bed for your pet.",
    price: 175.0,
    image:
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
  },
];

export default function RelatedList() {
  return (
    <div className="related-container">
      <p className="title">Sản phẩm liên quan</p>
      <div className="related-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}
