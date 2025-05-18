import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import "./ProductStyle.css";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  stock: number;
  type: "pet" | "tool";
  onAdd: () => void;
  inCartQty: number;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  isWishlistLoading?: boolean;
}

export default function ProductCard({
  id,
  image,
  title,
  price,
  stock,
  type,
  onAdd,
  inCartQty,
  isInWishlist,
  onToggleWishlist,
  isWishlistLoading = false,
}: ProductCardProps) {
  const navigate = useNavigate();

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

  const handleAddToCart = () => {
    onAdd();
  };

  const handleWishlistClick = () => {
    onToggleWishlist(id);
  };

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
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <strong className="card-title">{title}</strong>
          <IconButton
            onClick={handleWishlistClick}
            disabled={isWishlistLoading}
            className="icon-btn"
            size="small"
          >
            {isInWishlist ? <Heart fill="red" stroke="red" /> : <Heart />}
          </IconButton>
        </Typography>
        <Typography variant="subtitle1" color="text.primary" sx={{ mt: 1 }}>
          {price.toLocaleString()}₫
        </Typography>
      </CardContent>
      <CardActions className="button-bar">
        <Button
          onClick={handleAddToCart}
          size="small"
          startIcon={<ShoppingCart />}
          variant="outlined"
          disabled={disabled}
          sx={{
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          {label}
        </Button>
      </CardActions>
    </Card>
  );
}
