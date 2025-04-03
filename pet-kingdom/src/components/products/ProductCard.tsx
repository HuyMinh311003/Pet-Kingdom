import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
}

export default function ProductCard({
  image,
  title,
  description,
  price,
}: ProductCardProps) {
  const navigate = useNavigate();

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
          className="btn"
          size="small"
          startIcon={<ShoppingCart />}
          variant="outlined"
        ></Button>
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
