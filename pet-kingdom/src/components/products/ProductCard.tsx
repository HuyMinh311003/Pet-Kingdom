import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { wishlistApi } from "../../services/customer-api/wishlistApi";
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
  onToggleWishlist?: (
    productId: string,
    isAdding: boolean,
    callback: () => void
  ) => void;
  refreshWishlist?: () => void;
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
  onToggleWishlist,
  refreshWishlist,
}: ProductCardProps) {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) return;

      try {
        const user = JSON.parse(stored);
        const result = await wishlistApi.checkWishlistItem(user._id, id);
        setIsInWishlist(result.data.isInWishlist);
      } catch (err) {
        console.error("Error checking wishlist status", err);
      }
    };

    checkWishlistStatus();
  }, [id]); // MÀY GIỠN??

  const handleAddToCart = () => {
    onAdd();
  };

  const handleWishlistClick = async () => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      if (onToggleWishlist) {
        onToggleWishlist(id, !isInWishlist, () => {});
      }
      return;
    }

    const user = JSON.parse(stored);
    if (user.role !== "Customer") {
      if (onToggleWishlist) {
        onToggleWishlist(id, !isInWishlist, () => { });
      }
      return;
    }

    setIsLoading(true);

    // Gọi callback từ component cha để xử lý wishlist và toast
    if (onToggleWishlist) {
      onToggleWishlist(id, !isInWishlist, async () => {
        try {
          if (!isInWishlist) {
            await wishlistApi.addToWishlist(user._id, id);
          } else {
            await wishlistApi.removeFromWishlist(user._id, id);
          }

          setIsInWishlist(!isInWishlist);

          // Bấm gỡ wishlist xong reload trang wishlist để nó mất
          if (refreshWishlist) {
            refreshWishlist();
          }
        } catch (err) {
          console.error("Error updating wishlist", err);
        } finally {
          setIsLoading(false);
        }
      });
    }
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
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
        >
          <strong className="card-title">{title}</strong>
          {onToggleWishlist && (
            <IconButton
              onClick={handleWishlistClick}
              disabled={isLoading}
              className="icon-btn"
              size="small"
            >
              {isInWishlist
                ? <Heart fill="red" stroke="red" />
                : <Heart />
              }
            </IconButton>
          )}
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
