import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  type: "pet" | "tool";
  inCart: boolean;
  onAdd: () => void;
}

export default function ProductCard({
   image, title, description, price, stock, type, onAdd, inCart
}: ProductCardProps) {
  const navigate = useNavigate();
  const [wish, setWish] = useState(false);
  const isPet = type === "pet";
  let label: string;
  let disabled: boolean;

  if (stock < 1) {
    label = "Sold Out";
    disabled = true;
  } else if (isPet) {
    label = inCart ? "Adopted" : "Adopt";
    disabled = inCart;
  } else {
    label = "Add to Cart";
    disabled = false;
  }

  const handleAddToCart = async () => {
    try {
      onAdd();
    } catch (err: any) {
      alert(err || "Thêm vào giỏ hàng thất bại");
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
        onClick={() => navigate("/products/detail")}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" sx={{ mt: 1 }}>
          ${price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions className="button-bar">
        <Button
          onClick={handleAddToCart}
          className="btn"
          size="small"
          startIcon={<ShoppingCart />}
          variant="outlined"
          disabled={stock < 1}
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
