import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cartApi } from "../../services/customer-api/api";

import ReCAPTCHA from 'react-google-recaptcha';
import { useRef } from "react";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  type: "pet" | "tool";
  onAddSuccess?: () => void;
}

export default function ProductCard({
  id, image, title, description, price, stock, type, onAddSuccess
}: ProductCardProps) {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isPet = type === "pet";
  const addLabel = isPet ? "Adopt" : "Add to Cart";

  // AFTER
  const handleAddToCart = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const role = localStorage.getItem("userRole");
      if (role !== "Customer") {
        alert("Chỉ Customer mới được thêm vào giỏ hàng");
        return;
      }
      if (!recaptchaRef.current) {
        alert("reCAPTCHA chưa sẵn sàng, vui lòng thử lại");
        return;
      }
      recaptchaRef.current.execute();
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };


  //callback khi reCAPTCHA trả về token
  const onCaptchaResolved = async (captchaToken: string | null) => {
    if (!captchaToken) {
      alert("Vui lòng hoàn thành CAPTCHA");
      return;
    }

    try {
      const userId = localStorage.getItem("userId")!;
      await cartApi.addItem(userId, id, 1, captchaToken);
      alert("Đã thêm vào giỏ hàng");
      onAddSuccess?.();
    } catch (err: any) {
      alert(err.response?.data?.message || "Thêm vào giỏ hàng thất bại");
    } finally {
      // Reset widget để dùng cho lần sau
      recaptchaRef.current?.reset();
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
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        size="invisible"
        ref={recaptchaRef}
        onChange={onCaptchaResolved}
        onErrored={() => {
          alert("Không thể tải reCAPTCHA, vui lòng kiểm tra Internet");
        }}
        onExpired={() => {
          alert("reCAPTCHA hết hạn, vui lòng thử lại");
          recaptchaRef.current?.reset();
        }}
      />
    </Card>
  );
}
