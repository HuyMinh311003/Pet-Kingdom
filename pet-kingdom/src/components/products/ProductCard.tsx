import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";


interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  stock: number;
  type: "pet" | "tool";
  onAdd: () => void;
  inCartQty: number;
}

export default function ProductCard({
  id, image, title, price, stock, type, onAdd, inCartQty
}: ProductCardProps) {
  const navigate = useNavigate();
  const [wish, setWish] = useState(false);
  const { showToast } = useToast();
  const isPet = type === "pet";
  let label: string;
  let disabled: boolean;

  if (stock < 1) {
    label = "Sold Out";
    disabled = true;

  } else if (isPet) {
    const adopted = inCartQty > 0;
    label = adopted ? "Adopted" : "Adopt";
    disabled = adopted;

  } else {
    const maxReached = inCartQty >= stock;
    label = maxReached ? "Out of stock" : "Add to Cart";
    disabled = maxReached;
  }

  const handleAddToCart = async () => {
    try {
      onAdd();
    } catch (err: any) {
      showToast(err || "Thêm vào giỏ hàng thất bại", "error");
    }
  };

  const handleWishlistClick = () => {
    setWish(prev => !prev);
  };
  const wishlistLabel = wish ? "Wishlisted" : "Add to Wishlist";

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{
          height: 300,
          objectFit: "cover",
        }}
        image={image}
        title={title}
        onClick={() => navigate(`/products/${id}`)}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <strong>{title}</strong>
        </Typography>
        <Typography variant="subtitle1" color="text.primary" sx={{ mt: 1 }}>
          {price.toLocaleString()}₫
        </Typography>
      </CardContent>
      <CardActions className="button-bar">
        <Button
          onClick={handleAddToCart}
          className="btn"
          size="small"
          startIcon={<ShoppingCart />}
          variant="outlined"
          disabled={disabled}
        >
          {label}
        </Button>
        <Button
          onClick={handleWishlistClick}
          size="small"
          startIcon={
            wish
              ? <Heart fill="red" stroke="red" />
              : <Heart />
          }
          variant="outlined"
          color="error"
        >
          {wishlistLabel}
        </Button>
      </CardActions>
    </Card>
  );
}
