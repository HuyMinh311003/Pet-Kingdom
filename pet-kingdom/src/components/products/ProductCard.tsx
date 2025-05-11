import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  type: "pet" | "tool";
  onAdd: () => void;
}

export default function ProductCard({
  id, image, title, description, price, stock, type, onAdd
}: ProductCardProps) {
  const navigate = useNavigate();
  const isPet = type === "pet";
  const addLabel = isPet ? "Adopt" : "Add to Cart";


  const handleAddToCart = async () => {
    try {
      onAdd();
    } catch (err: any) {
      alert(err || "Thêm vào giỏ hàng thất bại");
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
      <CardActions className="botton-bar">
        <Button
          onClick={handleAddToCart}
          className="btn"
          size="small"
          startIcon={<ShoppingCart />}
          variant="outlined"
          disabled={stock < 1}
        >
          {stock > 0 ? addLabel : "Sold Out"}
        </Button>
        <Button
          size="small"
          startIcon={<Heart />}
          variant="text"
          color="error"
        ></Button>
      </CardActions>
    </Card>
  );
}
